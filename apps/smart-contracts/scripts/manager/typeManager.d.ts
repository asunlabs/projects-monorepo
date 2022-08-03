export type oracleTestnet = "kovan" | "rinkeby";
export type posTestnet = "goerli" | "sepolia";

export interface NetworkSupport {
  testnet?: posTestnet;
  oracle?: oracleTestnet;
}

export interface ChainlinkSolution {
  datafeeds?: oracleTestnet;
  vrf?: oracleTestnet;
}

export interface GoerliProps {
  ERC20: {
    DAI: string;
    USDC: string;
    WETH: string;
  };
}
