import { ethers } from "hardhat";
import { useABIgetter } from "../../../scripts/hooks/useArtifacts";
import deployer from "../../../scripts/hooks/useDeployer";
import { useImpersonatedSigner, useSnapshotForReset } from "../../../scripts/hooks/useNetworkHelper";

const PREFIX = "unit-CalculatorVer01";
describe(`${PREFIX}-functionality`, function TestFunctionality() {
  it.skip("Should return a correct decimal", async function TestDecimal() {
    const { contract } = await deployer("CalculatorVer01");
  });
});
