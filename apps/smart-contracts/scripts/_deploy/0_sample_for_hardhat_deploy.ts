import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import chalk from "chalk";

// run pnpm exec hardhat help to check newly added task: deploy
// the deploy task is added using hardhat-deploy dep
const deployBox: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log(chalk.bgMagenta("deploying box token"));

  const box = await deploy("Box", {
    from: deployer,
    args: [],
    log: true,

    // wait a few blocks before contract deployment is done
    waitConfirmations: 1,
  });

  console.log(chalk.bgMagenta("box deployed to: ", box.address));
};

export default deployBox;
