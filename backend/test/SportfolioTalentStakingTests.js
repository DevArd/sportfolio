const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const duration = 7 * 24 * 60 * 60;
const durationBN = BigInt(duration);
const amount = ethers.parseEther("1");
const testAmount = ethers.parseEther("1000");

async function deploySportfolioStakingFixture() {
    const [owner, staker] = await ethers.getSigners();

    // Deploy the USDC tokens
    const usdcRewardsToken = await ethers.deployContract("FakeUSDC");
    await usdcRewardsToken.waitForDeployment();
    const usdcRewardsTokenAddress = await usdcRewardsToken.getAddress();

    // Deploy the Sportfolio talent tokens
    const sportfolioTalentToken = await ethers.deployContract("MessiSportfolioToken");
    await sportfolioTalentToken.waitForDeployment();
    const sportfolioTalentTokenAddress = await sportfolioTalentToken.getAddress();
    const mbappeTalentToken = await ethers.deployContract("MBappeSportfolioToken");
    await mbappeTalentToken.waitForDeployment();

    // Deploy the staking contract
    const stakingContract = await ethers.deployContract("SportfolioTalentStaking", [sportfolioTalentTokenAddress, usdcRewardsTokenAddress]);
    await stakingContract.waitForDeployment();
    const stakingContractAddress = await stakingContract.getAddress();

    // Mint tests tokens
    await usdcRewardsToken.connect(owner).mint(stakingContractAddress, amount * BigInt(1_000_000));
    await sportfolioTalentToken.connect(owner).mint(owner.address, amount);
    await sportfolioTalentToken.connect(owner).mint(staker.address, amount);

    // Allow the staking contract to spend sportfolioTalentToken
    await sportfolioTalentToken.connect(owner).approve(stakingContractAddress, testAmount);
    await sportfolioTalentToken.connect(staker).approve(stakingContractAddress, testAmount);
    // await usdcRewardsToken.connect(owner).approve(stakingContractAddress, testAmount);
    // await usdcRewardsToken.connect(staker).approve(stakingContractAddress, testAmount);

    console.log(`Contracts deployed : 
        FakeUSDC[${usdcRewardsTokenAddress}], 
        MessiSportfolioToken[${sportfolioTalentTokenAddress}], 
        SportfolioTalentStaking[${stakingContractAddress}]`);

    return { stakingContract, owner, staker, usdcRewardsToken, sportfolioTalentToken, mbappeTalentToken };
}

describe("SportfolioTalentStaking (View Functions)", function () {
    it("should return total staked amount", async () => {
        const { stakingContract, staker } = await loadFixture(deploySportfolioStakingFixture);

        expect(await stakingContract.totalStaked()).to.equal(0);

        await stakingContract.connect(staker).stake(amount, duration);

        expect(await stakingContract.totalStaked()).to.equal(amount);
    });

    it("should return balance of staker", async () => {
        const { stakingContract, staker } = await loadFixture(deploySportfolioStakingFixture);

        expect(await stakingContract.balanceOf(staker.address)).to.equal(0);

        await stakingContract.connect(staker).stake(amount, duration);

        expect(await stakingContract.balanceOf(staker.address)).to.equal(amount);
    });

    it("should return the rewards earned by staker", async () => {
        const { stakingContract, staker } = await loadFixture(deploySportfolioStakingFixture);

        expect(await stakingContract.earned(staker.address)).to.equal(0);

        await stakingContract.connect(staker).stake(amount, duration);

        const rewardRate = ethers.parseEther("0.01"); // Reward rate of 0.01 USDC per second
        await stakingContract.addRewardAmount(rewardRate * durationBN);

        // Increase the time to the middle of the staking period
        await ethers.provider.send("evm_increaseTime", [duration / 2]);
        await ethers.provider.send("evm_mine");

        const expectedRewards = rewardRate * durationBN / BigInt(2);
        expect(await stakingContract.earned(staker.address)).to.equal(expectedRewards);
    });

    it("should return the reward rate per token staked", async () => {
        const { stakingContract, staker } = await loadFixture(deploySportfolioStakingFixture);

        expect(await stakingContract.rewardPerToken()).to.equal(0);

        await stakingContract.connect(staker).stake(amount, duration);

        const rewardRate = ethers.parseEther("0.01"); // Reward rate of 0.01 USDC per second
        await stakingContract.addRewardAmount(rewardRate * durationBN);

        // Increase the time to the middle of the staking period
        await ethers.provider.send("evm_increaseTime", [duration / 2]);
        await ethers.provider.send("evm_mine");

        const expectedRewardPerToken = rewardRate * durationBN / BigInt(2) * BigInt(1e18) / amount;
        expect(await stakingContract.rewardPerToken()).to.equal(expectedRewardPerToken);
    });

    it("should return the last time rewards were updated", async () => {
        const { stakingContract, staker } = await loadFixture(deploySportfolioStakingFixture);

        expect(await stakingContract.lastTimeRewardApplicable()).to.equal(0);

        await stakingContract.connect(staker).stake(amount, duration);

        const rewardRate = ethers.parseEther("0.01"); // Reward rate of 0.01 USDC per second
        await stakingContract.addRewardAmount(rewardRate * durationBN);

        expect(await stakingContract.lastTimeRewardApplicable()).to.equal((await ethers.provider.getBlock("latest")).timestamp);
    });
});

