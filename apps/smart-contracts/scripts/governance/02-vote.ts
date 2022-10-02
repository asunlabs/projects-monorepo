import fs from "fs";
import path from "path";
import hre, { ethers } from "hardhat";
import { developmentChains } from "./01-propose";
import { mine, mineUpTo, time } from "@nomicfoundation/hardhat-network-helpers";
import { VOTING_PERIOD } from "../../deploy/02-deploy-time-lock";
import chalk from "chalk";
import { network } from "hardhat";

// pnpm exec hardhat run scripts/governance/02-vote.ts --network localhost

export async function moveBlocks(amount: number) {
  console.log("Moving blocks...");
  for (let index = 0; index < amount; index++) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    });
  }
  console.log(`Moved ${amount} blocks`);
}

const index = 0;

async function main(proposalIndex: number) {
  const jsonFilePath = path.join(__dirname, "proposals.json");
  const proposals = JSON.parse(fs.readFileSync(jsonFilePath, { encoding: "utf-8" }));
  const governor = await ethers.getContractAt("MyGovernor", "0x40a42Baf86Fc821f972Ad2aC878729063CeEF403");

  /// @dev parameters for castVoteWithReason
  const proposalId = proposals[hre.network.config.chainId!][proposalIndex];
  const voteWay = 1; // 0 = against, 1 = for, 2 = abstain
  const reason = "no reason";

  /**
 * * castVoteWithReason function signature
 * function castVoteWithReason(
        uint256 proposalId,
        uint8 support,
        string calldata reason
    ) public virtual override returns (uint256)
 */
  const voteTxResponse = await governor.castVoteWithReason(proposalId, voteWay, reason);
  const confirmationBlocksToWait = 1;
  await voteTxResponse.wait(confirmationBlocksToWait);

  // TODO fix proposal already exists error
  // artificially move blocks for faster checking
  if (developmentChains.includes(hre.network.name)) {
    const current = await time.latestBlock();
    console.log(chalk.bgMagenta("CURRENT BLOCK:"), current);

    // Mines new blocks until the latest block number is blockNumber
    await mine(VOTING_PERIOD + 1);
    console.log(chalk.bgCyan("MINED UP TO:"), await time.latestBlock());
  }

  console.log("voted finished");
  console.log("proposal state should be 4 if voting succeeded: ", await governor.state(proposalId));
}

// recommended hardhat error handling pattern

main(index)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
