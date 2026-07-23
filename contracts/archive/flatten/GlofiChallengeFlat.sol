// Sources flattened with hardhat v2.28.6 https://hardhat.org

// SPDX-License-Identifier: MIT

// File @openzeppelin/contracts/utils/Context.sol@v5.6.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.1) (utils/Context.sol)

pragma solidity ^0.8.20;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}


// File @openzeppelin/contracts/access/Ownable.sol@v5.6.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (access/Ownable.sol)

pragma solidity ^0.8.20;

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * The initial owner is set to the address provided by the deployer. This can
 * later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error OwnableUnauthorizedAccount(address account);

    /**
     * @dev The owner is not a valid owner account. (eg. `address(0)`)
     */
    error OwnableInvalidOwner(address owner);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
     */
    constructor(address initialOwner) {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(initialOwner);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        if (owner() != _msgSender()) {
            revert OwnableUnauthorizedAccount(_msgSender());
        }
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        if (newOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}


// File @openzeppelin/contracts/interfaces/draft-IERC6093.sol@v5.6.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.5.0) (interfaces/draft-IERC6093.sol)

pragma solidity >=0.8.4;

/**
 * @dev Standard ERC-20 Errors
 * Interface of the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] custom errors for ERC-20 tokens.
 */
interface IERC20Errors {
    /**
     * @dev Indicates an error related to the current `balance` of a `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     * @param balance Current balance for the interacting account.
     * @param needed Minimum amount required to perform a transfer.
     */
    error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed);

    /**
     * @dev Indicates a failure with the token `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     */
    error ERC20InvalidSender(address sender);

    /**
     * @dev Indicates a failure with the token `receiver`. Used in transfers.
     * @param receiver Address to which tokens are being transferred.
     */
    error ERC20InvalidReceiver(address receiver);

    /**
     * @dev Indicates a failure with the `spender`’s `allowance`. Used in transfers.
     * @param spender Address that may be allowed to operate on tokens without being their owner.
     * @param allowance Amount of tokens a `spender` is allowed to operate with.
     * @param needed Minimum amount required to perform a transfer.
     */
    error ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed);

    /**
     * @dev Indicates a failure with the `approver` of a token to be approved. Used in approvals.
     * @param approver Address initiating an approval operation.
     */
    error ERC20InvalidApprover(address approver);

    /**
     * @dev Indicates a failure with the `spender` to be approved. Used in approvals.
     * @param spender Address that may be allowed to operate on tokens without being their owner.
     */
    error ERC20InvalidSpender(address spender);
}

/**
 * @dev Standard ERC-721 Errors
 * Interface of the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] custom errors for ERC-721 tokens.
 */
interface IERC721Errors {
    /**
     * @dev Indicates that an address can't be an owner. For example, `address(0)` is a forbidden owner in ERC-721.
     * Used in balance queries.
     * @param owner Address of the current owner of a token.
     */
    error ERC721InvalidOwner(address owner);

    /**
     * @dev Indicates a `tokenId` whose `owner` is the zero address.
     * @param tokenId Identifier number of a token.
     */
    error ERC721NonexistentToken(uint256 tokenId);

    /**
     * @dev Indicates an error related to the ownership over a particular token. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     * @param tokenId Identifier number of a token.
     * @param owner Address of the current owner of a token.
     */
    error ERC721IncorrectOwner(address sender, uint256 tokenId, address owner);

    /**
     * @dev Indicates a failure with the token `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     */
    error ERC721InvalidSender(address sender);

    /**
     * @dev Indicates a failure with the token `receiver`. Used in transfers.
     * @param receiver Address to which tokens are being transferred.
     */
    error ERC721InvalidReceiver(address receiver);

    /**
     * @dev Indicates a failure with the `operator`’s approval. Used in transfers.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     * @param tokenId Identifier number of a token.
     */
    error ERC721InsufficientApproval(address operator, uint256 tokenId);

    /**
     * @dev Indicates a failure with the `approver` of a token to be approved. Used in approvals.
     * @param approver Address initiating an approval operation.
     */
    error ERC721InvalidApprover(address approver);

    /**
     * @dev Indicates a failure with the `operator` to be approved. Used in approvals.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     */
    error ERC721InvalidOperator(address operator);
}

/**
 * @dev Standard ERC-1155 Errors
 * Interface of the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] custom errors for ERC-1155 tokens.
 */
interface IERC1155Errors {
    /**
     * @dev Indicates an error related to the current `balance` of a `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     * @param balance Current balance for the interacting account.
     * @param needed Minimum amount required to perform a transfer.
     * @param tokenId Identifier number of a token.
     */
    error ERC1155InsufficientBalance(address sender, uint256 balance, uint256 needed, uint256 tokenId);

    /**
     * @dev Indicates a failure with the token `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     */
    error ERC1155InvalidSender(address sender);

