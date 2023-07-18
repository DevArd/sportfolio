require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-docgen");
require("hardhat-gas-reporter");
require('solidity-coverage')

const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || ""
const HARDHAT_PRIVATE_KEY_1 = process.env.HARDHAT_PRIVATE_KEY_1 || ""
const HARDHAT_PRIVATE_KEY_2 = process.env.HARDHAT_PRIVATE_KEY_2 || ""
const INFURA_API_KEY = process.env.INFURA_API_KEY || ""

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [HARDHAT_PRIVATE_KEY_1, HARDHAT_PRIVATE_KEY_2],
      chainId: 31337,
      blockGasLimit: 10000000000000
    },
    // // Uncomment for coverage
    // hardhat: {
    //   blockGasLimit: 10000000000000
    // },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [WALLET_PRIVATE_KEY],
      chainId: 11155111
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [WALLET_PRIVATE_KEY],
      chainId: 5
    }
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    gasPrice: 21
  },
  docgen: {
    path: './docs',
    clear: true,
    runOnCompile: true,
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
        details: { yul: false }
      }
    }
  },
  mocha: {
    timeout: 40000
  }
};
