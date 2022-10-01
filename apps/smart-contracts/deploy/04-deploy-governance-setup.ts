import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import chalk from "chalk";
import { ethers } from "hardhat";
import { ADDRESS_ZERO } from "./02-deploy-time-lock";

// run pnpm exec hardhat help to check newly added task: deploy
// the deploy task is added using hardhat-deploy dep
const deployGovernanceSetup: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { get } = deployments;
  const { deployer } = await getNamedAccounts();

  const _timelock = await get("MyGovernorTimelock");
  const _governor = await get("MyGovernor");
  const timelock = await ethers.getContractAt("MyGovernorTimelock", _timelock.address);
  const governor = await ethers.getContractAt("MyGovernor", _governor.address);

  console.log(chalk.bgMagenta("setting up governance"));

  const proposerRole = await timelock.PROPOSER_ROLE();
  const executorRole = await timelock.EXECUTOR_ROLE();
  const adminRole = await timelock.TIMELOCK_ADMIN_ROLE();

  const confirmationBlocksToWait = 1;

  // * this is a process for decentralizing governor contract.
  // make governor contract proposer
  const proposalTx = await timelock.grantRole(proposerRole, governor.address);
  await proposalTx.wait(confirmationBlocksToWait);

  // make everyone executors
  const executorTx = await timelock.grantRole(executorRole, ADDRESS_ZERO);
  await executorTx.wait(confirmationBlocksToWait);

  // revoke deployer from owning governor contract
  const revokeTx = await timelock.revokeRole(adminRole, deployer);
  await revokeTx.wait(confirmationBlocksToWait);

  console.log(chalk.bgMagenta("governance setup done: "));
};

export default deployGovernanceSetup;
