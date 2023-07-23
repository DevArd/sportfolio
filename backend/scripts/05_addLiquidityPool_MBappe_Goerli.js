// npx hardat run ./scripts/05_addLiquidityPool_MBappe_Goerli.js --network goerli
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

const UNISWAP_V2_ROUTER_ADDRESS = process.env.UNISWAP_V2_ROUTER_ADDRESS || ""
const USDC_ADDRESS = process.env.USDC_ADDESS || ""
const MBAPPE_ADDRESS = process.env.MBAPPE_ADDRESS || ""

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const GEORLI_PROVIDER = process.env.GEORLI_PROVIDER || ""
const WALLET_PRIVATE_KEY_1 = process.env.WALLET_PRIVATE_KEY_1 || ""

const provider = new ethers.getDefaultProvider(GEORLI_PROVIDER)
const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY_1, provider);

async function main() {
  // Get ABI
  const abiUrl = `https://api.etherscan.io/api?module=contract&action=getabi&address=${UNISWAP_V2_ROUTER_ADDRESS}&apikey=${ETHERSCAN_API_KEY}`
  const res = await axios.get(abiUrl);
  const abiRouter = JSON.parse(res.data.result);

  const abiUsdc = getTheAbi("../artifacts/contracts/FakeUSDC.sol/FakeUSDC.json");
  const abiMmappe = getTheAbi("../artifacts/contracts/TalentTokens/MBappeSportfolioToken.sol/MBappeSportfolioToken.json");

  // Get UNISWAP_V2_ROUTER_ADDRESS contract
  const routerContract = new ethers.Contract(UNISWAP_V2_ROUTER_ADDRESS, abiRouter, provider);
  const usdcContract = new ethers.Contract(USDC_ADDRESS, abiUsdc, provider);
  const mbappeContract = new ethers.Contract(MBAPPE_ADDRESS, abiMmappe, provider);

  // Amounts
  const usdcAmount = ethers.parseEther("100000"); // Montant de FakeUSDC à fournir
  const mbappeAmount = ethers.parseEther("100000"); // Montant de MBappeSportfolioToken à fournir
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // L'heure limite pour soumettre la transaction (10 minutes)

  // Approve
  const txUsdcApproval = await usdcContract.connect(wallet).approve(UNISWAP_V2_ROUTER_ADDRESS, usdcAmount);
  await txUsdcApproval.wait();
  const txMessiApproval = await mbappeContract.connect(wallet).approve(UNISWAP_V2_ROUTER_ADDRESS, mbappeAmount);
  await txMessiApproval.wait();

  // Create the pool
  const tx = await routerContract.connect(wallet).addLiquidity(
    USDC_ADDRESS,
    MBAPPE_ADDRESS,
    usdcAmount,
    mbappeAmount,
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