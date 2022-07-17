import * as dotenv from "dotenv";
import { ethers } from "hardhat";
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan"; // for etherscan contract verification
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@openzeppelin/hardhat-upgrades";

dotenv.config({ path: "./.env.development" });

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat", // dev network is hardhat
  solidity: {
    // version: "0.8.0",
    // set multiple compiler version
    compilers: [
      { version: "0.8.0" },
      {
        version: "0.8.15",
        settings: {
          optimizer: {
            enabled: true,
            runs: 800,
          },
          evmVersion: "london",
        },
      },
    ],
    // settings: {
    //   optimizer: {
    //     enabled: true,
    //     runs: 800,
    //   },
    //   evmVersion: "london", // default value managed by solc
    // },
  },
  networks: {
    // JSON-RPC based network
    ropsten: {
      url: process.env.TEST_ROPSTEN_URL
        ? String(process.env.TEST_ROPSTEN_URL)
        : undefined,
      accounts:
        process.env.ACCOUNT_ROPSTEN_PRIVATE_KEY !== undefined
          ? [process.env.ACCOUNT_ROPSTEN_PRIVATE_KEY]
          : [],
    },
    mainnet: {
      url: process.env.MAIN_ETHEREUM_URL
        ? String(process.env.MAIN_ETHEREUM_URL)
        : undefined,
      accounts:
        process.env.ACCOUNT_ETHEREUM_PRIVATE_KEY !== undefined
          ? [process.env.ACCOUNT_ETHEREUM_PRIVATE_KEY]
          : [],
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./byproducts/cache",
    sources: "./contracts",
    tests: "./test",
  },
  gasReporter: {
    enabled: process.env.PLUGIN_REPORT_GAS ? true : false,
    coinmarketcap: process.env.API_COINMARKETCAP_KEY, // for gas reporter
    currency: "USD",
    src: "./contracts",
    outputFile: "./byproducts",
  },
  etherscan: {
    apiKey: {
      ropsten: process.env.API_ETHERSCAN_KEY
        ? process.env.API_ETHERSCAN_KEY
        : undefined,
    },
  },
  mocha: {
    timeout: 40000,
    color: true,
  },
  typechain: {
    outDir: "byproducts/typechain",
    target: "ethers-v5",
  },
};

export default config;
