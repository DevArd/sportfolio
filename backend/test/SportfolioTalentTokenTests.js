const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const { parseEther } = ethers;

describe("SportfolioTalentToken", function () {
    const name = "Talent Token";
    const symbol = "TALENT";
    const initialSupply = parseEther("1000");
    const maxSupply = parseEther("1000000");

    async function deploySportfolioTalentTokenFixture() {
        const [owner, recipient] = await ethers.getSigners();

        // Deploy the SportfolioTalentToken tokens
        const sportfolioTalentToken = await ethers.deployContract("SportfolioTalentToken", [name, symbol, initialSupply, maxSupply]);
        await sportfolioTalentToken.waitForDeployment();
        const sportfolioTalentTokenAddress = await sportfolioTalentToken.getAddress();

        console.log(`Contracts deployed : SportfolioTalentToken[${sportfolioTalentTokenAddress}]`);

        return { sportfolioTalentToken, owner, recipient };
    }

    it("should have correct initial supply", async () => {
        const { sportfolioTalentToken } = await loadFixture(deploySportfolioTalentTokenFixture);
        expect(await sportfolioTalentToken.totalSupply()).to.equal(initialSupply);
    });

    it("should have correct max supply", async () => {
        const { sportfolioTalentToken } = await loadFixture(deploySportfolioTalentTokenFixture);
        expect(await sportfolioTalentToken.maxSupply()).to.equal(maxSupply);
    });

    it("should have correct name and symbol", async () => {
        const { sportfolioTalentToken } = await loadFixture(deploySportfolioTalentTokenFixture);
        expect(await sportfolioTalentToken.name()).to.equal(name);
        expect(await sportfolioTalentToken.symbol()).to.equal(symbol);
    });

    it("should allow owner to mint new tokens", async () => {
        const { sportfolioTalentToken, owner, recipient } = await loadFixture(deploySportfolioTalentTokenFixture);
        const amountToMint = parseEther("500");

        await sportfolioTalentToken.connect(owner).mint(recipient.address, amountToMint);
        expect(await sportfolioTalentToken.balanceOf(recipient.address)).to.equal(
            amountToMint
        );
    });

    it("should not allow non-owner to mint new tokens", async () => {
        const { sportfolioTalentToken, recipient } = await loadFixture(deploySportfolioTalentTokenFixture);
        const amountToMint = parseEther("500");

        await expect(
            sportfolioTalentToken.connect(recipient).mint(recipient.address, amountToMint)
        ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should not allow minting more than max supply", async () => {
        const { sportfolioTalentToken, owner, recipient } = await loadFixture(deploySportfolioTalentTokenFixture);
        const amountToMint = maxSupply - initialSupply + parseEther("1"); // Mint 1 more token than allowed

        await expect(
            sportfolioTalentToken.connect(owner).mint(await recipient.getAddress(), amountToMint)
        ).to.be.revertedWith("Exceeds maximum supply");
    });
});
