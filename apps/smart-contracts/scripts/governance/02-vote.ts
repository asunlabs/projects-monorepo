import fs from "fs";
import path from "path";
import hre, { ethers } from "hardhat";
import chalk from "chalk";
import { developmentChains, VOTING_PERIOD } from "../../gov-config";
import { mine } from "@nomicfoundation/hardhat-network-helpers";

// pnpm exec hardhat run scripts/governance/02-vote.ts --network localhost

const index = 0;

async function main(proposalIndex: number) {
  const jsonFilePath = path.join(__dirname, "proposals.json");
  const proposals = JSON.parse(fs.readFileSync(jsonFilePath, { encoding: "utf-8" }));
  const governor = await ethers.getContractAt("MyGovernor", "0x40a42Baf86Fc821f972Ad2aC878729063CeEF403");

  /// @dev parameters for castVoteWithReason
  const proposalId = proposals[hre.network.config.chainId!][proposalIndex];
  const voteWay = 1; // 0 = against, 1 = for, 2 = abstain
  const reason = "no reason";

  const voteTxResponse = await governor.castVoteWithReason(proposalId, voteWay, reason);
  const confirmationBlocksToWait = 1;
  await voteTxResponse.wait(confirmationBlocksToWait);

  console.log(
    chalk.bgCyan(
      "proposal state when voting casted: ",
      await governor.state("10967182955993030631666436770818595266186349297643790976074693315478415453599")
    )
  );

  if (developmentChains.includes(hre.network.name)) {
    await mine(VOTING_PERIOD + 1);
  }

  console.log(chalk.bgCyan("voting finished"));
  console.log(
    chalk.bgCyan("proposal state when mined: ", await governor.state("10967182955993030631666436770818595266186349297643790976074693315478415453599"))
  );
}

// recommended hardhat error handling pattern

main(index)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
