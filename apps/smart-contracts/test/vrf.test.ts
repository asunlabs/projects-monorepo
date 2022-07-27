import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import dotenv from "dotenv";
import { deployContract, Fixture, loadFixture, MockProvider } from "ethereum-waffle";
import { Contract, Wallet } from "ethers";
import hre, { ethers } from "hardhat";

dotenv.config();

const { FORK_LINK_WHALE, ORACLE_SUBSCRIPTION_ID } = process.env;
const PREFIX = "unit-VRFv2Consumer";
let contract: Contract;

const useFixture = async (wallets: Wallet[], provider: MockProvider) => {
  const [owner, recipient] = await ethers.getSigners();
  const VRF_V2_CONSUMER_ABI = await hre.artifacts.readArtifact("VRFv2Consumer");
  contract = await deployContract(owner, VRF_V2_CONSUMER_ABI, [ORACLE_SUBSCRIPTION_ID]);

  return {
    contract,
    owner,
    recipient,
  };
};

// FIX: come back after chainlink hardhat starter kit
describe(`${PREFIX}-functionality`, function TestFunctionality() {
  beforeEach("Should deploy a contract", async function TestDeployment() {
    const VRF_V2_CONSUMER_ABI = await hre.artifacts.readArtifact("VRFv2Consumer");
    const [owner, recipient] = await ethers.getSigners();
    contract = await deployContract(owner, VRF_V2_CONSUMER_ABI, [ORACLE_SUBSCRIPTION_ID]);
  });
  it("Should return a contract name", async function TestName() {
    expect(await contract.name()).to.equal("VRFv2Consumer");
  });
  it("Fixture should work", async function TestFixure() {
    // const { owner, recipient, contract } = await loadFixture(useFixture);
    console.log(contract);
  });
});
