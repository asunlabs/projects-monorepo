import deploy from "../hooks/useDeployer";
import { verifier } from "../hooks/useVerify";

// sample deploying script using a custom hook
// deploy CMD: pnpm exec hardhat run scripts/_deploy/1_governance_deploy.ts --network goerli
// verify CMD: pnpm exec hardhat verify 0x5c300e667ff9f2C9824821857814d73C119503A1 --network goerli

const FEATURE_GOVERNANCE = ["Box", "GovernanceToken"];

async function main() {
  // iterate an array and deploy all
  for (let index = 0; index < FEATURE_GOVERNANCE.length; index++) {
    const contractName = FEATURE_GOVERNANCE[index];
    const { contract } = await deploy(contractName);
    await verifier(contract.address);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
