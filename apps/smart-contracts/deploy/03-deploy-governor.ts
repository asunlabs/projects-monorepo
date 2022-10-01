import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import chalk from "chalk";
import { QUORUM_PERCENTAGE, THRESHOLD, VOTING_DELAY, VOTING_PERIOD } from "./02-deploy-time-lock";

// run pnpm exec hardhat help to check newly added task: deploy
// the deploy task is added using hardhat-deploy dep
const deployGovernor: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const governanceToken = await get("GovernanceToken");
  const timelock = await get("MyGovernorTimelock");

  console.log(chalk.bgMagenta("deploying governor"));

  const governor = await deploy("MyGovernor", {
    from: deployer,
    args: [governanceToken.address, timelock.address, VOTING_DELAY, VOTING_PERIOD, THRESHOLD, QUORUM_PERCENTAGE],
    log: false,

    // wait a few blocks before contract deployment is done
    waitConfirmations: 1,
  });

  console.log(chalk.bgMagenta("MyGovernor deployed to: ", governor.address));
};

export default deployGovernor;
