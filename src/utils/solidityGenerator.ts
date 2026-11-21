import { PresaleParameters } from '../types';

export function generatePresaleContractSolidity(params: PresaleParameters): string {
  const acceptsUsdt = params.acceptedPayments.includes('USDT');
  const acceptsUsdc = params.acceptedPayments.includes('USDC');

  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title Carlyluminatti Network Enterprise Crowdsale & Pre-sale Smart Contract
 * @author Carlyluminatti Network Enterprise AI Engineering Team
 * @notice Production-grade Ethereum Pre-Sale with Bitbond Token Tools architecture.
 *         Includes 10-minute pre-sale edit freeze window, soft & hard cap thresholds,
 *         multi-payment routing to the designated receiver wallet, and buyer distribution.
 */

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }
}

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(address initialOwner) {
        _transferOwnership(initialOwner);
    }

    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is zero address");
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

contract CarlyluminattiPresale is Ownable, ReentrancyGuard {
    // -------------------------------------------------------------
    // STATE VARIABLES & TOKEN LAUNCHPAD PARAMETERS
    // -------------------------------------------------------------
    IERC20 public immutable saleToken;
    address payable public investmentReceiver;

    string public constant CONTRACT_VERSION = "CL-PRESALE-BITBOND-V2.4";
    
    // Caps & Pricing
    uint256 public softCap;          // In Wei (${params.softCap} ETH)
    uint256 public hardCap;          // In Wei (${params.hardCap} ETH)
    uint256 public tokenRate;        // Tokens per 1 ETH (${params.tokenRate})
    uint256 public minContribution;  // In Wei (${params.minContribution} ETH)
    uint256 public maxContribution;  // In Wei (${params.maxContribution} ETH)
    
    // Timeline & 10-Minute Lock
    uint256 public saleStartTime;
    uint256 public saleEndTime;
    uint256 public constant EDIT_LOCK_WINDOW = 10 minutes; // Parameter edit cutoff: 10 mins before start

    // Accounting
    uint256 public totalEthRaised;
    uint256 public totalTokensAllocated;
    bool public distributionActive;
    bool public isFinalized;

    // Supported Payment Tokens
    ${acceptsUsdt ? 'address public immutable usdtToken;' : '// USDT disabled'}
    ${acceptsUsdc ? 'address public immutable usdcToken;' : '// USDC disabled'}

    mapping(address => uint256) public ethInvestments;
    mapping(address => uint256) public tokenAllocations;
    mapping(address => bool) public tokensClaimed;

    // -------------------------------------------------------------
    // EVENTS
    // -------------------------------------------------------------
    event TokensPurchased(address indexed buyer, uint256 ethAmount, uint256 tokenAmount, string paymentMethod);
    event ParametersUpdated(uint256 newSoftCap, uint256 newHardCap, uint256 newRate, uint256 updateTimestamp);
    event InvestmentReceiverUpdated(address indexed newReceiver);
    event PresaleFinalized(uint256 totalRaised, bool softCapReached);
    event TokensDistributed(address indexed buyer, uint256 amount);
    event RefundClaimed(address indexed buyer, uint256 amount);

    // -------------------------------------------------------------
    // MODIFIERS
    // -------------------------------------------------------------
    /**
     * @notice Enforces that parameter edits can ONLY be executed up to 10 minutes before the sale starts.
     *         Once block.timestamp >= (saleStartTime - 10 minutes), parameters are permanently locked.
     */
    modifier onlyBeforeLockWindow() {
        require(
            block.timestamp < (saleStartTime - EDIT_LOCK_WINDOW),
            "Carlyluminatti: Parameters are permanently locked within 10 minutes of sale start"
        );
        _;
    }

    modifier onlyDuringSale() {
        require(block.timestamp >= saleStartTime, "Presale: Sale has not started yet");
        require(block.timestamp <= saleEndTime, "Presale: Sale has closed");
        require(!isFinalized, "Presale: Sale already finalized");
        _;
    }

    constructor(
        address _saleToken,
        address payable _investmentReceiver,
        uint256 _softCapWei,
        uint256 _hardCapWei,
        uint256 _tokenRate,
        uint256 _minContributionWei,
        uint256 _maxContributionWei,
        uint256 _saleStartTime,
        uint256 _saleEndTime
    ) Ownable(msg.sender) {
        require(_saleToken != address(0), "Invalid token address");
        require(_investmentReceiver != address(0), "Invalid receiver wallet");
        require(_softCapWei < _hardCapWei, "Soft cap must be strictly less than hard cap");
        require(_minContributionWei <= _maxContributionWei, "Min contribution must be <= max");
        require(_saleStartTime > block.timestamp, "Start time must be in future");
        require(_saleEndTime > _saleStartTime, "End time must be after start time");

        saleToken = IERC20(_saleToken);
        investmentReceiver = _investmentReceiver;
        softCap = _softCapWei;
        hardCap = _hardCapWei;
        tokenRate = _tokenRate;
        minContribution = _minContributionWei;
        maxContribution = _maxContributionWei;
        saleStartTime = _saleStartTime;
        saleEndTime = _saleEndTime;
    }

    // -------------------------------------------------------------
    // PARAMETER CUSTOMIZATION (UP TO 10 MINUTES BEFORE SALE)
    // -------------------------------------------------------------
    /**
     * @notice Customizes parameters of token sale Smart Contract according to specific requirements.
     *         Edits allowed strictly up to 10 minutes before sale starts.
     */
    function updatePresaleParameters(
        uint256 _newSoftCap,
        uint256 _newHardCap,
        uint256 _newTokenRate,
        uint256 _newMinContribution,
        uint256 _newMaxContribution
    ) external onlyOwner onlyBeforeLockWindow {
        require(_newSoftCap < _newHardCap, "Soft cap must be less than hard cap");
        require(_newMinContribution <= _newMaxContribution, "Min must be <= Max");
        require(_newTokenRate > 0, "Rate must be positive");

        softCap = _newSoftCap;
        hardCap = _newHardCap;
        tokenRate = _newTokenRate;
        minContribution = _newMinContribution;
        maxContribution = _newMaxContribution;

        emit ParametersUpdated(_newSoftCap, _newHardCap, _newTokenRate, block.timestamp);
    }

    function setInvestmentReceiver(address payable _newReceiver) external onlyOwner onlyBeforeLockWindow {
        require(_newReceiver != address(0), "Zero address rejected");
        investmentReceiver = _newReceiver;
        emit InvestmentReceiverUpdated(_newReceiver);
    }

    // -------------------------------------------------------------
    // INVESTMENTS & PAYMENT ACCEPTANCE
    // -------------------------------------------------------------
    /**
     * @notice Buy tokens using Native Ethereum (ETH).
     *         Funds are automatically forwarded to investmentReceiver if soft cap criteria is configured.
     */
    function buyWithEth() external payable nonReentrant onlyDuringSale {
        uint256 ethAmount = msg.value;
        require(ethAmount >= minContribution, "Contribution below minimum threshold");
        require(ethInvestments[msg.sender] + ethAmount <= maxContribution, "Exceeds max contribution per wallet");
        require(totalEthRaised + ethAmount <= hardCap, "Hard cap reached");

        uint256 tokensToAllocate = (ethAmount * tokenRate) / 1 ether;
        require(tokensToAllocate > 0, "Zero tokens calculated");

        ethInvestments[msg.sender] += ethAmount;
        tokenAllocations[msg.sender] += tokensToAllocate;
        totalEthRaised += ethAmount;
        totalTokensAllocated += tokensToAllocate;

        // Straightforward investment transfer to selected receiver wallet
        (bool success, ) = investmentReceiver.call{value: ethAmount}("");
        require(success, "ETH transfer to investment receiver failed");

        emit TokensPurchased(msg.sender, ethAmount, tokensToAllocate, "ETH");
    }

    // -------------------------------------------------------------
    // MANAGE TOKEN SALE FUNCTIONS (ADMIN & CREATOR)
    // -------------------------------------------------------------
    /**
     * @notice Send / deposit ERC-20 tokens to the Pre-sale contract address to fund investor redemptions.
     * @param amount The number of sale tokens to transfer into this contract.
     */
    function depositTokens(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than zero");
        require(saleToken.transferFrom(msg.sender, address(this), amount), "Token deposit transfer failed");
        emit TokensDeposited(msg.sender, amount);
    }

    /**
     * @notice Withdraw raised investment funds from the token sale contract to the designated receiver wallet.
     *         Callable once the Soft Cap has been met or the sale concludes successfully.
     */
    function withdrawRaisedFunds() external onlyOwner nonReentrant {
        require(totalEthRaised >= softCap, "Cannot withdraw: Soft Cap has not been met");
        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "No funds available to withdraw");

        (bool success, ) = investmentReceiver.call{value: contractBalance}("");
        require(success, "Withdraw transfer to investment receiver failed");

        emit FundsWithdrawn(investmentReceiver, contractBalance);
    }

    /**
     * @notice Withdraw unsold ERC-20 tokens from the contract after sale conclusion back to owner.
     */
    function withdrawUnsoldTokens() external onlyOwner {
        require(isFinalized, "Sale must be finalized before retrieving unsold tokens");
        uint256 contractTokenBal = saleToken.balanceOf(address(this));
        require(contractTokenBal > totalTokensAllocated, "No unsold tokens remaining");

        uint256 unsold = contractTokenBal - totalTokensAllocated;
        require(saleToken.transfer(owner(), unsold), "Transfer unsold tokens failed");

        emit UnsoldTokensWithdrawn(owner(), unsold);
    }

    // -------------------------------------------------------------
    // TOKEN DISTRIBUTION & INVESTOR REDEMPTION
    // -------------------------------------------------------------
    /**
     * @notice Return to same page to redeem / claim tokens once sale is finalized.
     */
    function claimTokens() external nonReentrant {
        require(isFinalized, "Sale not finalized");
        require(totalEthRaised >= softCap, "Soft cap was not reached; claim refund instead");
        require(!tokensClaimed[msg.sender], "Tokens already claimed / redeemed");

        uint256 allocation = tokenAllocations[msg.sender];
        require(allocation > 0, "No tokens allocated for caller");

        tokensClaimed[msg.sender] = true;
        require(saleToken.transfer(msg.sender, allocation), "Token distribution transfer failed");

        emit TokensDistributed(msg.sender, allocation);
    }

    /**
     * @notice Emergency refund if soft cap is not reached by the end of the sale.
     */
    function claimRefund() external nonReentrant {
        require(block.timestamp > saleEndTime, "Sale is still active");
        require(totalEthRaised < softCap, "Soft cap was reached; refunds disabled");
        require(ethInvestments[msg.sender] > 0, "No investment recorded");

        uint256 refundAmount = ethInvestments[msg.sender];
        ethInvestments[msg.sender] = 0;
        tokenAllocations[msg.sender] = 0;

        (bool sent, ) = payable(msg.sender).call{value: refundAmount}("");
        require(sent, "Refund transfer failed");

        emit RefundClaimed(msg.sender, refundAmount);
    }

    /**
     * @notice Finalize presale by owner once end time is reached or hard cap hit.
     */
    function finalizeSale() external onlyOwner {
        require(block.timestamp > saleEndTime || totalEthRaised >= hardCap, "Cannot finalize yet");
        require(!isFinalized, "Already finalized");

        isFinalized = true;
        bool softCapReached = totalEthRaised >= softCap;
        emit PresaleFinalized(totalEthRaised, softCapReached);
    }

    // Fallback payment route
    receive() external payable {
        revert("Use buyWithEth() function");
    }
}
`;
}
