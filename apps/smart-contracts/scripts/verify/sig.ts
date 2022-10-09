import { ethers } from "hardhat";
import * as sigUtil from "@metamask/eth-sig-util";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env.development" });
const { ACCOUNT_GOERLI_PRIVATE_KEY, INFURA_PROJECT_SECRET, INFURA_PROJECT_ID } = process.env;

// ../../node_modules/.bin/ts-node sig.ts

/**
 * @dev sig.ts <=> MyVerifySignature.sol
 */

const EIP191Prefix = {
  bytes32Hash: "\x19Ethereum Signed Message:\n32",
  bytesHash: "\x19Ethereum Signed Message:\n",
};

const provider = ethers.getDefaultProvider("goerli", {
  projectId: INFURA_PROJECT_ID,
  projectSecret: INFURA_PROJECT_SECRET,
});

const signer = new ethers.Wallet(ACCOUNT_GOERLI_PRIVATE_KEY!, provider);

console.log(signer.address);

const message = "developerasun";

// on-chain: 0xbcb2026e44b8fa7773e4cce8239ac5c417d61e1a56b71c1f89a24ea5dba0d7a5
// off-chain: 0xbcb2026e44b8fa7773e4cce8239ac5c417d61e1a56b71c1f89a24ea5dba0d7a5
/**
 * @dev
 * messageHash <=> getMessageHash
 */
const messageHash = ethers.utils.id(message);
console.log({ messageHash });
const _messageHash = ethers.utils.keccak256(ethers.utils.solidityPack(["string"], [message]));
console.log(messageHash === _messageHash);

/**
 * @dev solidity's abi.encodePacked <=> ethersjs utils.solidityPack
 * _toEthSignedMessage <=> getEthSignedMessageHash
 * 0x19457468657265756d205369676e6564204d6573736167653a0a3332bcb2026e44b8fa7773e4cce8239ac5c417d61e1a56b71c1f89a24ea5dba0d7a5
 */
const _toEthSignedMessage = ethers.utils.solidityPack(["string", "bytes32"], [EIP191Prefix.bytes32Hash, messageHash]);

// solidity's keccak256 <=> ethersjs solidityKeccak256
// 0xa1a80445dfe80fe063da1c9afeb0dadea78580e28a5f03d1273811f9dec59981;
const toEthSignedMessage = ethers.utils.solidityKeccak256(["bytes"], [_toEthSignedMessage]);

console.log({ toEthSignedMessage });

// check code example here: https://snyk.io/advisor/npm-package/eth-sig-util/functions/eth-sig-util.personalSign
// private key buffer should be encoded with hex
const privateKeyBuffer = Buffer.from(ACCOUNT_GOERLI_PRIVATE_KEY!, "hex");
const signature = sigUtil.personalSign({ privateKey: privateKeyBuffer, data: messageHash });
console.log({ signature });

/*
1. invoke metamask: ethereum.enable()
2. invoke sign: ethereum.request({method: "personal_sign", params:["0xecab21327b6eba1fb0631dc9bbc5863b6b2be3e4", "0xbcb2026e44b8fa7773e4cce8239ac5c417d61e1a56b71c1f89a24ea5dba0d7a5"]})
params is 1) account 2) message hash to sign
3. get signature: 0x3dee9ff76839b3433b3d4bbe8a445b07615eb6d6d7a004ee37c79b5f009810e07b14f9d5dbd70251dcd22e1801fc427fb26fc7c45a7cea5c3fd8dd8d7e48bc651c
*/
