// npx hardat run ./scripts/07_addUSDCToStakingContracts.js --network goerli
const { ethers } = require("hardhat");
require("dotenv").config();
const fs = require("fs")
const path = require("path");
const { parseEther } = require("ethers");

const getTheAbi = (abiFilePath) => {
    try {
        const dir = path.resolve(
            __dirname,
            abiFilePath // hardhat build dir
        )
        const file = fs.readFileSync(dir, "utf8")
        return JSON.parse(file).abi
    } catch (e) {
        console.log(`e`, e)
    }
}

const USDC_ADDRESS = process.env.USDC_ADDESS || ""

const MESSI_STAKING_ADDESS = process.env.MESSI_STAKING_ADDESS || ""
const MBAPPE_STAKING_ADDESS = process.env.MBAPPE_STAKING_ADDRESS || ""

const WALLET_PRIVATE_KEY_1 = process.env.WALLET_PRIVATE_KEY_1 || ""
const GEORLI_PROVIDER = process.env.GEORLI_PROVIDER || ""

const provider = new ethers.getDefaultProvider(GEORLI_PROVIDER)
const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY_1, provider);

async function main() {
    const abiUsdc = getTheAbi("../artifacts/contracts/FakeUSDC.sol/FakeUSDC.json");
    const usdcContract = new ethers.Contract(USDC_ADDRESS, abiUsdc, provider);

    const amount = parseEther("100000");
    let tx, receipt;

    tx = await usdcContract.connect(wallet).transfer(MESSI_STAKING_ADDESS, amount);
    receipt = await tx.wait();
    console.log("receipt transfert FakeUSDC to MessiSportfolioToken", receipt);
    tx = await usdcContract.connect(wallet).transfer(MBAPPE_STAKING_ADDESS, amount);
    receipt = await tx.wait();
    console.log("receipt transfert FakeUSDC to MBappeSportfolioToken", receipt);
    console.log("Successfuly transfert");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});