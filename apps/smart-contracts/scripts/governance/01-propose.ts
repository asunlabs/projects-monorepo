import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "hardhat";
import hre from "hardhat";
import { time, mineUpTo, mine } from "@nomicfoundation/hardhat-network-helpers";
import { VOTING_DELAY } from "../../deploy/02-deploy-time-lock";
import fs from "fs";
import path from "path";
import chalk from "chalk";

export const NEW_STORE_VALUE = 99;
export const FUNC = "store";
export const PROPOSAL_DESCRIPTION = "Proposal #1 99 in the Box";
export const developmentChains = ["hardhat", "localhost"];
export const proposalJsonName = "proposals.json";

// * running cmd: pnpm exec hardhat run scripts/governance/01-propose.ts --network localhost

export async function getContract(hre: HardhatRuntimeEnvironment) {
  const { deployments } = hre;
  const { get } = deployments;

  const _governor = await get("MyGovernor");
  const _box = await get("Box");

  const governor = await ethers.getContractAt("MyGovernor", _governor.address);
  const box = await ethers.getContractAt("Box", _box.address);

  return { governor, box };
}

/**
 *
 * @param functionToCall function name
 * @param args function parameter
 *
 * * encodedFunctionCall - calls 'store' function in Box contract
 * function store(uint256 newValue) public onlyOwner {
 *     value = newValue;
 *     emit ValueChanged(newValue);
 * }
 */
export async function propose(functionToCall: string, args: any[], proposalDesc: string) {
  const { box, governor } = await getContract(hre);

  const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args);

  // '0x6057361d0000000000000000000000000000000000000000000000000000000000000063'
  console.log({ encodedFunctionCall });

  console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`);
  console.log(`Proposal description: ${proposalDesc}`);

  const proposeTx = await governor.propose([box.address], [0], [encodedFunctionCall], proposalDesc);
  const proposeReceipt = await proposeTx.wait(1);

  if (developmentChains.includes(hre.network.name)) {
    // currently hardhat forking is enabled.
    const current = await time.latestBlock();
    console.log(chalk.bgMagenta("CURRENT BLOCK:"), current);

    // Mines new blocks until the latest block number is blockNumber
    await mine(VOTING_DELAY + 1);
    console.log(chalk.bgCyan("MINED UP TO:"), await time.latestBlock());
  }

  /**
   * from MyGovernor contract, 
   * emit ProposalCreated(
            proposalId, // proposeReceipt.event[0];
            _msgSender(),
            targets,
            values,
            new string[](targets.length),
            calldatas,
            snapshot,
            deadline,
            description
        );
   */
  //   console.log({ proposeReceipt });

  // ! @dev check props name correctly.
  const proposalId = proposeReceipt.events[0].args.proposalId;

  const jsonFilePath = path.join(__dirname, "proposals.json");
  console.log({ jsonFilePath });

  fs.rm(jsonFilePath, (err) => {
    if (err) throw new Error(err.message);
  });

  const jsonSpace = 4;
  fs.writeFileSync(jsonFilePath, JSON.stringify({ 31337: [] }, null, jsonSpace));

  const agenda = fs.readFileSync(jsonFilePath, { encoding: "utf-8" });
  const agendaObject = JSON.parse(agenda);

  // track the proposals.json's prop and add proposal id.
  agendaObject[hre.network.config.chainId!.toString()].push(proposalId.toString());

  // overwrite the proposal.json
  // TODO add proposal id duplicates validation later
  fs.writeFileSync(jsonFilePath, JSON.stringify(agendaObject));

  console.log("proposal json updated", fs.readFileSync(jsonFilePath, { encoding: "utf-8" }));
}

propose(FUNC, [NEW_STORE_VALUE], PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
