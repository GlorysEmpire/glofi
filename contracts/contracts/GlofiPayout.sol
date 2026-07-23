// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./GlofiPool.sol";

/**
 * @title GlofiPayout
 * @dev Handles profit splits for funded traders.
 * Distributes 80% to trader, 15% to pool, 5% to platform treasury.
 * Manages clawbacks on rule violations.
 */
contract GlofiPayout is Ownable {

    // ─── State Variables ───────────────────────────────────────────────

    GlofiPool public pool;
    IERC20 public usdc;
    address public treasury;
    address public evaluator;

    // Split percentages — must add to 100
    uint256 public traderSplit = 80;
    uint256 public poolSplit = 15;
    uint256 public treasurySplit = 5;

    // Track pending payouts per trader
    mapping(address => uint256) public pendingPayout;

    // Track total paid out to each trader lifetime
    mapping(address => uint256) public lifetimePayout;

    // Total platform revenue collected
    uint256 public totalTreasuryRevenue;

    // ─── Events ────────────────────────────────────────────────────────

    event ProfitSubmitted(address indexed trader, uint256 grossProfit);
    event PayoutDistributed(
        address indexed trader,
        uint256 traderAmount,
        uint256 poolAmount,
        uint256 treasuryAmount
    );
    event Clawback(address indexed trader, uint256 amount, string reason);
    event SplitUpdated(uint256 traderSplit, uint256 poolSplit, uint256 treasurySplit);
    event EvaluatorSet(address indexed evaluator);
    event TreasurySet(address indexed treasury);

    // ─── Constructor ───────────────────────────────────────────────────

    constructor(
        address initialOwner,
        address _poolAddress,
        address _usdcAddress,
        address _treasury
    ) Ownable(initialOwner) {
        pool = GlofiPool(_poolAddress);
        usdc = IERC20(_usdcAddress);
        treasury = _treasury;
    }

    // ─── Modifiers ─────────────────────────────────────────────────────

    modifier onlyEvaluator() {
        require(msg.sender == evaluator, "Only evaluator");
        _;
    }

    // ─── Admin Functions ───────────────────────────────────────────────

    function setEvaluator(address _evaluator) external onlyOwner {
        require(_evaluator != address(0), "Invalid address");
        evaluator = _evaluator;
        emit EvaluatorSet(_evaluator);
    }

    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid address");
        treasury = _treasury;
        emit TreasurySet(_treasury);
    }

    /**
     * @dev Update profit split percentages
     * Can only be called by owner — in production this would require governance vote
     * All three values must add up to exactly 100
     */
    function updateSplit(
        uint256 _traderSplit,
        uint256 _poolSplit,
        uint256 _treasurySplit
    ) external onlyOwner {
        require(_traderSplit + _poolSplit + _treasurySplit == 100, "Must equal 100");
        require(_traderSplit >= 70, "Trader split too low");
        traderSplit = _traderSplit;
        poolSplit = _poolSplit;
        treasurySplit = _treasurySplit;
        emit SplitUpdated(_traderSplit, _poolSplit, _treasurySplit);
    }

    // ─── Core Functions ────────────────────────────────────────────────

    /**
     * @dev Submit profit for a funded trader
     * Called by evaluator when a trading period closes with profit
     * Calculates and records the three-way split
     */
    function submitProfit(
        address trader,
        uint256 grossProfit
    ) external onlyEvaluator {
        require(trader != address(0), "Invalid trader");
        require(grossProfit > 0, "No profit to distribute");

        uint256 traderAmount = (grossProfit * traderSplit) / 100;
        uint256 poolAmount = (grossProfit * poolSplit) / 100;
        uint256 treasuryAmount = grossProfit - traderAmount - poolAmount;

        pendingPayout[trader] += traderAmount;

        emit ProfitSubmitted(trader, grossProfit);
        emit PayoutDistributed(trader, traderAmount, poolAmount, treasuryAmount);

        // Send pool share directly to pool
        require(
            usdc.transferFrom(msg.sender, address(pool), poolAmount),
            "Pool transfer failed"
        );

        // Pool receives profit — increases value for all investors
        pool.receiveProfit(poolAmount);

        // Send treasury share
        require(
            usdc.transferFrom(msg.sender, treasury, treasuryAmount),
            "Treasury transfer failed"
        );

        totalTreasuryRevenue += treasuryAmount;

        // Store trader's share for them to claim
        require(
            usdc.transferFrom(msg.sender, address(this), traderAmount),
            "Trader amount transfer failed"
        );
    }

    /**
     * @dev Trader claims their pending payout
     * Pull pattern — safer than pushing funds automatically
     * Prevents reentrancy attacks
     */
    function claimPayout() external {
        uint256 amount = pendingPayout[msg.sender];
        require(amount > 0, "No pending payout");

        // Update state before transfer — prevents reentrancy
        pendingPayout[msg.sender] = 0;
        lifetimePayout[msg.sender] += amount;

        require(
            usdc.transfer(msg.sender, amount),
            "Payout transfer failed"
        );
    }

    /**
     * @dev Clawback funds from a trader who violated rules
     * Called by evaluator when a funded trader breaches risk limits
     * Returns funds to liquidity pool
     */
    function clawback(
        address trader,
        uint256 amount,
        string calldata reason
    ) external onlyEvaluator {
        require(trader != address(0), "Invalid trader");
        require(amount > 0, "Invalid amount");

        // Clear any pending payout for this trader
        pendingPayout[trader] = 0;

        // Return funds to pool
        require(
            usdc.transfer(address(pool), amount),
            "Clawback transfer failed"
        );

        // Release the trader's allocation from reserved liquidity
        pool.releaseLiquidity(trader);

        emit Clawback(trader, amount, reason);
    }

    // ─── View Functions ────────────────────────────────────────────────

    function getPendingPayout(address trader) external view returns (uint256) {
        return pendingPayout[trader];
    }

    function getLifetimePayout(address trader) external view returns (uint256) {
        return lifetimePayout[trader];
    }

    function getCurrentSplit() external view returns (uint256, uint256, uint256) {
        return (traderSplit, poolSplit, treasurySplit);
    }
}