    /**
     * @dev Indicates a failure with the token `receiver`. Used in transfers.
     * @param receiver Address to which tokens are being transferred.
     */
    error ERC1155InvalidReceiver(address receiver);

    /**
     * @dev Indicates a failure with the `operator`’s approval. Used in transfers.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     * @param owner Address of the current owner of a token.
     */
    error ERC1155MissingApprovalForAll(address operator, address owner);

    /**
     * @dev Indicates a failure with the `approver` of a token to be approved. Used in approvals.
     * @param approver Address initiating an approval operation.
     */
    error ERC1155InvalidApprover(address approver);

    /**
     * @dev Indicates a failure with the `operator` to be approved. Used in approvals.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     */
    error ERC1155InvalidOperator(address operator);

    /**
     * @dev Indicates an array length mismatch between ids and values in a safeBatchTransferFrom operation.
     * Used in batch transfers.
     * @param idsLength Length of the array of token identifiers
     * @param valuesLength Length of the array of token amounts
     */
    error ERC1155InvalidArrayLength(uint256 idsLength, uint256 valuesLength);
}


// File @openzeppelin/contracts/token/ERC20/IERC20.sol@v5.6.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC20/IERC20.sol)

pragma solidity >=0.4.16;

/**
 * @dev Interface of the ERC-20 standard as defined in the ERC.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the value of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the value of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 value) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the
     * allowance mechanism. `value` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}


// File @openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol@v5.6.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC20/extensions/IERC20Metadata.sol)

pragma solidity >=0.6.2;

/**
 * @dev Interface for the optional metadata functions from the ERC-20 standard.
 */
interface IERC20Metadata is IERC20 {
    /**
     * @dev Returns the name of the token.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the decimals places of the token.
     */
    function decimals() external view returns (uint8);
}


// File @openzeppelin/contracts/token/ERC20/ERC20.sol@v5.6.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.5.0) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.20;




/**
 * @dev Implementation of the {IERC20} interface.
 *
 * This implementation is agnostic to the way tokens are created. This means
 * that a supply mechanism has to be added in a derived contract using {_mint}.
 *
 * TIP: For a detailed writeup see our guide
 * https://forum.openzeppelin.com/t/how-to-implement-erc20-supply-mechanisms/226[How
 * to implement supply mechanisms].
 *
 * The default value of {decimals} is 18. To change this, you should override
 * this function so it returns a different value.
 *
 * We have followed general OpenZeppelin Contracts guidelines: functions revert
 * instead returning `false` on failure. This behavior is nonetheless
 * conventional and does not conflict with the expectations of ERC-20
 * applications.
 */
