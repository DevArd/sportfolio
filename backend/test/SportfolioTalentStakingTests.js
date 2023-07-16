const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const duration = 7 * 24 * 60 * 60;
const durationBN = BigInt(duration);
const amount = ethers.parseEther("10");
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

    // Deploy the staking contract
    const stakingContract = await ethers.deployContract("SportfolioTalentStaking", [sportfolioTalentTokenAddress, usdcRewardsTokenAddress]);
    await stakingContract.waitForDeployment();
    const stakingContractAddress = await stakingContract.getAddress();

    // Mint tests tokens
    await usdcRewardsToken.connect(owner).mint(stakingContractAddress, amount * BigInt(1000));
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

    return { stakingContract, owner, staker, usdcRewardsToken, sportfolioTalentToken };
}

// describe("SportfolioTalentStaking (View Functions)", function () {
//     it("should return total staked amount", async () => {
//         const { stakingContract, staker } = await loadFixture(deploySportfolioStakingFixture);

//         expect(await stakingContract.totalStaked()).to.equal(0);

//         await stakingContract.connect(staker).stake(amount, duration);

//         expect(await stakingContract.totalStaked()).to.equal(amount);
//     });

//     it("should return balance of staker", async () => {
//         const { stakingContract, staker } = await loadFixture(deploySportfolioStakingFixture);

//         expect(await stakingContract.balanceOf(staker.address)).to.equal(0);

//         await stakingContract.connect(staker).stake(amount, duration);

//         expect(await stakingContract.balanceOf(staker.address)).to.equal(amount);
//     });

//     it("should return the rewards earned by staker", async () => {
//         const { stakingContract, staker } = await loadFixture(deploySportfolioStakingFixture);

//         expect(await stakingContract.earned(staker.address)).to.equal(0);

//         await stakingContract.connect(staker).stake(amount, duration);

//         const rewardRate = ethers.parseEther("0.01"); // Reward rate of 0.01 USDC per second
//         await stakingContract.addRewardAmount(rewardRate * durationBN);

//         // Increase the time to the middle of the staking period
//         await ethers.provider.send("evm_increaseTime", [duration / 2]);
//         await ethers.provider.send("evm_mine");

//         const expectedRewards = rewardRate * durationBN / BigInt(2);
//         expect(await stakingContract.earned(staker.address)).to.equal(expectedRewards);
//     });

//     it("should return the reward rate per token staked", async () => {
//         const { stakingContract, staker } = await loadFixture(deploySportfolioStakingFixture);

//         expect(await stakingContract.rewardPerToken()).to.equal(0);

//         await stakingContract.connect(staker).stake(amount, duration);

//         const rewardRate = ethers.parseEther("0.01"); // Reward rate of 0.01 USDC per second
//         await stakingContract.addRewardAmount(rewardRate * durationBN);

//         // Increase the time to the middle of the staking period
//         await ethers.provider.send("evm_increaseTime", [duration / 2]);
//         await ethers.provider.send("evm_mine");

//         const expectedRewardPerToken = rewardRate * durationBN / BigInt(2) * BigInt(1e18) / amount;
//         expect(await stakingContract.rewardPerToken()).to.equal(expectedRewardPerToken);
//     });

//     it("should return the last time rewards were updated", async () => {
//         const { stakingContract, staker } = await loadFixture(deploySportfolioStakingFixture);

//         expect(await stakingContract.lastTimeRewardApplicable()).to.equal(0);

//         await stakingContract.connect(staker).stake(amount, duration);

//         const rewardRate = ethers.parseEther("0.01"); // Reward rate of 0.01 USDC per second
//         await stakingContract.addRewardAmount(rewardRate * durationBN);

//         const currentBlock = await ethers.provider.getBlockNumber();
//         expect(await stakingContract.lastTimeRewardApplicable()).to.equal((await ethers.provider.getBlock(currentBlock)).timestamp);
//     });
// });

// describe("SportfolioTalentStaking (Stake Function)", function () {
//     it("should stake tokens and update staking balance correctly", async () => {
//         const { stakingContract, staker, owner } = await loadFixture(deploySportfolioStakingFixture);

//         // Stake tokens
//         await stakingContract.connect(staker).stake(amount, duration);
//         await stakingContract.connect(owner).stake(amount, duration);

//         // Check staker's balance
//         expect(await stakingContract.balanceOf(staker.address)).to.equal(amount);
//         expect(await stakingContract.balanceOf(owner.address)).to.equal(amount);

//         // Check total staked amount
//         expect(await stakingContract.totalStaked()).to.equal(amount * BigInt(2));
//     });

//     it("should not allow staking zero amount", async () => {
//         const { stakingContract, staker } = await loadFixture(deploySportfolioStakingFixture);

//         // Attempt to stake zero amount
//         await expect(stakingContract.connect(staker).stake(0, duration)).to.be.revertedWith("Amount must be greater than zero");
//     });

//     it("should not allow duration zero amount", async () => {
//         const { stakingContract, staker } = await loadFixture(deploySportfolioStakingFixture);

//         // Attempt to stake zero amount
//         await expect(stakingContract.connect(staker).stake(amount, 0)).to.be.revertedWith("Duration must be greater than zero");
//     });

//     it("should not allow staking without sufficient balance", async () => {
//         const { stakingContract, owner } = await loadFixture(deploySportfolioStakingFixture);

//         // Attempt to stake without sufficient balance
//         await expect(stakingContract.connect(owner).stake(testAmount * BigInt(2), duration)).to.be.revertedWith("ERC20: insufficient allowance");
//     });
// });

describe("SportfolioTalentStaking (Claim Reward Function)", function () {
    it("should claim rewards correctly", async () => {
        const { stakingContract, usdcRewardsToken, staker } = await loadFixture(deploySportfolioStakingFixture);

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

