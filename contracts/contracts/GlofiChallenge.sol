// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./GlofiPool.sol";
import "./GlofiToken.sol";

/**
 * @title GlofiChallenge
 * @dev Manages challenge registration, fee collection, rule enforcement,
 * drawdown monitoring and automatic pass/fail evaluation.
 */
contract GlofiChallenge is Ownable {

    // ─── Enums ─────────────────────────────────────────────────────────

    enum ChallengeStatus { Active, Passed, Failed, Closed }
    enum ChallengeTier { Tier1, Tier2, Tier3 }

    // ─── Structs ───────────────────────────────────────────────────────

    struct Challenge {
        address trader;
        ChallengeTier tier;
        uint256 startTime;
        uint256 accountSize;
        uint256 challengeFee;
        uint256 profitTarget;
        uint256 maxDrawdown;
        uint256 minTradingDays;
        uint256 tradingDaysCompleted;
        int256 currentPnL;
        ChallengeStatus status;
        bool funded;
    }

    // ─── State Variables ───────────────────────────────────────────────

    GlofiPool public pool;
    GlofiToken public glofiToken;
    IERC20 public usdc;

    address public evaluator;

    uint256 public challengeCount;

    // Tier configurations
    mapping(ChallengeTier => uint256) public tierAccountSize;
    mapping(ChallengeTier => uint256) public tierFee;
    mapping(ChallengeTier => uint256) public tierProfitTarget;
    mapping(ChallengeTier => uint256) public tierMaxDrawdown;
    mapping(ChallengeTier => uint256) public tierMinTradingDays;

    // Challenge storage
    mapping(uint256 => Challenge) public challenges;
    mapping(address => uint256[]) public traderChallenges;
    mapping(address => bool) public hasActiveChallenge;

    // ─── Events ────────────────────────────────────────────────────────

    event ChallengeRegistered(uint256 indexed challengeId, address indexed trader, ChallengeTier tier, uint256 fee);
    event ChallengeEvaluated(uint256 indexed challengeId, address indexed trader, ChallengeStatus status);
    event ChallengePassed(uint256 indexed challengeId, address indexed trader, uint256 allocation);
    event ChallengeFailed(uint256 indexed challengeId, address indexed trader);
    event AccountClosed(uint256 indexed challengeId, address indexed trader, string reason);
    event EvaluatorSet(address indexed evaluator);

    // ─── Constructor ───────────────────────────────────────────────────

    constructor(
        address initialOwner,
        address _poolAddress,
        address _glofiTokenAddress,
        address _usdcAddress
    ) Ownable(initialOwner) {
        pool = GlofiPool(_poolAddress);
        glofiToken = GlofiToken(_glofiTokenAddress);
        usdc = IERC20(_usdcAddress);

        // Tier 1 — $5,000 funded account (temporarily $100 for testing)
        tierAccountSize[ChallengeTier.Tier1] = 100 * 10**6;
        tierFee[ChallengeTier.Tier1] = 10 * 10**6;
        tierProfitTarget[ChallengeTier.Tier1] = 8;
        tierMaxDrawdown[ChallengeTier.Tier1] = 10;
        tierMinTradingDays[ChallengeTier.Tier1] = 30;

        // Tier 2 — $25,000 funded account
        tierAccountSize[ChallengeTier.Tier2] = 25_000 * 10**6;
        tierFee[ChallengeTier.Tier2] = 149 * 10**6;
        tierProfitTarget[ChallengeTier.Tier2] = 8;
        tierMaxDrawdown[ChallengeTier.Tier2] = 10;
        tierMinTradingDays[ChallengeTier.Tier2] = 30;

        // Tier 3 — $100,000 funded account
        tierAccountSize[ChallengeTier.Tier3] = 100_000 * 10**6;
        tierFee[ChallengeTier.Tier3] = 399 * 10**6;
        tierProfitTarget[ChallengeTier.Tier3] = 8;
        tierMaxDrawdown[ChallengeTier.Tier3] = 10;
        tierMinTradingDays[ChallengeTier.Tier3] = 30;
    }

    // ─── Modifiers ─────────────────────────────────────────────────────

    modifier onlyEvaluator() {
        require(msg.sender == evaluator, "Only evaluator can call this");
        _;
    }

    // ─── Admin Functions ───────────────────────────────────────────────

    function setEvaluator(address _evaluator) external onlyOwner {
        require(_evaluator != address(0), "Invalid address");
        evaluator = _evaluator;
        emit EvaluatorSet(_evaluator);
    }

    // ─── Core Functions ────────────────────────────────────────────────

    /**
     * @dev Register a new challenge
     * Trader pays fee, challenge is created, liquidity checked
     */
    function registerChallenge(ChallengeTier tier) external {
        require(!hasActiveChallenge[msg.sender], "Already has active challenge");

        uint256 fee = tierFee[tier];
        uint256 accountSize = tierAccountSize[tier];

        // Check pool has enough free liquidity
        require(
            pool.getFreeLiquidity() >= accountSize,
            "Insufficient pool liquidity for this tier"
        );

        // Collect challenge fee
        require(
            usdc.transferFrom(msg.sender, address(this), fee),
            "Fee transfer failed"
        );

        // Create challenge
        uint256 challengeId = ++challengeCount;

        challenges[challengeId] = Challenge({
            trader: msg.sender,
            tier: tier,
            startTime: block.timestamp,
            accountSize: accountSize,
            challengeFee: fee,
            profitTarget: tierProfitTarget[tier],
            maxDrawdown: tierMaxDrawdown[tier],
            minTradingDays: tierMinTradingDays[tier],
            tradingDaysCompleted: 0,
            currentPnL: 0,
            status: ChallengeStatus.Active,
            funded: false
        });

        traderChallenges[msg.sender].push(challengeId);
        hasActiveChallenge[msg.sender] = true;

        emit ChallengeRegistered(challengeId, msg.sender, tier, fee);
    }

    /**
     * @dev Submit evaluation results for a challenge
     * Only the evaluator address can call this
     */
    function submitEvaluation(
        uint256 challengeId,
        uint256 tradingDays,
        int256 pnlBasisPoints
    ) external onlyEvaluator {
        Challenge storage challenge = challenges[challengeId];
        require(challenge.status == ChallengeStatus.Active, "Challenge not active");

        challenge.tradingDaysCompleted = tradingDays;
        challenge.currentPnL = pnlBasisPoints;

        // Check max drawdown breach
        if (pnlBasisPoints <= -int256(challenge.maxDrawdown * 100)) {
            _failChallenge(challengeId, "Max drawdown exceeded");
            return;
        }

        // Check if passed
        if (
            tradingDays >= challenge.minTradingDays &&
            pnlBasisPoints >= int256(challenge.profitTarget * 100)
        ) {
            _passChallenge(challengeId);
            return;
        }

        emit ChallengeEvaluated(challengeId, challenge.trader, ChallengeStatus.Active);
    }

    /**
     * @dev Close a funded account due to rule violation
     */
    function closeAccount(uint256 challengeId, string calldata reason) external onlyEvaluator {
        Challenge storage challenge = challenges[challengeId];
        require(challenge.funded, "Not a funded account");
        require(challenge.status == ChallengeStatus.Active, "Challenge not active");

        challenge.status = ChallengeStatus.Closed;
        hasActiveChallenge[challenge.trader] = false;

        pool.releaseLiquidity(challenge.trader);

        emit AccountClosed(challengeId, challenge.trader, reason);
    }

    // ─── Internal Functions ────────────────────────────────────────────

    function _passChallenge(uint256 challengeId) internal {
        Challenge storage challenge = challenges[challengeId];
        challenge.status = ChallengeStatus.Passed;
        challenge.funded = true;

        pool.reserveLiquidity(challenge.trader, challenge.accountSize);

        emit ChallengePassed(challengeId, challenge.trader, challenge.accountSize);
        emit ChallengeEvaluated(challengeId, challenge.trader, ChallengeStatus.Passed);
    }

    function _failChallenge(uint256 challengeId, string memory /* reason */) internal {
        Challenge storage challenge = challenges[challengeId];
        challenge.status = ChallengeStatus.Failed;
        hasActiveChallenge[challenge.trader] = false;

        emit ChallengeFailed(challengeId, challenge.trader);
        emit ChallengeEvaluated(challengeId, challenge.trader, ChallengeStatus.Failed);
    }

    // ─── View Functions ────────────────────────────────────────────────

    function getChallenge(uint256 challengeId) external view returns (Challenge memory) {
        return challenges[challengeId];
    }

    function getTraderChallenges(address trader) external view returns (uint256[] memory) {
        return traderChallenges[trader];
    }

    function getTierInfo(ChallengeTier tier) external view returns (
        uint256 accountSize,
        uint256 fee,
        uint256 profitTarget,
        uint256 maxDrawdown,
        uint256 minTradingDays
    ) {
        return (
            tierAccountSize[tier],
            tierFee[tier],
            tierProfitTarget[tier],
            tierMaxDrawdown[tier],
            tierMinTradingDays[tier]
        );
    }

    function canOpenChallenge(ChallengeTier tier) external view returns (bool) {
        if (hasActiveChallenge[msg.sender]) return false;
        return pool.getFreeLiquidity() >= tierAccountSize[tier];
    }
}