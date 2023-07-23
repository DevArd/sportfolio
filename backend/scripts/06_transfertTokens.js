// npx hardat run ./scripts/06_transfertTokens.js --network goerli
// MessiSportfolioToken déployé à l'adresse : 0x40ED11741F5d7F8d97BF3535E3Ba2c8D755ad858
// MBappeSportfolioToken déployé à l'adresse : 0x2e38c13b8657aA3ddEE317a5De4ca7B99c4704Bb
// FakeUSDC déployé à l'adresse : 0x9E3dda3Ec8ea621a0036027dc6C63D63394B24F0
// SportfolioTalentStaking MessiSportfolioToken/FakeUSDC dSDC déployé à l'adresse : 0x060EBAA867de614FB4903F0da5f595fA01432A9E
// SportfolioTalentStaking MBappeSportfolioToken/FakeUSDC déployé à l'adresse : 0xf6aC1BCA0B5293ca0800025c775d1b1f78A1089d
const { ethers } = require("hardhat");
require("dotenv").config();
const fs = require("fs")
const path = require("path")

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

const USDC_ADDRESS = '0x9E3dda3Ec8ea621a0036027dc6C63D63394B24F0'
const MBAPPE_ADDRESS = '0x2e38c13b8657aA3ddEE317a5De4ca7B99c4704Bb'
const MESSI_ADDRESS = '0x40ED11741F5d7F8d97BF3535E3Ba2c8D755ad858'

const WALLET_PRIVATE_KEY_1 = process.env.WALLET_PRIVATE_KEY_1 || ""
const GEORLI_PROVIDER = process.env.GEORLI_PROVIDER || ""

const provider = new ethers.getDefaultProvider(GEORLI_PROVIDER)
const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY_1, provider);

async function main() {
    const abiUsdc = getTheAbi("../artifacts/contracts/FakeUSDC.sol/FakeUSDC.json");
    const abiMessi = getTheAbi("../artifacts/contracts/TalentTokens/MessiSportfolioToken.sol/MessiSportfolioToken.json");
    const abiMmappe = getTheAbi("../artifacts/contracts/TalentTokens/MBappeSportfolioToken.sol/MBappeSportfolioToken.json");
    const [, recipient] = await ethers.getSigners();
    const usdcContract = new ethers.Contract(USDC_ADDRESS, abiUsdc, provider);
    const messiContract = new ethers.Contract(MESSI_ADDRESS, abiMessi, provider);
    const mbappeContract = new ethers.Contract(MBAPPE_ADDRESS, abiMmappe, provider);

    const amount = "1000";
    let tx, receipt;

    tx = await usdcContract.connect(wallet).transfer(recipient.address, amount);
    receipt = await tx.wait();
    console.log("receipt transfert FakeUSDC", receipt);
    tx = await messiContract.connect(wallet).transfer(recipient.address, amount);
    receipt = await tx.wait();
    console.log("receipt transfert MessiSportfolioToken", receipt);
    tx = await mbappeContract.connect(wallet).transfer(recipient.address, amount);
    receipt = await tx.wait();
    console.log("receipt transfert MBappeSportfolioToken", receipt);
    console.log("Successfuly transafert");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});