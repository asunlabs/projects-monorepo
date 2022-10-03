import { ethers } from "hardhat";
import { developmentChains, FUNC, NEW_STORE_VALUE, PROPOSAL_DESCRIPTION, MIN_DELAY } from "../../gov-config";
import chalk from "chalk";
import hre from "hardhat";
import { mine, time } from "@nomicfoundation/hardhat-network-helpers";

// pnpm exec hardhat run scripts/governance/03-queue-and-execute.ts --network localhost

export async function queueAndExecute() {
  const box = await ethers.getContractAt("Box", "0xefc1ab2475acb7e60499efb171d173be19928a05");
  console.log(chalk.bgMagenta(`========== box initial value: ${await box.retrieve()} ==========`));

  const encodedFunctionCall = box.interface.encodeFunctionData(FUNC, [NEW_STORE_VALUE]);
  const descriptionHash = ethers.utils.id(PROPOSAL_DESCRIPTION);

  const governor = await ethers.getContractAt("MyGovernor", "0x40a42baf86fc821f972ad2ac878729063ceef403");

  console.log(chalk.bgCyan("queuing..."));
  const queueTx = await governor.queue([box.address], [0], [encodedFunctionCall], descriptionHash);
  await queueTx.wait(1);

  if (developmentChains.includes(hre.network.name)) {
    const minDelay = time.duration.seconds(MIN_DELAY);
    const current = await time.latest();

    await time.setNextBlockTimestamp(current + minDelay + 1);
    await mine(1);
  }

  console.log(chalk.bgCyan("executing ..."));
  const executeTx = await governor.execute([box.address], [0], [encodedFunctionCall], descriptionHash);
  await executeTx.wait(1);

  const boxNewValue = await box.retrieve();
  console.log(chalk.bgCyan(`========== new box value: , ${boxNewValue} ==========`));
}

queueAndExecute()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
