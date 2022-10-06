import hre from "hardhat";

export async function verifier(_address: string, args?: any[]) {
  await hre.run("verify:verify", {
    address: _address,
    constructorArguments: args,
  });
}
