import { ethers } from "hardhat";
import { BigNumber, Contract } from "ethers";
import { expect } from "chai";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import chalk from "chalk";
import dotenv from "dotenv";
import { MerkleTree } from "merkletreejs";
import deployer from "../../scripts/hooks/useDeployer";
import { keccak256 } from "ethers/lib/utils";

dotenv.config({ path: "../../.env.development" });

const { ACCOUNT_GOERLI_PRIVATE_KEY, ACCOUNT_GOERLI_PUBLIC_ADDRESS } = process.env;

const contractName = "WhitelistSale";
const PREFIX = "unit-WhitelistSale";

function usePadBuffer(address: string) {
  const cutout0x = 2;
  const maxLength = 64;
  const fillString = "0";
  const binaryString = address.substring(cutout0x).padStart(maxLength, fillString);

  return Buffer.from(binaryString, "hex");
}

function useBufferToHexString(buff: Buffer) {
  return buff.toString("hex");
}

function convertAddressleaf(address: string) {
  // check byte length of address: Ethereum account is 20 bytes
  const bytes32Length = 32;
  const leaf = ethers.utils.hexZeroPad(address, bytes32Length);
  return { leaf };
}

describe.only(`${PREFIX}-merkletree`, async function TestMerkletree() {
  it("Should verify leaf", async function VerifyLeaf() {
    // @dev whitelist account
    const [wh1, wh2, wh3, nonWh1, nonWh2] = await ethers.getSigners();
    console.log(wh1.address.substring(2)); // exclude '0x'

    const whitelist = [wh1, wh2, wh3];
    const nonWhitelist = [nonWh1, nonWh2];

    // @dev padding: Pads the current string with a given string (possibly repeated) so that the resulting string reaches a given length.
    // const maxLength = 64;
    // const fillString = "0";
    // console.log(wh1.address.substring(2).padStart(maxLength, fillString)); // exclude '0x'

    // @dev buffer: Creates a new Buffer containing the given JavaScript string {str}.
    // If provided, the {encoding} parameter identifies the character encoding.
    // If not provided, {encoding} defaults to 'utf8'.
    const leaves = whitelist.map((account) => {
      return usePadBuffer(account.address);
    });

    console.log({ leaves });

    // @dev openzeppelin merkletree implementation requires to sort leaves
    /**
     * Constructs a Merkle Tree. All nodes and leaves are stored as Buffers. Lonely leaf nodes are promoted to the next level up without being hashed again.
    @param leaves — Array of hashed leaves. Each leaf must be a Buffer.
    @param hashFunction — Hash function to use for hashing leaves and nodes
    @param options — Additional options
     */
    const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
    const root = merkleTree.getHexRoot();

    console.log({ root });

    const { contract } = await deployer(contractName, [root]);
    expect(await contract.merkleRoot()).to.equal(root);

    const proof = merkleTree.getHexProof(usePadBuffer(wh1.address));
    const wrongProof = merkleTree.getHexProof(usePadBuffer(nonWh1.address));

    /// @dev Ethereum account is 20 bytes
    // const hexToByte = ethers.utils.toUtf8Bytes(wh1.address);
    const leaf = ethers.utils.hexZeroPad(wh1.address, 32);
    const wrongLeaf = ethers.utils.hexZeroPad(nonWh1.address, 32);

    console.log({ leaf });
    console.log("converted address length: ", leaf.length);
    // buffer to string to bytes32

    // const leaf = keccak256(leaves[0].toString());

    expect(await contract.verify(proof, leaf)).to.be.true;
    expect(await contract.verify(wrongProof, wrongLeaf)).not.to.be.true;

    console.log("BEFORE: ", (await contract.value()).toString());

    const newValue = 99;
    expect(await contract.setValueByMerkleTree(newValue, proof, leaf));
    expect(await contract.value()).to.equal(newValue);
    await expect(contract.setValueByMerkleTree(newValue, wrongProof, wrongLeaf)).to.be.revertedWith("WhitelistSale: Non-whiltelist");

    console.log("AFTER: ", (await contract.value()).toString());
    // const wrongProof = merkleTree.getHexProof(usePadBuffer(nonWh1.address));
  });
});
