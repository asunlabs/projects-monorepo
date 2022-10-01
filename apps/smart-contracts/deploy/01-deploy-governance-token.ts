import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import chalk from "chalk";
import { ethers } from "hardhat";

// run pnpm exec hardhat help to check newly added task: deploy
// the deploy task is added using hardhat-deploy dep
const deployGovernanceToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  //   log("deploying governance token");
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

  /**
   * @dev Delegate votes from the sender to `delegatee`.
   * @dev people votes based on checkpoints
   * @dev initial governance token has no delegatee
   */
  const tx = await token.delegate(delegatedAccount);
  const confirmationBlocksToWait = 1;
  await tx.wait(confirmationBlocksToWait);

  console.log(chalk.bgCyan("Checkpoints after delegate: "), await token.numCheckpoints(delegatedAccount));
};

export default deployGovernanceToken;
