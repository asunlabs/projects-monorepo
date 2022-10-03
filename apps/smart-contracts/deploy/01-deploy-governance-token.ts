import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import chalk from "chalk";
import { ethers } from "hardhat";

// run pnpm exec hardhat help to check newly added task: deploy
// the deploy task is added using hardhat-deploy dep
const deployGovernanceToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log(chalk.bgMagenta("deploying governance token"));

  const GovernanceToken = await deploy("GovernanceToken", {
    from: deployer,
    args: [],
    log: false,

    // wait a few blocks before contract deployment is done
    waitConfirmations: 1,
  });

  console.log(chalk.bgMagenta("gov token deployed to: ", GovernanceToken.address));

  await delegate(GovernanceToken.address, deployer);
  console.log(chalk.bgCyan("governance token delegated to:", deployer));
};

const delegate = async function (governanceTokenAddr: string, delegatedAccount: string) {
  const token = await ethers.getContractAt("GovernanceToken", governanceTokenAddr);

  const tx = await token.delegate(delegatedAccount);
  const confirmationBlocksToWait = 1;
  await tx.wait(confirmationBlocksToWait);

  console.log(chalk.bgCyan("Checkpoints of delegatedAccount: "), await token.numCheckpoints(delegatedAccount));
};

export default deployGovernanceToken;
