// npx hardat run ./scripts/04_addLiquidityPool_Messi_Goerli.js --network goerli
// MessiSportfolioToken déployé à l'adresse : 0x40ED11741F5d7F8d97BF3535E3Ba2c8D755ad858
// MBappeSportfolioToken déployé à l'adresse : 0x2e38c13b8657aA3ddEE317a5De4ca7B99c4704Bb
// FakeUSDC déployé à l'adresse : 0x9E3dda3Ec8ea621a0036027dc6C63D63394B24F0
// SportfolioTalentStaking MessiSportfolioToken/FakeUSDC dSDC déployé à l'adresse : 0x060EBAA867de614FB4903F0da5f595fA01432A9E
// SportfolioTalentStaking MBappeSportfolioToken/FakeUSDC déployé à l'adresse : 0xf6aC1BCA0B5293ca0800025c775d1b1f78A1089d
const { ethers } = require("hardhat");
const axios = require("axios");
const fs = require("fs")
const path = require("path")
require("dotenv").config();

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

const UNISWAP_V2_ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
const USDC_ADDRESS = '0x9E3dda3Ec8ea621a0036027dc6C63D63394B24F0'
const MESSI_ADDRESS = '0x40ED11741F5d7F8d97BF3535E3Ba2c8D755ad858'

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const GEORLI_PROVIDER = process.env.GEORLI_PROVIDER || ""
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || ""

const provider = new ethers.getDefaultProvider(GEORLI_PROVIDER)
const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);

async function main() {
  // Get ABI
  const abiUrl = `https://api.etherscan.io/api?module=contract&action=getabi&address=${UNISWAP_V2_ROUTER_ADDRESS}&apikey=${ETHERSCAN_API_KEY}`
  const res = await axios.get(abiUrl);
  const abiRouter = JSON.parse(res.data.result);

  const abiUsdc = getTheAbi("../artifacts/contracts/FakeUSDC.sol/FakeUSDC.json");// await ethers.getContractAt("contracts/FakeUSDC.sol:FakeUSDC", USDC_ADDRESS);
  const abiMessi = getTheAbi("../artifacts/contracts/TalentTokens/MessiSportfolioToken.sol/MessiSportfolioToken.json");//await ethers.getContractAt("contracts/TalentTokens/MessiSportfolioToken.sol:MessiSportfolioToken", MESSI_ADDRESS);

  // Get UNISWAP_V2_ROUTER_ADDRESS contract
  const routerContract = new ethers.Contract(UNISWAP_V2_ROUTER_ADDRESS, abiRouter, provider);
  const usdcContract = new ethers.Contract(USDC_ADDRESS, abiUsdc, provider);
  const messiContract = new ethers.Contract(MESSI_ADDRESS, abiMessi, provider);

  // Amounts
  const usdcAmount = ethers.parseEther("100000"); // Montant de FakeUSDC à fournir
  const messiAmount = ethers.parseEther("100000"); // Montant de MessiSportfolioToken à fournir
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // L'heure limite pour soumettre la transaction (10 minutes)

  // Approve
  const txUsdcApproval = await usdcContract.connect(wallet).approve(UNISWAP_V2_ROUTER_ADDRESS, usdcAmount);
  await txUsdcApproval.wait();
  const txMessiApproval = await messiContract.connect(wallet).approve(UNISWAP_V2_ROUTER_ADDRESS, messiAmount);
  await txMessiApproval.wait();

  // Create the pool
  const tx = await routerContract.connect(wallet).addLiquidity(
    USDC_ADDRESS,
    MESSI_ADDRESS,
    usdcAmount,
    messiAmount,
    0,
    0,
    wallet.address,
    deadline
  )

  // Wait creation
  const receipt = await tx.wait();
  console.log("receipt", receipt);
  console.log("Successfuly added Uniswap liquidity");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});