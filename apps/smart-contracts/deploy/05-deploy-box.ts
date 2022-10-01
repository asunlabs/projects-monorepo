import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import chalk from "chalk";
import { ethers } from "hardhat";

// run pnpm exec hardhat help to check newly added task: deploy
// the deploy task is added using hardhat-deploy dep
const deployBox: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log(chalk.bgMagenta("deploying box token"));

  const _box = await deploy("Box", {
    from: deployer,
    args: [],
    log: false,

    // wait a few blocks before contract deployment is done
    waitConfirmations: 1,
  });

  const _timelock = await get("MyGovernorTimelock");
  const timelock = await ethers.getContractAt("MyGovernorTimelock", _timelock.address);
  const box = await ethers.getContractAt("Box", _box.address);

  const confirmationBlocksToWait = 1;
  const transferOwnerTx = await box.transferOwnership(timelock.address);
  await transferOwnerTx.wait(confirmationBlocksToWait);

  console.log(chalk.bgMagenta("box deployed to: ", box.address));
};

export default deployBox;
