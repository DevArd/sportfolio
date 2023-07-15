// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract SportfolioTalentStaking is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IERC20 public immutable sportfolioTalentToken;
    IERC20 public immutable usdcRewardsToken;

    struct Staking {
        uint256 amount; // Amount of sportfolioTalentToken staked
        uint256 duration; // Duration of rewards to be paid out (in seconds)
        uint256 startAt; // Minimum of last updated time and reward finish time
        uint256 finishAt; // Timestamp of when the rewards finish
        uint256 reward; // Rewards to be claimed from staking
        uint256 rewardPerTokenPaid; // Reward per token paid from staking
        bool isActive; // If the address stake
    }

    // Timestamp of when the rewards finish
    uint256 public rewardsDuration = 30 days;
    // Minimum of last updated time and reward finish time
    uint256 public lastUpdateTime;
    // ???
    uint256 public periodFinish = 0;
    // Reward to be paid out per second
    uint256 public rewardRate = 0;
    // Sum of (reward rate * dt * 1e18 / total supply)
    uint256 public rewardPerTokenStaked;

    // Fee percentage on stake and unstake operations
    uint256 private constant REWARD_FEE_PERCENTAGE = 2;
    // Total staked
    uint256 private _totalStake;
    // Total fees
    uint256 private _totalFees;
    // User address => staking
    mapping(address => Staking) private _stakingBalances;

    event Staked(address indexed staker, uint256 amount, uint256 duration);
    event Unstaked(address indexed unstaker, uint256 amount);
    event RewardAdded(uint256 reward);
    event RewardClaimed(address indexed staker, uint256 reward);
    event RewardsDurationUpdated(uint256 newDuration);
    event RewardFeesClaimed(uint256 fees);

    constructor(address _talentToken, address _usdcToken) {
        sportfolioTalentToken = IERC20(_talentToken);
        usdcRewardsToken = IERC20(_usdcToken);
    }

    /* ========== MODIFIERS ========== */

    modifier updateReward(address _account) {
        rewardPerTokenStaked = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();

        Staking storage staking = _stakingBalances[_account];
        if (staking.isActive) {
            staking.reward = earned(_account);
            staking.rewardPerTokenPaid = rewardPerTokenStaked;
        }

        _;
    }

    modifier isStaker(address account) {
        require(_stakingBalances[account].isActive, "Not staking");
        _;
    }

    /* ========== VIEWS ========== */

    function totalStaked() external view returns (uint256) {
        return _totalStake;
    }

    function balanceOf(address account) external view returns (uint256) {
        return _stakingBalances[account].amount;
    }

    function earned(address account) public view returns (uint256) {
        return
            _stakingBalances[account]
                .amount
                .mul(
                    rewardPerToken().sub(
                        _stakingBalances[account].rewardPerTokenPaid
                    )
                )
                .div(1e18)
                .add(_stakingBalances[account].reward);
    }

    function rewardForDuration() external view returns (uint256) {
        return rewardRate.mul(rewardsDuration);
    }

    function rewardPerToken() public view returns (uint256) {
        if (_totalStake == 0) {
            return rewardPerTokenStaked;
        }
        return
            rewardPerTokenStaked.add(
                lastTimeRewardApplicable()
                    .sub(lastUpdateTime)
                    .mul(rewardRate)
                    .mul(1e18)
                    .div(_totalStake)
            );
    }

    function lastTimeRewardApplicable() public view returns (uint256) {
        return block.timestamp < periodFinish ? block.timestamp : periodFinish;
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    function stake(
        uint256 amount,
        uint256 duration
    ) external updateReward(msg.sender) {
        require(amount > 0, "Amount must be greater than zero");

        _totalStake = _totalStake.add(amount);

        Staking storage staking = _stakingBalances[msg.sender];

        if (staking.isActive) {
            // Already staking
            staking.duration = staking.duration.add(duration);
            staking.amount = staking.duration.add(amount);
        } else {
            // new staker
            _stakingBalances[msg.sender] = Staking(
                amount,
                duration,
                block.timestamp,
                block.timestamp + duration,
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

    function claimReward()
        public
        updateReward(msg.sender)
        isStaker(msg.sender)
    {
        Staking storage staking = _stakingBalances[msg.sender];
        uint256 rewards = staking.reward;
        if (rewards > 0) {
            staking.reward = 0;

            uint256 feeAmount = (rewards * REWARD_FEE_PERCENTAGE) / 100;
            uint256 netAmount = rewards - feeAmount;
            _totalFees = _totalFees.add(feeAmount);

            usdcRewardsToken.safeTransfer(msg.sender, netAmount);
            emit RewardClaimed(msg.sender, netAmount);
        }
    }

    function unstake(
        uint256 amount
    ) external updateReward(msg.sender) isStaker(msg.sender) {
        require(amount > 0, "Amount must be greater than zero");

        Staking storage staking = _stakingBalances[msg.sender];

        require(staking.amount >= amount, "Not enough staked tokens");
        require(
            block.timestamp >= staking.finishAt,
            "Staking period not completed"
        );

        // First claim reward
        claimReward();

        if (staking.amount == amount) {
            // Total withdraw
            delete _stakingBalances[msg.sender];
        } else {
            // Partial withdraw
            staking.amount = staking.duration.sub(amount);
        }

        _totalStake = _totalStake.sub(amount);
        sportfolioTalentToken.safeTransfer(msg.sender, amount);

        emit Unstaked(msg.sender, amount);
    }

    /* ========== RESTRICTED FUNCTIONS ========== */

    function withdrawFees() external onlyOwner {
        uint256 balance = _totalFees;
        require(balance > 0, "No fees to withdraw");

        _totalFees = 0;
        usdcRewardsToken.safeTransfer(msg.sender, balance);
        emit RewardFeesClaimed(balance);
    }
}
