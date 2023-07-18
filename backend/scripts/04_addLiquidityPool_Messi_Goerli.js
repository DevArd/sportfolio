// npx hardat run ./scripts/02_createPool_Messi_Goerli.js --network goerli
// MessiSportfolioToken déployé à l'adresse : 0x40ED11741F5d7F8d97BF3535E3Ba2c8D755ad858
// MBappeSportfolioToken déployé à l'adresse : 0x2e38c13b8657aA3ddEE317a5De4ca7B99c4704Bb
// FakeUSDC déployé à l'adresse : 0x9E3dda3Ec8ea621a0036027dc6C63D63394B24F0
// SportfolioTalentStaking MessiSportfolioToken/FakeUSDC dSDC déployé à l'adresse : 0x060EBAA867de614FB4903F0da5f595fA01432A9E
// SportfolioTalentStaking MBappeSportfolioToken/FakeUSDC déployé à l'adresse : 0xf6aC1BCA0B5293ca0800025c775d1b1f78A1089d
const { ethers } = require("hardhat");
const axios = require("axios");
require("dotenv").config();

const UNISWAP_V2_FACTORY_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'

const usdcAddress = '0x9E3dda3Ec8ea621a0036027dc6C63D63394B24F0'
const sportfolioTokenAddress = '0x2e38c13b8657aA3ddEE317a5De4ca7B99c4704Bb'

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const GEORLI_PROVIDER = process.env.GEORLI_PROVIDER || ""
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || ""

const provider = new ethers.getDefaultProvider(GEORLI_PROVIDER)
const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);

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
    usdcAddress,
    sportfolioTokenAddress
  )

  // Wait creation
  const receipt = await tx.wait();
  
  // Check pool address
  console.log("Successfuly created Uniswap liquidity pools :", await factoryContract.getPair(usdcAddress, sportfolioTokenAddress));

  // // const [deployer] = await ethers.getSigners();
  // // const usdcAmount = hre.ethers.utils.parseEther("1000"); // Montant de FakeUSDC à fournir
  // // const tokenAmount = hre.ethers.utils.parseEther("1000"); // Montant de MessiSportfolioToken à fournir
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Pool = 0x00A70df967B51C31cAb13c0e12Cf9a4cB916daeE