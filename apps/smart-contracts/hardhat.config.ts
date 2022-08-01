import * as dotenv from "dotenv";
import { ethers } from "hardhat";
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan"; // for etherscan contract verification
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";

dotenv.config({ path: "./.env.development" });

const {
  TEST_ROPSTEN_URL,
  TEST_RINKEBY_URL,
  TEST_KOVAN_URL,
  MAIN_ETHEREUM_URL,
  FORK_MAINNET_URL,

  ACCOUNT_ROPSTEN_PRIVATE_KEY,
  ACCOUNT_RINKEBY_PRIVATE_KEY,
  ACCOUNT_KOVAN_PRIVATE_KEY,
  ACCOUNT_ETHEREUM_PRIVATE_KEY,

  ACCOUNT_DEPLOYER_PRIVATE_KEY,
  ACCOUNT_DEPLOYER_ADDRESS,

  PLUGIN_REPORT_GAS,
  API_COINMARKETCAP_KEY,
  API_ETHERSCAN_KEY,
  API_ETHERSCAN_BACKUP_KEY,
} = process.env;

const options = {
  settings: {
    optimizer: {
      enabled: true,
      runs: 800,
    },
    // evmVersion: "london",
  },
};

const deployerForTheSameAddress = {
  ADDRESS: ACCOUNT_DEPLOYER_ADDRESS,
  PRIVATE_KEY: ACCOUNT_DEPLOYER_PRIVATE_KEY,
};

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat", // dev network is hardhat
  solidity: {
    // version: "0.8.0",
    // set multiple compiler version
    compilers: [
      { version: "0.6.6" },
      { version: "0.8.0" },
      { version: "0.8.15" },
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
      url: TEST_ROPSTEN_URL ? String(TEST_ROPSTEN_URL) : "",
      accounts:
        ACCOUNT_ROPSTEN_PRIVATE_KEY !== undefined
          ? [ACCOUNT_ROPSTEN_PRIVATE_KEY]
          : [],
    },
    rinkeby: {
      url: TEST_RINKEBY_URL ? String(TEST_RINKEBY_URL) : "",
      accounts:
        ACCOUNT_RINKEBY_PRIVATE_KEY !== undefined
          ? [ACCOUNT_RINKEBY_PRIVATE_KEY]
          : [],
    },
    kovan: {
      url: TEST_KOVAN_URL ? String(TEST_KOVAN_URL) : "",
      accounts:
        ACCOUNT_KOVAN_PRIVATE_KEY !== undefined
          ? [ACCOUNT_KOVAN_PRIVATE_KEY]
          : [],
    },
    mainnet: {
      url: MAIN_ETHEREUM_URL ? String(MAIN_ETHEREUM_URL) : "",
      accounts:
        ACCOUNT_ETHEREUM_PRIVATE_KEY !== undefined
          ? [ACCOUNT_ETHEREUM_PRIVATE_KEY]
          : [],
    },
    hardhat: {
      forking: {
        url: FORK_MAINNET_URL ? String(FORK_MAINNET_URL) : "", // alchemy node assist an archived data caching
        blockNumber: 14390000,
        enabled: true,
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
    enabled: Boolean(PLUGIN_REPORT_GAS) ? true : false,
    coinmarketcap: String(API_COINMARKETCAP_KEY), // for gas reporter
    currency: "USD",
    src: "./contracts",
    outputFile: "./byproducts",
  },
  etherscan: {
    apiKey: {
      ropsten: API_ETHERSCAN_KEY !== undefined ? API_ETHERSCAN_KEY : "",
      rinkeby:
        API_ETHERSCAN_BACKUP_KEY !== undefined ? API_ETHERSCAN_BACKUP_KEY : "",
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
