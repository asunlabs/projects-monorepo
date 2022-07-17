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
import helper from "@nomicfoundation/hardhat-network-helpers";

dotenv.config({ path: "./.env.development" });

const options = {
  settings: {
    optimizer: {
      enabled: true,
      runs: 800,
    },
    evmVersion: "london",
  },
};

const config: HardhatUserConfig = {
  // defaultNetwork: "hardhat", // dev network is hardhat
  solidity: {
    // version: "0.8.0",
    // set multiple compiler version
    compilers: [
      { version: "0.8.0" },
      {
        version: "0.8.15",
      },
    ].map((ver) => {
      return {
        ...ver,
        ...options,
      };
    }),
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
    hardhat: {
      forking: {
        url: String(process.env.FOLK_MAINNET_URL), // alchemy node assist an archived data caching
        blockNumber: 14390000,
      },
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
