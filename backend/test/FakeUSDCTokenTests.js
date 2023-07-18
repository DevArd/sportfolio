const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const { parseEther } = ethers;

describe("FakeUSDC", function () {
    const name = "Fake USDC";
    const symbol = "USDC";
    const initialSupply = parseEther("1000000000");

    async function deployFakeUSDCTokenFixture() {
        const [owner, recipient] = await ethers.getSigners();

        // Deploy the USDC tokens
        const usdcRewardsToken = await ethers.deployContract("FakeUSDC");
        await usdcRewardsToken.waitForDeployment();
        const usdcRewardsTokenAddress = await usdcRewardsToken.getAddress();

        console.log(`Contracts deployed : FakeUSDC[${usdcRewardsTokenAddress}]`);

        return { usdcRewardsToken, owner, recipient };
    }

    it("should have correct initial supply", async () => {
        const { usdcRewardsToken } = await loadFixture(deployFakeUSDCTokenFixture);
        expect(await usdcRewardsToken.totalSupply()).to.equal(initialSupply);
    });

    it("should have correct name and symbol", async () => {
        const { usdcRewardsToken } = await loadFixture(deployFakeUSDCTokenFixture);
        expect(await usdcRewardsToken.name()).to.equal(name);
        expect(await usdcRewardsToken.symbol()).to.equal(symbol);
    });

    it("should allow owner to mint new tokens", async () => {
        const { usdcRewardsToken, owner, recipient } = await loadFixture(deployFakeUSDCTokenFixture);
        const amountToMint = parseEther("1000");

        await usdcRewardsToken.connect(owner).mint(recipient.address, amountToMint);
        expect(await usdcRewardsToken.balanceOf(recipient.address)).to.equal(
            amountToMint
        );
    });

    it("should not allow non-owner to mint new tokens", async () => {
        const { usdcRewardsToken, recipient } = await loadFixture(deployFakeUSDCTokenFixture);
        const amountToMint = parseEther("500");

        await expect(
            usdcRewardsToken.connect(recipient).mint(recipient.address, amountToMint)
        ).to.be.revertedWith("Ownable: caller is not the owner");
    });
});
