import hre from "hardhat";

export async function useABIgetter(contractName: string) {
  const contract = await hre.artifacts.readArtifact(contractName);
  return { contract };
}
