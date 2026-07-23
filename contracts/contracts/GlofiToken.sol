// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GlofiToken
 * @dev The GLOFI governance token — represents investor ownership in the pool.
 * Minted when investors deposit USDC, burned when they withdraw.
 * Carries voting rights proportional to holdings.
 */
contract GlofiToken is ERC20, Ownable {

    // The liquidity pool contract address — only this can mint and burn tokens
    address public liquidityPool;

    // Track total USDC deposited by each investor
    mapping(address => uint256) public usdcDeposited;

    // Events — broadcast to the frontend when something important happens
    event TokensMinted(address indexed investor, uint256 amount);
    event TokensBurned(address indexed investor, uint256 amount);
    event LiquidityPoolSet(address indexed poolAddress);

    // Constructor — runs once when deployed
    // Sets the token name, symbol, and initial owner
    constructor(address initialOwner) 
        ERC20("Glofi Token", "GLOFI") 
        Ownable(initialOwner) 
    {
        // Mint founding allocation to the owner — 15% of initial supply
        // 15,000,000 tokens with 18 decimal places
        _mint(initialOwner, 15_000_000 * 10 ** decimals());
    }

    // Set the liquidity pool address — only owner can do this
    // Called once after the pool contract is deployed
    function setLiquidityPool(address _poolAddress) external onlyOwner {
        require(_poolAddress != address(0), "Invalid pool address");
        liquidityPool = _poolAddress;
        emit LiquidityPoolSet(_poolAddress);
    }

    // Modifier — restricts function to liquidity pool only
    modifier onlyPool() {
        require(msg.sender == liquidityPool, "Only liquidity pool can call this");
        _;
    }

    // Mint tokens to an investor when they deposit USDC
    // Only the liquidity pool contract can call this
    function mint(address investor, uint256 amount) external onlyPool {
        require(investor != address(0), "Invalid investor address");
        require(amount > 0, "Amount must be greater than zero");
        usdcDeposited[investor] += amount;
        _mint(investor, amount);
        emit TokensMinted(investor, amount);
    }

    // Burn tokens from an investor when they withdraw
    // Only the liquidity pool contract can call this
    function burn(address investor, uint256 amount) external onlyPool {
        require(amount > 0, "Amount must be greater than zero");
        require(balanceOf(investor) >= amount, "Insufficient token balance");
        usdcDeposited[investor] -= amount;
        _burn(investor, amount);
        emit TokensBurned(investor, amount);
    }

    // View function — get an investor's token balance
    // Free to call, no gas needed
    function getBalance(address investor) external view returns (uint256) {
        return balanceOf(investor);
    }

    // View function — get an investor's USDC deposited
    function getUsdcDeposited(address investor) external view returns (uint256) {
        return usdcDeposited[investor];
    }

    // View function — get total token supply
    function getTotalSupply() external view returns (uint256) {
        return totalSupply();
    }
}