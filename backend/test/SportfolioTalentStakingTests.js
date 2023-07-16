const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("SportfolioTalentStaking (View Functions)", function () {
    const duration = 7 * 24 * 60 * 60;
    const amount = ethers.parseEther("10");
    const testAmount = ethers.parseEther("10000");

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
        await usdcRewardsToken.connect(owner).mint(owner.address, amount);
        await usdcRewardsToken.connect(owner).mint(staker.address, amount);
        await sportfolioTalentToken.connect(owner).mint(owner.address, amount);
        await sportfolioTalentToken.connect(owner).mint(staker.address, amount);

        // Allow the staking contract to spend sportfolioTalentToken
        await sportfolioTalentToken.connect(owner).approve(stakingContractAddress, testAmount);
        await sportfolioTalentToken.connect(staker).approve(stakingContractAddress, testAmount);

        console.log(`Contracts deployed : 
            FakeUSDC[${usdcRewardsTokenAddress}], 
            MessiSportfolioToken[${sportfolioTalentTokenAddress}], 
            SportfolioTalentStaking[${stakingContractAddress}]`);

        return { stakingContract, sportfolioTalentToken, usdcRewardsToken, owner, staker };
    }

    it("should return total staked amount", async () => {
        const { stakingContract, sportfolioTalentToken, owner, staker } = await loadFixture(deploySportfolioStakingFixture);

        expect(await stakingContract.totalStaked()).to.equal(0);

        await stakingContract.connect(owner).stake(amount, duration);

        expect(await stakingContract.totalStaked()).to.equal(amount);
    });

    it("should return balance of staker", async () => {
        const { stakingContract, owner, staker } = await loadFixture(deploySportfolioStakingFixture);

        expect(await stakingContract.balanceOf(staker.address)).to.equal(0);

        await stakingContract.connect(staker).stake(amount, duration);

        expect(await stakingContract.balanceOf(staker.address)).to.equal(amount);
    });

    it("should return the rewards earned by staker", async () => {
        const { stakingContract, owner, staker } = await loadFixture(deploySportfolioStakingFixture);

        expect(await stakingContract.earned(staker.address)).to.equal(0);

        await stakingContract.connect(staker).stake(amount, duration);

        // Increase the time to the middle of the staking period
        await ethers.provider.send("evm_increaseTime", [duration.div(2)]);
        await ethers.provider.send("evm_mine");

        const rewardRate = ethers.parseEther("0.01"); // Reward rate of 0.01 USDC per second
        await stakingContract.addRewardAmount(rewardRate.mul(duration));

        const expectedRewards = rewardRate.mul(duration.div(2));
        expect(await stakingContract.earned(staker.address)).to.equal(expectedRewards);
    });

    it("should return the reward rate per token staked", async () => {
        const { stakingContract, owner, staker } = await loadFixture(deploySportfolioStakingFixture);

        expect(await stakingContract.rewardPerToken()).to.equal(0);

        await stakingContract.connect(staker).stake(amount, duration);

        // Increase the time to the middle of the staking period
        await ethers.provider.send("evm_increaseTime", [duration.div(2)]);
        await ethers.provider.send("evm_mine");

        const rewardRate = ethers.parseEther("0.01"); // Reward rate of 0.01 USDC per second
        await stakingContract.addRewardAmount(rewardRate.mul(duration));

        const expectedRewardPerToken = rewardRate.mul(duration.div(2)).mul(1e18).div(amount);
        expect(await stakingContract.rewardPerToken()).to.equal(expectedRewardPerToken);
    });

    it("should return the last time rewards were updated", async () => {
        const { stakingContract, owner, staker } = await loadFixture(deploySportfolioStakingFixture);

        expect(await stakingContract.lastTimeRewardApplicable()).to.equal(0);

        await stakingContract.connect(staker).stake(amount, duration);

        expect(await stakingContract.lastTimeRewardApplicable()).to.equal(await ethers.provider.getBlock("latest").timestamp);
    });
});