describe("SportfolioTalentStaking (Stake Function)", function () {
    it("should stake tokens and update staking balance correctly", async () => {
        const { stakingContract, staker, owner } = await loadFixture(deploySportfolioStakingFixture);

        // Stake tokens
        await stakingContract.connect(staker).stake(amount, duration);
        await stakingContract.connect(owner).stake(amount, duration);

        // Check staker's balance
        expect(await stakingContract.balanceOf(staker.address)).to.equal(amount);
        expect(await stakingContract.balanceOf(owner.address)).to.equal(amount);

        // Check total staked amount
        expect(await stakingContract.totalStaked()).to.equal(amount * BigInt(2));
    });

    it("should not allow staking zero amount", async () => {
        const { stakingContract, staker } = await loadFixture(deploySportfolioStakingFixture);

        // Attempt to stake zero amount
        await expect(stakingContract.connect(staker).stake(0, duration)).to.be.revertedWith("Amount must be greater than zero");
    });

    it("should not allow duration zero amount", async () => {
        const { stakingContract, staker } = await loadFixture(deploySportfolioStakingFixture);

        // Attempt to stake zero amount
        await expect(stakingContract.connect(staker).stake(amount, 0)).to.be.revertedWith("Duration must be greater than zero");
    });

    it("should not allow staking without sufficient balance", async () => {
        const { stakingContract, owner } = await loadFixture(deploySportfolioStakingFixture);

        // Attempt to stake without sufficient balance
        await expect(stakingContract.connect(owner).stake(testAmount * BigInt(2), duration)).to.be.revertedWith("ERC20: insufficient allowance");
    });
});

describe("SportfolioTalentStaking (Claim Reward Function)", function () {
    it("should claim rewards correctly", async () => {
        const { stakingContract, usdcRewardsToken, staker } = await loadFixture(deploySportfolioStakingFixture);

        // Add rewards
        const rewardRate = ethers.parseEther("0.01"); // Reward rate of 0.01 USDC per second
        await stakingContract.addRewardAmount(rewardRate * durationBN);

        // Stake tokens
        await stakingContract.connect(staker).stake(amount, duration);

        // Increase block timestamp to simulate the end of the staking period
        await network.provider.send("evm_increaseTime", [duration + 1]);

        // Claim rewards
        await stakingContract.connect(staker).claimReward();

        // Check staker's reward
        const stakerReward = await usdcRewardsToken.balanceOf(staker.address);
        expect(Number(stakerReward)).to.be.gt(0);
    });

    it("should not allow claiming reward without staking", async () => {
        const { stakingContract, staker } = await loadFixture(deploySportfolioStakingFixture);

        // Attempt to claim rewards without staking
        await expect(stakingContract.connect(staker).claimReward()).to.be.revertedWith("Not staking");
    });

    it("should not allow claiming reward before end of staking period", async () => {
        const { stakingContract, staker } = await loadFixture(deploySportfolioStakingFixture);

        // Stake tokens
        await stakingContract.connect(staker).stake(amount, duration);

        // Attempt to claim rewards before the end of staking period
        await expect(stakingContract.connect(staker).claimReward()).to.be.revertedWith("Not yet eligible to claim reward");
    });
});

