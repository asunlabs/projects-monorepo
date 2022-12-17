// overriding @types/node's process.env for auto-completion
// 1. check if @types/node is installed
// 2. create .d.ts and override ProcessEnv
// 3. include the .d.ts file in tsconfig's include prop
// 4. enjoy auto-completion
declare namespace NodeJS {
  export interface ProcessEnv {
    API_ETHERSCAN_KEY: string;
    API_POLYGONSCAN_KEY: string;
    API_ETHERSCAN_BACKUP_KEY: string;
    API_COINMARKETCAP_KEY: string;
    API_PINATA_KEY: string;
    API_PINATA_SECRET: string;
    API_PINATA_JWT: string;
    API_PINATA_CID: string;

    INFURA_PROJECT_ID: string;
    INFURA_PROJECT_SECRET: string;

    TEST_GOERLI_URL: string;
    TEST_SEPOLIA_URL: string;
    MAIN_ETHEREUM_URL: string;

    FORK_MAINNET_URL: string;
    FORK_GOERLI_URL: string;

    TEST_MUMBAI_API_KEY: string;
    TEST_MUMBAI_HTTP: string;
    TEST_MUMBAI_WSS: string;

    ACCOUNT_ETHEREUM_PRIVATE_KEY: string;
    ACCOUNT_GOERLI_PRIVATE_KEY: string;
    ACCOUNT_SEPOLIA_PRIVATE_KEY: string;
    ACCOUNT_MNEMONIC_SEED: string;

    ACCOUNT_MUMBAI_PRIVATE_KEY: string;
    ACCOUNT_DEPLOYER_ADDRESS: string;
    ACCOUNT_DEPLOYER_PRIVATE_KEY: string;

    DEFENDER_TEAM_API_KEY: string;
    DEFENDER_TEAM_SECRET_KEY: string;
    DEFENDER_RELAYER_GOERLI_ADDRESS: string;
    DEFENDER_RELAYER_API_KEY: string;
    DEFENDER_RELAYER_SECRET_KEY: string;
  }
}
