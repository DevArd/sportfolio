// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC20.sol";

contract SportfolioTalentStaking {
    struct Stake {
        uint256 amount;
        uint256 duration;
        uint256 startTimestamp;
        uint256 endTimestamp;
        bool isActive;
    }

    IERC20 private talentToken;
    uint256 private constant FEE_PERCENTAGE = 2;
    address private owner;

    mapping(address => Stake) private stakedBalances;
    mapping(address => uint256) private rewards;

    event Staked(address indexed staker, uint256 amount, uint256 duration);
    event Unstaked(address indexed unstaker, uint256 amount, uint256 reward);

    constructor(address _talentToken) {
        talentToken = IERC20(_talentToken);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function."
        );
        _;
    }

    function stake(uint256 amount, uint256 duration) external {
        uint256 feeAmount = (amount * FEE_PERCENTAGE) / 100;
        uint256 netAmount = amount - feeAmount;

        require(amount > 0, "Amount must be greater than zero");
        require(stakedBalances[msg.sender].amount == 0, "Already staking");

        talentToken.transferFrom(msg.sender, address(this), netAmount);
        talentToken.transferFrom(msg.sender, address(this), feeAmount);

        stakedBalances[msg.sender] = Stake(
            netAmount,
            duration,
            block.timestamp,
            block.timestamp + duration,
            true
        );
        rewards[msg.sender] = 0;

        emit Staked(msg.sender, netAmount, duration);
    }

    function unstake() external {
        Stake storage stake = stakedBalances[msg.sender];
        require(stake.isActive, "Not staking");
        require(
            block.timestamp >= stake.endTimestamp,
            "Staking period not completed"
        );

        uint256 reward = calculateReward(msg.sender);
        uint256 amount = stake.amount;

        talentToken.transfer(msg.sender, amount + reward);

        stake.isActive = false;
        delete stakedBalances[msg.sender];
        delete rewards[msg.sender];

        emit Unstaked(msg.sender, amount, reward);
    }

    function calculateReward(address staker) public view returns (uint256) {
        Stake storage stake = stakedBalances[staker];
        require(stake.isActive, "Not staking");

        uint256 duration = block.timestamp - stake.startTimestamp;
        uint256 reward = (stake.amount * duration) / (stake.duration);

        return reward;
    }

    function getStakedBalance(address staker) public view returns (uint256) {
        return stakedBalances[staker].amount;
    }

    function getStakingEndTimestamp(
        address staker
    ) public view returns (uint256) {
        return stakedBalances[staker].endTimestamp;
    }

    function getRewardBalance(address staker) public view returns (uint256) {
        return rewards[staker];
    }

    function withdrawFees() external onlyOwner {
        uint256 balance = talentToken.balanceOf(address(this));
        require(balance > 0, "No fees to withdraw");

        talentToken.transfer(owner, balance);
    }
}
