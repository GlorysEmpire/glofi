// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./GlofiToken.sol";

/**
 * @title GlofiPool
 * @dev The Glofi liquidity pool — holds investor USDC, manages shares,
 * enforces liquidity protection, allocates capital to funded traders.
 */
contract GlofiPool is Ownable {

    // ─── State Variables ───────────────────────────────────────────────

    // The USDC token contract — what investors deposit
    IERC20 public usdc;

    // The GLOFI governance token contract
    GlofiToken public glofiToken;

    // The challenge contract — only this can request allocations
    address public challengeContract;

    // Total USDC currently in the pool
    uint256 public totalPoolValue;

    // USDC locked for active funded traders — cannot be withdrawn
    uint256 public reservedLiquidity;

    // Track each investor's deposited amount
    mapping(address => uint256) public investorDeposit;

    // Track each funded trader's allocated amount
    mapping(address => uint256) public traderAllocation;

    // ─── Events ────────────────────────────────────────────────────────

    event Deposited(address indexed investor, uint256 usdcAmount, uint256 tokensReceived);
    event Withdrawn(address indexed investor, uint256 usdcAmount, uint256 tokensBurned);
    event LiquidityReserved(address indexed trader, uint256 amount);
    event LiquidityReleased(address indexed trader, uint256 amount);
    event ProfitReceived(address indexed trader, uint256 amount);
    event ChallengeContractSet(address indexed contractAddress);

    // ─── Constructor ───────────────────────────────────────────────────

    constructor(
        address initialOwner,
        address _usdcAddress,
        address _glofiTokenAddress
    ) Ownable(initialOwner) {
        usdc = IERC20(_usdcAddress);
        glofiToken = GlofiToken(_glofiTokenAddress);
    }

    // ─── Admin Functions ───────────────────────────────────────────────

    // Set the challenge contract address — only owner
    function setChallengeContract(address _challengeContract) external onlyOwner {
        require(_challengeContract != address(0), "Invalid address");
        challengeContract = _challengeContract;
        emit ChallengeContractSet(_challengeContract);
    }

    // ─── Modifiers ─────────────────────────────────────────────────────

    modifier onlyChallenge() {
        require(msg.sender == challengeContract, "Only challenge contract");
        _;
    }

    // ─── Investor Functions ────────────────────────────────────────────

    /**
     * @dev Investor deposits USDC into the pool
     * Receives GLOFI tokens proportional to their share
     * Must approve this contract to spend USDC first
     */
    function deposit(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");

        // Transfer USDC from investor to this contract
        require(
            usdc.transferFrom(msg.sender, address(this), amount),
            "USDC transfer failed"
        );

        // Calculate tokens to mint
        uint256 tokensToMint;
        uint256 currentSupply = glofiToken.getTotalSupply();

        if (currentSupply == 0 || totalPoolValue == 0) {
            // First deposit — 1:1 ratio
            tokensToMint = amount;
        } else {
            // Subsequent deposits — proportional to pool value
            tokensToMint = (amount * currentSupply) / totalPoolValue;
        }

        // Update pool value and investor record
        totalPoolValue += amount;
        investorDeposit[msg.sender] += amount;

        // Mint GLOFI tokens to investor
        glofiToken.mint(msg.sender, tokensToMint);

        emit Deposited(msg.sender, amount, tokensToMint);
    }

    /**
     * @dev Investor withdraws USDC by burning GLOFI tokens
     * Can only withdraw from free liquidity
     */
    function withdraw(uint256 tokenAmount) external {
        require(tokenAmount > 0, "Amount must be greater than zero");
        require(
            glofiToken.balanceOf(msg.sender) >= tokenAmount,
            "Insufficient token balance"
        );

        uint256 currentSupply = glofiToken.getTotalSupply();
        require(currentSupply > 0, "No tokens in circulation");

        // Calculate USDC to return based on share of pool
        uint256 usdcToReturn = (tokenAmount * totalPoolValue) / currentSupply;

        // Check free liquidity is sufficient
        uint256 freeLiquidity = totalPoolValue - reservedLiquidity;
       require(usdcToReturn <= freeLiquidity, "Insufficient free liquidity - funded traders active");

        // Update state before transfer
        totalPoolValue -= usdcToReturn;
        investorDeposit[msg.sender] -= usdcToReturn;

        // Burn GLOFI tokens
        glofiToken.burn(msg.sender, tokenAmount);

        // Transfer USDC back to investor
        require(
            usdc.transfer(msg.sender, usdcToReturn),
            "USDC transfer failed"
        );

        emit Withdrawn(msg.sender, usdcToReturn, tokenAmount);
    }

    // ─── Liquidity Protection Functions ────────────────────────────────

    /**
     * @dev Reserve liquidity for a funded trader
     * Called by challenge contract when trader passes
     * Locks USDC so investors cannot withdraw it
     */
    function reserveLiquidity(address trader, uint256 amount) external onlyChallenge {
        require(amount > 0, "Amount must be greater than zero");

        // Check free liquidity is sufficient
        uint256 freeLiquidity = totalPoolValue - reservedLiquidity;
        require(amount <= freeLiquidity, "Insufficient free liquidity");

        // Reserve the allocation
        reservedLiquidity += amount;
        traderAllocation[trader] += amount;

        emit LiquidityReserved(trader, amount);
    }

    /**
     * @dev Release reserved liquidity when a challenge concludes
     * Called when trader is paid out or account is closed
     */
    function releaseLiquidity(address trader) external onlyChallenge {
        uint256 allocation = traderAllocation[trader];
        require(allocation > 0, "No allocation to release");

        reservedLiquidity -= allocation;
        traderAllocation[trader] = 0;

        emit LiquidityReleased(trader, allocation);
    }

    /**
     * @dev Receive profit from a successful trader
     * Increases pool value — benefits all token holders
     */
    function receiveProfit(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        require(
            usdc.transferFrom(msg.sender, address(this), amount),
            "USDC transfer failed"
        );
        totalPoolValue += amount;
        emit ProfitReceived(msg.sender, amount);
    }

    // ─── View Functions ────────────────────────────────────────────────

    // Get free liquidity available for new challenges
    function getFreeLiquidity() external view returns (uint256) {
        return totalPoolValue - reservedLiquidity;
    }

    // Get an investor's current USDC value based on token holdings
    function getInvestorValue(address investor) external view returns (uint256) {
        uint256 tokenBalance = glofiToken.balanceOf(investor);
        uint256 currentSupply = glofiToken.getTotalSupply();
        if (currentSupply == 0) return 0;
        return (tokenBalance * totalPoolValue) / currentSupply;
    }

    // Get a trader's current allocation
    function getTraderAllocation(address trader) external view returns (uint256) {
        return traderAllocation[trader];
    }

    // Get pool statistics
    function getPoolStats() external view returns (
        uint256 _totalPoolValue,
        uint256 _reservedLiquidity,
        uint256 _freeLiquidity,
        uint256 _totalTokenSupply
    ) {
        return (
            totalPoolValue,
            reservedLiquidity,
            totalPoolValue - reservedLiquidity,
            glofiToken.getTotalSupply()
        );
    }
}