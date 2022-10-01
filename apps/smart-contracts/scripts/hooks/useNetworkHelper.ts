import { impersonateAccount, takeSnapshot } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";
import hre from "hardhat";

export async function useABIgetter(contractName: string) {
  const { abi, bytecode, deployedBytecode } = await hre.artifacts.readArtifact(contractName);

  return { abi, bytecode, deployedBytecode };
}

export async function useImpersonatedSigner(address: string) {
  await impersonateAccount(address);
  const impersonatedSigner = await ethers.getSigner(address);
  return impersonatedSigner;
}

// use this hook for fixture reset
export async function useSnapshotForReset() {
  const blockchain = await takeSnapshot();
  await blockchain.restore();
}
