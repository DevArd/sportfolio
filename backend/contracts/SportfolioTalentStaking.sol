// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title SportfolioTalentStaking
 * @dev Contract for staking and earning rewards in USDC by staking Sportfolio Talent Tokens (representative tokens for athletes).
 */
contract SportfolioTalentStaking is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    /* ========== STATE VARIABLES ========== */

    IERC20 public immutable sportfolioTalentToken;
    IERC20 public immutable usdcRewardsToken;

    struct Staking {
        uint256 amount; // Amount of sportfolioTalentToken staked
        uint256 duration; // Duration of rewards to be paid out (in seconds)
        uint256 startAt; // Minimum of last updated time and reward finish time
        uint256 finishAt; // Timestamp of when the rewards finish
        uint256 rewards; // Rewards to be claimed from staking
        uint256 rewardsPerTokenPaid; // Reward per token paid from staking
        bool isActive; // If the address has an active stake
    }

    // Duration in seconds of the rewards period
    uint256 public rewardsPeriodDuration = 7 days;
    // Reward to be paid out per second
    uint256 public rewardRate = 0;
    // Minimum of last updated time and reward finish time
    uint256 public lastUpdateTime;
    // Timestamp of when the rewards finish
    uint256 public rewardsPeriodFinishAt = 0;
    // Sum of (reward rate * dt * 1e18 / total supply)
    uint256 public rewardsPerTokenStaked;

    // Fee percentage on stake and unstake operations
    uint256 private constant REWARD_FEE_PERCENTAGE = 2;
    // Total staked
    uint256 private _totalStake = 0;
    // Total fees
    uint256 private _totalFees = 0;
    // User address => staking
    mapping(address => Staking) private _stakingBalances;

    /* ========== EVENTS ========== */

    event Staked(address indexed staker, uint256 amount, uint256 duration);
    event Unstaked(address indexed unstaker, uint256 amount);
    event RewardAdded(uint256 reward);
    event RewardClaimed(address indexed staker, uint256 reward);
    event RewardsDurationUpdated(uint256 newDuration);
    event RewardFeesClaimed(uint256 fees);
    event Recovered(address token, uint256 amount);

    /* ========== CONSTRUCTOR ========== */

    /**
     * @dev Constructs the SportfolioTalentStaking contract.
     * @param _talentToken Address of the Sportfolio Talent Token.
     * @param _usdcToken Address of the USDC token used for rewards.
     */
    constructor(address _talentToken, address _usdcToken) {
        sportfolioTalentToken = IERC20(_talentToken);
        usdcRewardsToken = IERC20(_usdcToken);
    }

    /* ========== MODIFIERS ========== */

    modifier updateReward(address _account) {
        rewardsPerTokenStaked = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();

        Staking storage staking = _stakingBalances[_account];
        if (staking.isActive && _account != address(0)) {
            staking.rewards = earned(_account);
            staking.rewardsPerTokenPaid = rewardsPerTokenStaked;
        }

        _;
    }

    modifier isStaker(address account) {
        require(_stakingBalances[account].isActive, "Not staking");
        _;
    }

    /* ========== VIEWS ========== */

    /**
     * @dev Get the total amount staked in the contract.
     * @return The total staked amount.
     */
    function totalStaked() external view returns (uint256) {
        return _totalStake;
    }

    /**
     * @dev Get the staked amount for a specific address.
     * @param account Address of the staker.
     * @return The staked amount for the address.
     */
    function balanceOf(address account) external view returns (uint256) {
        return _stakingBalances[account].amount;
    }

    /**
     * @dev Get the earned rewards for a specific address.
     * @param account Address of the staker.
     * @return The earned rewards for the address.
     */
    function earned(address account) public view returns (uint256) {
        return
            _stakingBalances[account]
                .amount
                .mul(
                    rewardPerToken().sub(
                        _stakingBalances[account].rewardsPerTokenPaid
                    )
                )
                .div(1e18)
                .add(_stakingBalances[account].rewards);
    }

    /**
     * @dev Get the reward for the complete rewards period.
     * @return The reward for the complete rewards period.
     */
    function rewardForDuration() external view returns (uint256) {
        return rewardRate.mul(rewardsPeriodDuration);
    }

    /**
     * @dev Get the reward rate per token staked.
     * @return The reward rate per token staked.
     */
    function rewardPerToken() public view returns (uint256) {
        if (_totalStake == 0) {
            return rewardsPerTokenStaked;
        }
        return
            rewardsPerTokenStaked.add(
                lastTimeRewardApplicable()
                    .sub(lastUpdateTime)
                    .mul(rewardRate)
                    .mul(1e18)
                    .div(_totalStake)
            );
    }

    /**
     * @dev Get the last timestamp when the rewards were updated.
     * @return The last timestamp when the rewards were updated.
     */
    function lastTimeRewardApplicable() public view returns (uint256) {
        return
            block.timestamp < rewardsPeriodFinishAt
                ? block.timestamp
                : rewardsPeriodFinishAt;
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    /**
     * @dev Stake Sportfolio Talent Tokens and start earning rewards.
     * @param amount The amount of Sportfolio Talent Tokens to stake.
     * @param duration The duration of rewards to be paid out (in seconds).
     */
    function stake(
        uint256 amount,
        uint256 duration
    ) external updateReward(msg.sender) {
        require(amount > 0, "Amount must be greater than zero");
        require(duration > 0, "Duration must be greater than zero");

        _totalStake = _totalStake.add(amount);

        Staking storage staking = _stakingBalances[msg.sender];

        if (staking.isActive) {
            // Already staking
            staking.duration = staking.duration.add(duration);
            staking.finishAt = staking.finishAt.add(duration);
            staking.amount = staking.duration.add(amount);
        } else {
            // new staker
            _stakingBalances[msg.sender] = Staking(
                amount,
                duration,
                block.timestamp,
                block.timestamp.add(duration),
                0,
                rewardPerToken(),
                true
            );
        }

        sportfolioTalentToken.safeTransferFrom(
            msg.sender,
            address(this),
            amount
        );

        emit Staked(msg.sender, amount, duration);
    }

    /**
     * @dev Claim rewards for staking Sportfolio Talent Tokens.
     */
    function claimReward()
        public
        updateReward(msg.sender)
        isStaker(msg.sender)
    {
        Staking storage staking = _stakingBalances[msg.sender];
        uint256 rewards = staking.rewards;
        require(rewards > 0, "Not yet eligible to claim reward");

        staking.rewards = 0;

        uint256 feeAmount = rewards.mul(REWARD_FEE_PERCENTAGE).div(100);
        uint256 netAmount = rewards.sub(feeAmount);
        _totalFees = _totalFees.add(feeAmount);

        usdcRewardsToken.safeTransfer(msg.sender, netAmount);
        emit RewardClaimed(msg.sender, netAmount);
    }

    /**
     * @dev Unstake Sportfolio Talent Tokens and claim the rewards.
     * @param amount The amount of Sportfolio Talent Tokens to unstake.
     */
    function unstake(
        uint256 amount
    ) external updateReward(msg.sender) isStaker(msg.sender) {
        require(amount > 0, "Amount must be greater than zero");

        Staking storage staking = _stakingBalances[msg.sender];
        require(staking.amount >= amount, "Not enough staked tokens");

        // Ensure the staking period is completed
        require(
            block.timestamp >= staking.finishAt,
            "Staking period not completed"
        );

        // First claim reward
        claimReward();

        // Reduce the staked amount
        staking.amount = staking.duration.sub(amount);
        _totalStake = _totalStake.sub(amount);

        // If the total staked amount becomes zero, deactivate staking
        if (staking.amount == 0) {
            staking.isActive = false;
        }

        // Transfer the staked tokens back to the user
        sportfolioTalentToken.safeTransfer(msg.sender, amount);

        emit Unstaked(msg.sender, amount);
    }

    /* ========== RESTRICTED FUNCTIONS ========== */

    /**
     * @dev Add rewards to the contract.
     * @param reward The amount of rewards to add.
     */
    function addRewardAmount(
        uint256 reward
    ) external onlyOwner updateReward(address(0)) {
        require(reward > 0, "Reward must be greater than zero");

        if (block.timestamp >= rewardsPeriodFinishAt) {
            // Current period not rewarded
            rewardRate = reward.div(rewardsPeriodDuration);
        } else {
            // Current reward period
            uint256 remaining = rewardsPeriodFinishAt.sub(block.timestamp);
            uint256 leftover = remaining.mul(rewardRate);
            rewardRate = reward.add(leftover).div(rewardsPeriodDuration);
        }

        // Ensure the provided reward amount is not more than the balance in the contract.
        // This keeps the reward rate in the right range, preventing overflows due to
        // very high values of rewardRate in the earned and rewardsPerToken functions;
        // Reward + leftover must be less than 2^256 / 10^18 to avoid overflow.
        uint256 balance = usdcRewardsToken.balanceOf(address(this));
        require(
            rewardRate <= balance.div(rewardsPeriodDuration),
            "Not enough balance for the provided reward"
        );

        lastUpdateTime = block.timestamp;
        rewardsPeriodFinishAt = block.timestamp.add(rewardsPeriodDuration);
        emit RewardAdded(reward);
    }

    /**
     * @dev Recover ERC20 tokens accidentally sent to the contract (excluding staking and reward tokens).
     * @param tokenAddress Address of the ERC20 token to recover.
     * @param tokenAmount Amount of the ERC20 token to recover.
     */
    function recoverERC20(
        address tokenAddress,
        uint256 tokenAmount
    ) external onlyOwner {
        require(
            tokenAddress != address(sportfolioTalentToken),
            "Cannot withdraw the staking token"
        );
        require(
            tokenAddress != address(usdcRewardsToken),
            "Cannot withdraw the reward token"
        );
        IERC20(tokenAddress).safeTransfer(msg.sender, tokenAmount);
        emit Recovered(tokenAddress, tokenAmount);
    }

    /**
     * @dev Set the duration of the rewards period.
     * @param duration The new duration of the rewards period (in seconds).
     */
    function setRewardsDuration(uint256 duration) external onlyOwner {
        require(
            block.timestamp > rewardsPeriodFinishAt,
            "Previous rewards period must be complete before changing the duration for the new period"
        );
        rewardsPeriodDuration = duration;
        emit RewardsDurationUpdated(rewardsPeriodDuration);
    }

    /**
     * @dev Withdraw accumulated fees from the contract.
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = _totalFees;
        require(balance > 0, "No fees to withdraw");

        _totalFees = 0;
        usdcRewardsToken.safeTransfer(msg.sender, balance);
        emit RewardFeesClaimed(balance);
    }
}