abstract contract ERC20 is Context, IERC20, IERC20Metadata, IERC20Errors {
    mapping(address account => uint256) private _balances;

    mapping(address account => mapping(address spender => uint256)) private _allowances;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;

    /**
     * @dev Sets the values for {name} and {symbol}.
     *
     * Both values are immutable: they can only be set once during construction.
     */
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    /**
     * @dev Returns the name of the token.
     */
    function name() public view virtual returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the default value returned by this function, unless
     * it's overridden.
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IERC20-balanceOf} and {IERC20-transfer}.
     */
    function decimals() public view virtual returns (uint8) {
        return 18;
    }

    /// @inheritdoc IERC20
    function totalSupply() public view virtual returns (uint256) {
        return _totalSupply;
    }

    /// @inheritdoc IERC20
    function balanceOf(address account) public view virtual returns (uint256) {
        return _balances[account];
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - the caller must have a balance of at least `value`.
     */
    function transfer(address to, uint256 value) public virtual returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, value);
        return true;
    }

    /// @inheritdoc IERC20
    function allowance(address owner, address spender) public view virtual returns (uint256) {
        return _allowances[owner][spender];
    }

    /**
     * @dev See {IERC20-approve}.
     *
     * NOTE: If `value` is the maximum `uint256`, the allowance is not updated on
     * `transferFrom`. This is semantically equivalent to an infinite approval.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function approve(address spender, uint256 value) public virtual returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, value);
        return true;
    }

    /**
     * @dev See {IERC20-transferFrom}.
     *
     * Skips emitting an {Approval} event indicating an allowance update. This is not
     * required by the ERC. See {xref-ERC20-_approve-address-address-uint256-bool-}[_approve].
     *
     * NOTE: Does not update the allowance if the current allowance
     * is the maximum `uint256`.
     *
     * Requirements:
     *
     * - `from` and `to` cannot be the zero address.
     * - `from` must have a balance of at least `value`.
     * - the caller must have allowance for ``from``'s tokens of at least
     * `value`.
     */
    function transferFrom(address from, address to, uint256 value) public virtual returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, value);
        _transfer(from, to, value);
        return true;
    }

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to`.
     *
     * This internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * NOTE: This function is not virtual, {_update} should be overridden instead.
     */
    function _transfer(address from, address to, uint256 value) internal {
        if (from == address(0)) {
            revert ERC20InvalidSender(address(0));
        }
        if (to == address(0)) {
            revert ERC20InvalidReceiver(address(0));
        }
        _update(from, to, value);
    }

    /**
     * @dev Transfers a `value` amount of tokens from `from` to `to`, or alternatively mints (or burns) if `from`
     * (or `to`) is the zero address. All customizations to transfers, mints, and burns should be done by overriding
     * this function.
     *
     * Emits a {Transfer} event.
     */
    function _update(address from, address to, uint256 value) internal virtual {
        if (from == address(0)) {
            // Overflow check required: The rest of the code assumes that totalSupply never overflows
            _totalSupply += value;
        } else {
            uint256 fromBalance = _balances[from];
            if (fromBalance < value) {
                revert ERC20InsufficientBalance(from, fromBalance, value);
            }
            unchecked {
                // Overflow not possible: value <= fromBalance <= totalSupply.
                _balances[from] = fromBalance - value;
            }
        }

        if (to == address(0)) {
            unchecked {
                // Overflow not possible: value <= totalSupply or value <= fromBalance <= totalSupply.
                _totalSupply -= value;
            }
        } else {
            unchecked {
                // Overflow not possible: balance + value is at most totalSupply, which we know fits into a uint256.
                _balances[to] += value;
            }
        }

        emit Transfer(from, to, value);
    }

    /**
     * @dev Creates a `value` amount of tokens and assigns them to `account`, by transferring it from address(0).
     * Relies on the `_update` mechanism
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * NOTE: This function is not virtual, {_update} should be overridden instead.
     */
    function _mint(address account, uint256 value) internal {
        if (account == address(0)) {
            revert ERC20InvalidReceiver(address(0));
        }
        _update(address(0), account, value);
    }

    /**
     * @dev Destroys a `value` amount of tokens from `account`, lowering the total supply.
     * Relies on the `_update` mechanism.
     *
     * Emits a {Transfer} event with `to` set to the zero address.
     *
     * NOTE: This function is not virtual, {_update} should be overridden instead
     */
    function _burn(address account, uint256 value) internal {
        if (account == address(0)) {
            revert ERC20InvalidSender(address(0));
        }
        _update(account, address(0), value);
    }

    /**
     * @dev Sets `value` as the allowance of `spender` over the `owner`'s tokens.
     *
     * This internal function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `owner` cannot be the zero address.
     * - `spender` cannot be the zero address.
     *
     * Overrides to this logic should be done to the variant with an additional `bool emitEvent` argument.
     */
    function _approve(address owner, address spender, uint256 value) internal {
        _approve(owner, spender, value, true);
    }

    /**
     * @dev Variant of {_approve} with an optional flag to enable or disable the {Approval} event.
     *
     * By default (when calling {_approve}) the flag is set to true. On the other hand, approval changes made by
     * `_spendAllowance` during the `transferFrom` operation sets the flag to false. This saves gas by not emitting any
     * `Approval` event during `transferFrom` operations.
     *
     * Anyone who wishes to continue emitting `Approval` events on the `transferFrom` operation can force the flag to
     * true using the following override:
     *
     * ```solidity
     * function _approve(address owner, address spender, uint256 value, bool) internal virtual override {
     *     super._approve(owner, spender, value, true);
     * }
     * ```
     *
     * Requirements are the same as {_approve}.
     */
    function _approve(address owner, address spender, uint256 value, bool emitEvent) internal virtual {
        if (owner == address(0)) {
            revert ERC20InvalidApprover(address(0));
        }
        if (spender == address(0)) {
            revert ERC20InvalidSpender(address(0));
        }
        _allowances[owner][spender] = value;
        if (emitEvent) {
            emit Approval(owner, spender, value);
        }
    }

    /**
     * @dev Updates `owner`'s allowance for `spender` based on spent `value`.
     *
     * Does not update the allowance value in case of infinite allowance.
     * Revert if not enough allowance is available.
     *
     * Does not emit an {Approval} event.
     */
    function _spendAllowance(address owner, address spender, uint256 value) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance < type(uint256).max) {
            if (currentAllowance < value) {
                revert ERC20InsufficientAllowance(spender, currentAllowance, value);
            }
            unchecked {
                _approve(owner, spender, currentAllowance - value, false);
            }
        }
    }
}


// File contracts/GlofiToken.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.20;


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


// File contracts/GlofiPool.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.20;



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


// File contracts/GlofiChallenge.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.20;



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

        // Tier 1 — $5,000 funded account
        tierAccountSize[ChallengeTier.Tier1] = 5_000 * 10**6;
        tierFee[ChallengeTier.Tier1] = 49 * 10**6;
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

    function _failChallenge(uint256 challengeId, string memory reason) internal {
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
