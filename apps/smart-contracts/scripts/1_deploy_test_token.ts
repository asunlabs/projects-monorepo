import deploy from "./hooks/useDeployer";
import { verifier } from "./hooks/useVerify";

async function main() {
  const { contract } = await deploy("TestToken", ["Jake Sung"]);
  await verifier(contract.address, ["Jake Sung"]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
