// npx hardat run ./scripts/03_createPool_Messi_Goerli.js --network goerli
const { ethers } = require("hardhat");
const axios = require("axios");
require("dotenv").config();

const UNISWAP_V2_FACTORY_ADDRESS = process.env.UNISWAP_V2_FACTORY_ADDRESS || ""
const USDC_ADDRESS = process.env.USDC_ADDESS || ""
const MESSI_ADDRESS = process.env.MESSI_ADDESS || ""

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const GEORLI_PROVIDER = process.env.GEORLI_PROVIDER || ""
const WALLET_PRIVATE_KEY_1 = process.env.WALLET_PRIVATE_KEY_1 || ""

const provider = new ethers.getDefaultProvider(GEORLI_PROVIDER)
const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY_1, provider);

async function main() {
  // Get ABI
  const abiUrl = `https://api.etherscan.io/api?module=contract&action=getabi&address=${UNISWAP_V2_FACTORY_ADDRESS}&apikey=${ETHERSCAN_API_KEY}`
  const res = await axios.get(abiUrl);
  const abi = JSON.parse(res.data.result);

  // Get UNISWAP_V2_FACTORY_ADDRESS contract
  const factoryContract = new ethers.Contract(UNISWAP_V2_FACTORY_ADDRESS, abi, provider);

  // Connect wallet
  const factoryContractWithSigner = factoryContract.connect(wallet)

  // Create the pool
  const tx = await factoryContractWithSigner.createPair(
    USDC_ADDRESS,
    MESSI_ADDRESS
  )

  // Wait creation
  const receipt = await tx.wait();
  console.log("receipt", receipt);

  // Check pool address
  console.log("Successfuly created Uniswap liquidity pools :", await factoryContract.getPair(USDC_ADDRESS, MESSI_ADDRESS));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Pool = 0x97027E4514d4AaC7E63D1c8A4B2c8AaD9FF0d6a7