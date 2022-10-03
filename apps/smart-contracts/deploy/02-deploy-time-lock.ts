import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import chalk from "chalk";
import { MIN_DELAY } from "../gov-config";

// run pnpm exec hardhat help to check newly added task: deploy
// the deploy task is added using hardhat-deploy dep
const deployTimelock: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log(chalk.bgMagenta("deploying timelock"));

  const myTimelock = await deploy("MyGovernorTimelock", {
    from: deployer,
    args: [MIN_DELAY, [], []],
    log: false,

    // wait a few blocks before contract deployment is done
    waitConfirmations: 1,
  });

  console.log(chalk.bgMagenta("timelock deployed to: ", myTimelock.address));
};

export default deployTimelock;
