import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import dotenv from "dotenv";
import { Contract, Wallet } from "ethers";
import hre, { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

dotenv.config();

const { FORK_LINK_WHALE, ORACLE_SUBSCRIPTION_ID } = process.env;
const PREFIX = "unit-VRFv2Consumer";
const MOCK_SUBSCRIPTION_ID = 9302;
let contract: Contract;

const useFixture = async () => {
  const VRFv2Consumer = await ethers.getContractFactory("VRFv2Consumer");
  const vrfV2Consumer = await VRFv2Consumer.deploy(MOCK_SUBSCRIPTION_ID);
  contract = await vrfV2Consumer.deployed();

  return {
    contract,
  };
};

describe(`${PREFIX}-functionality`, function TestFunctionality() {
  it("Public vars should be zero", async function TestFixure() {
    const { contract } = await loadFixture(useFixture);
    expect(await contract.s_requestId()).to.equal(0);
    await expect(contract.s_randomWords(0)).to.be.reverted;
  });
});
