import { expect } from "chai";
import dotenv from "dotenv";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ORACLE } from "../../scripts/manager/constantManager";
import deploy from "../../scripts/hooks/useDeployer";

dotenv.config();

const PREFIX = "unit-VRFv2Consumer";

const useFixture = async () => {
  // use custom hook for contract deployment
  const { contract } = await deploy("VRFv2Consumer", [ORACLE.subscriptionId]);
  // const VRFv2Consumer = await ethers.getContractFactory("VRFv2Consumer");
  // const vrfV2Consumer = await VRFv2Consumer.deploy(ORACLE.subscriptionId);
  // contract = await vrfV2Consumer.deployed();

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
