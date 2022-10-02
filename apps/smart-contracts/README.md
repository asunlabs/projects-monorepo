# Smart contract feature prototypes

This is a open code box for smart contract development. A lot of features are tried here first and then integrated to [a main project](https://github.com/asunlabs/pawcon-monorepo).

## Prototype features

1. Cloning contracts
1. Swapping tokens
1. Auction
1. Enabling Cross chain
1. DAO
1. Timelock
1. Oracle
1. Non-upgradeable tokens: ERC20/721/777/1155
1. Upgradeable tokens: ERC20/721/777
1. Base64 on-chain encoding
1. ECDSA verifying signature on-chain
1. ERC165 supportsInterface
1. SafeMath
1. MerkleTree
1. Multicall

## Hardhat-deploy

Create a deploy directory in root.

```sh
mkdir deploy
```

Add the directory in tsconfig.json.

```json
  "include": [
    "./scripts",
    "./test",
    "./deploy"
  ],
```

Run below command to deploy contracts.

```sh
pnpm exec hardhat deploy
```