describe("SportfolioTalentStaking (Unstake Function)", function () {
    it("should unstake tokens and claim rewards correctly", async () => {
        const { stakingContract, usdcRewardsToken, staker } = await loadFixture(deploySportfolioStakingFixture);

        // Add rewards
        const rewardRate = ethers.parseEther("0.01"); // Reward rate of 0.01 USDC per second
        await stakingContract.addRewardAmount(rewardRate * durationBN);

        // Stake tokens
        await stakingContract.connect(staker).stake(amount, duration);

        // Increase block timestamp to simulate the end of the staking period
        await network.provider.send("evm_increaseTime", [duration + 1]);

        // Unstake tokens
        await stakingContract.connect(staker).unstake(amount);

        // Check staker's staked balance
        const stakerBalance = await stakingContract.balanceOf(staker.address);
        expect(Number(stakerBalance)).to.equal(0);

        // Check total staked amount
        const totalStaked = await stakingContract.totalStaked();
        expect(Number(totalStaked)).to.equal(0);

        // Check staker's reward
        const stakerReward = await usdcRewardsToken.balanceOf(staker.address);
        expect(Number(stakerReward)).to.be.gt(0);
    });

    it("should not allow unstaking zero amount", async () => {
        const { stakingContract, staker } = await loadFixture(deploySportfolioStakingFixture);

        // Stake tokens
        await stakingContract.connect(staker).stake(amount, duration);

        // Attempt to unstake zero amount
        await expect(stakingContract.connect(staker).unstake(0)).to.be.revertedWith("Amount must be greater than zero");
    });

    it("should not allow unstaking more than staked amount", async () => {
        const { stakingContract, staker } = await loadFixture(deploySportfolioStakingFixture);

        // Stake tokens
        await stakingContract.connect(staker).stake(amount, duration);

        // Attempt to unstake more than staked amount
        await expect(stakingContract.connect(staker).unstake(amount * BigInt(2))).to.be.revertedWith("Not enough staked tokens");
    });

    it("should not allow unstaking before the end of staking period", async () => {
        const { stakingContract, staker } = await loadFixture(deploySportfolioStakingFixture);

        // Stake tokens
        await stakingContract.connect(staker).stake(amount, duration);

        // Attempt to unstake before the end of staking period
        await expect(stakingContract.connect(staker).unstake(amount)).to.be.revertedWith("Staking period not completed");
    });
});

describe("SportfolioTalentStaking (Add Reward Function)", function () {
    it("should add reward and update reward rate correctly", async () => {
        const { stakingContract, usdcRewardsToken } = await loadFixture(deploySportfolioStakingFixture);

        const rewardAmount = ethers.parseEther("1");

        // Add reward amount
        const stakingContractAddress = await stakingContract.getAddress();
        await usdcRewardsToken.approve(stakingContractAddress, rewardAmount);
        await stakingContract.addRewardAmount(rewardAmount);

        // Check reward rate
        const rewardRate = await stakingContract.rewardRate();
        expect(rewardRate).to.equal(rewardAmount / durationBN);

        // Check last update time
        const lastUpdateTime = await stakingContract.lastUpdateTime();
        expect(lastUpdateTime).to.equal((await ethers.provider.getBlock("latest")).timestamp);

        // Check rewards period finish time
        const rewardsPeriodFinishAt = await stakingContract.rewardsPeriodFinishAt();
        expect(rewardsPeriodFinishAt).to.equal(BigInt(lastUpdateTime) + durationBN);
    });

    it("should not allow adding zero reward", async () => {
        const { stakingContract } = await loadFixture(deploySportfolioStakingFixture);

        // Attempt to add zero reward amount
        await expect(stakingContract.addRewardAmount(0)).to.be.revertedWith("Reward must be greater than zero");
    });

    it("should not allow adding reward more than the contract balance", async () => {
        const { stakingContract, usdcRewardsToken } = await loadFixture(deploySportfolioStakingFixture);

        // Attempt to add reward more than the contract balance
        const stakingContractAddress = await stakingContract.getAddress();
        const contractBalance = await usdcRewardsToken.balanceOf(stakingContractAddress);
        await expect(stakingContract.addRewardAmount(BigInt(contractBalance) + ethers.parseEther("1"))).to.be.revertedWith("Not enough balance for the provided reward");
    });
});

