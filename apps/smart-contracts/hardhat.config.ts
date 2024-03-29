import * as dotenv from "dotenv";
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan"; // for etherscan contract verification
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@openzeppelin/hardhat-upgrades";

// === import hardhat-deploy-related deps
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
// === import hardhat-deploy-related deps

import "@nomicfoundation/hardhat-chai-matchers";
import "solidity-docgen";
import { PLUGIN } from "./scripts/manager/constantManager";

dotenv.config({ path: "./.env.development" });

const {
  TEST_GOERLI_URL,
  TEST_SEPOLIA_URL,
  TEST_ROPSTEN_URL,
  TEST_RINKEBY_URL,
  TEST_KOVAN_URL,
  TEST_MUMBAI_HTTP,

  MAIN_ETHEREUM_URL,
  FORK_MAINNET_URL,
  FORK_GOERLI_URL,

  ACCOUNT_ETHEREUM_PRIVATE_KEY,
  ACCOUNT_GOERLI_PRIVATE_KEY,
  ACCOUNT_SEPOLIA_PRIVATE_KEY,
  ACCOUNT_ROPSTEN_PRIVATE_KEY,
  ACCOUNT_RINKEBY_PRIVATE_KEY,
  ACCOUNT_KOVAN_PRIVATE_KEY,
  ACCOUNT_MUMBAI_PRIVATE_KEY,

  ACCOUNT_DEPLOYER_PRIVATE_KEY,
  ACCOUNT_DEPLOYER_ADDRESS,

  API_COINMARKETCAP_KEY,
  API_ETHERSCAN_KEY,
  API_ETHERSCAN_BACKUP_KEY,
  API_POLYGONSCAN_KEY,
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
      { version: "0.8.16" },
      { version: "0.8.17" },
    ].map((ver) => {
      return {
        ...ver,
        ...options,
      };
    }),
  },
  networks: {
    // JSON-RPC based network
    mainnet: {
      url: MAIN_ETHEREUM_URL ? String(MAIN_ETHEREUM_URL) : "",
      accounts:
        ACCOUNT_ETHEREUM_PRIVATE_KEY !== undefined
          ? [ACCOUNT_ETHEREUM_PRIVATE_KEY]
          : [],
    },
    // * hardhat and localhost network are different networks.
    // * hardhat network: for running test
    // * localhost: for running fake blockchain node
    hardhat: {
      forking: {
        url: FORK_MAINNET_URL ? FORK_MAINNET_URL : "", // alchemy node assist an archived data caching
        blockNumber: 14390000,
        enabled: true,
      },
      chainId: 31337,
      // auto mining
      // mining: {
      //   auto: true,
      //   interval: 2000, // 2 seconds per mining
      //   mempool: {
      //     order: "priority", // tx based on higher gas fee like Geth
      //   },
      // },
    },
    localhost: {
      chainId: 31337,
    },
    goerli: {
      url: TEST_GOERLI_URL !== undefined ? TEST_GOERLI_URL : "",
      accounts:
        ACCOUNT_GOERLI_PRIVATE_KEY !== undefined
          ? [ACCOUNT_GOERLI_PRIVATE_KEY]
          : [],
    },
    // node provider not yet actively supports sepolia. currently url is empty string.
    sepolia: {
      url: TEST_SEPOLIA_URL !== undefined ? TEST_SEPOLIA_URL : "",
      accounts:
        ACCOUNT_SEPOLIA_PRIVATE_KEY !== undefined
          ? [ACCOUNT_SEPOLIA_PRIVATE_KEY]
          : [],
    },
    // ! @deprecated
    ropsten: {
      url: TEST_ROPSTEN_URL ? TEST_ROPSTEN_URL : "",
      accounts:
        ACCOUNT_ROPSTEN_PRIVATE_KEY !== undefined
          ? [ACCOUNT_ROPSTEN_PRIVATE_KEY]
          : [],
    },
    // ! @deprecated
    rinkeby: {
      url: TEST_RINKEBY_URL ? TEST_RINKEBY_URL : "",
      accounts:
        ACCOUNT_RINKEBY_PRIVATE_KEY !== undefined
          ? [ACCOUNT_RINKEBY_PRIVATE_KEY]
          : [],
    },
    // ! @deprecated
    kovan: {
      url: TEST_KOVAN_URL ? TEST_KOVAN_URL : "",
      accounts:
        ACCOUNT_KOVAN_PRIVATE_KEY !== undefined
          ? [ACCOUNT_KOVAN_PRIVATE_KEY]
          : [],
    },
    mumbai: {
      url: TEST_MUMBAI_HTTP !== undefined ? TEST_MUMBAI_HTTP : "",
      accounts:
        ACCOUNT_MUMBAI_PRIVATE_KEY !== undefined
          ? [ACCOUNT_MUMBAI_PRIVATE_KEY]
          : [],
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  gasReporter: {
    enabled: PLUGIN.REPORT_GAS ? true : false,
    coinmarketcap: API_COINMARKETCAP_KEY, // for gas reporter
    currency: "USD",
    src: "./contracts",
    outputFile: "./",
  },
  etherscan: {
    apiKey: {
      goerli: API_ETHERSCAN_KEY !== undefined ? API_ETHERSCAN_KEY : "",
      ropsten: API_ETHERSCAN_KEY !== undefined ? API_ETHERSCAN_KEY : "",
      rinkeby:
        API_ETHERSCAN_BACKUP_KEY !== undefined ? API_ETHERSCAN_BACKUP_KEY : "",
      polygonMumbai:
        API_POLYGONSCAN_KEY !== undefined ? API_POLYGONSCAN_KEY : "",
    },
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  docgen: {
    pages: "files",
    pageExtension: ".md",
    outputDir: "./docs",
    exclude: ["contracts/reference"],
  },
};

export default config;