describe("SportfolioTalentStaking (Recover ERC20 Function)", function () {
    it("should recover ERC20 tokens to the owner", async () => {
        const { stakingContract, mbappeTalentToken, owner } = await loadFixture(deploySportfolioStakingFixture);

        // Transfer some tokens to the staking contract
        const mbappeTalentTokenAddress = await mbappeTalentToken.getAddress();
        const stakingContractAddress = await stakingContract.getAddress();
        await mbappeTalentToken.transfer(stakingContractAddress, amount);

        // Recover ERC20 tokens
        await stakingContract.recoverERC20(mbappeTalentTokenAddress, amount);

        // Check staking contract's balance of recovered tokens (should be zero)
        const contractBalance = await mbappeTalentToken.balanceOf(stakingContractAddress);
        expect(contractBalance).to.equal(Number(0));
    });

    it("should not allow recovering staking token", async () => {
        const { stakingContract, sportfolioTalentToken } = await loadFixture(deploySportfolioStakingFixture);

        // Attempt to recover staking token
        await expect(stakingContract.recoverERC20(await sportfolioTalentToken.getAddress(), ethers.parseEther("0.1"))).to.be.revertedWith("Cannot withdraw the staking token");
    });

    it("should not allow recovering reward token", async () => {
        const { stakingContract, usdcRewardsToken } = await loadFixture(deploySportfolioStakingFixture);

        // Attempt to recover reward token
        await expect(stakingContract.recoverERC20(await usdcRewardsToken.getAddress(), ethers.parseEther("0.1"))).to.be.revertedWith("Cannot withdraw the reward token");
    });
});

describe("SportfolioTalentStaking (Set Rewards Duration Function)", function () {
    const newDuration = 14 * 24 * 60 * 60;

    it("should allow the owner to set the rewards duration", async () => {
        const { stakingContract, owner } = await loadFixture(deploySportfolioStakingFixture);

        expect(await stakingContract.rewardsPeriodDuration()).to.equal(duration);

        await stakingContract.connect(owner).setRewardsDuration(newDuration);

        expect(await stakingContract.rewardsPeriodDuration()).to.equal(newDuration);
    });

    it("should not allow non-owner to set the rewards duration", async () => {
        const { stakingContract, staker } = await loadFixture(deploySportfolioStakingFixture);

        await expect(stakingContract.connect(staker).setRewardsDuration(newDuration)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should not allow changing rewards duration while rewards are ongoing", async () => {
        const { stakingContract, owner } = await loadFixture(deploySportfolioStakingFixture);

        await stakingContract.connect(owner).addRewardAmount(ethers.parseEther("1000"));
        await expect(stakingContract.connect(owner).setRewardsDuration(newDuration)).to.be.revertedWith("Previous rewards period must be complete before changing the duration for the new period");
    });
});

describe("SportfolioTalentStaking (Withdraw Fees Function)", function () {
    const rewardAmount = ethers.parseEther("1");

    it("should allow the owner to withdraw fees", async () => {
        const { stakingContract, usdcRewardsToken, owner, staker } = await loadFixture(deploySportfolioStakingFixture);

        // Stake
        await stakingContract.connect(staker).stake(amount, duration);

        // Add reward amount
        const stakingContractAddress = await stakingContract.getAddress();
        await usdcRewardsToken.approve(stakingContractAddress, rewardAmount);
        await stakingContract.addRewardAmount(rewardAmount);

        // Increase the time to the middle of the staking period
        await ethers.provider.send("evm_increaseTime", [duration]);

        // Claim reward
        await stakingContract.connect(staker).claimReward();

        // Check fees before withdrawal
        const total = await stakingContract.totalFees();
        const balanceBefore = await usdcRewardsToken.balanceOf(owner.address);

        // Withdraw fees
        await stakingContract.connect(owner).withdrawFees();

        // Check fees after withdrawal
        expect(await stakingContract.totalFees()).to.equal(0);
        expect(await usdcRewardsToken.balanceOf(owner.address)).to.equal(total + balanceBefore);
    });

    it("should not allow non-owner to withdraw fees", async () => {
        const { stakingContract, staker, usdcRewardsToken } = await loadFixture(deploySportfolioStakingFixture);

        // Stake
        await stakingContract.connect(staker).stake(amount, duration);

        // Add reward amount
        const stakingContractAddress = await stakingContract.getAddress();
        await usdcRewardsToken.approve(stakingContractAddress, rewardAmount);
        await stakingContract.addRewardAmount(rewardAmount);

        // Attempt to withdraw fees as a non-owner
        await expect(stakingContract.connect(staker).withdrawFees()).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should not allow withdrawing zero fees", async () => {
        const { stakingContract, owner } = await loadFixture(deploySportfolioStakingFixture);

        // Attempt to withdraw zero fees
        await expect(stakingContract.connect(owner).withdrawFees()).to.be.revertedWith("No fees to withdraw");
    });
});
