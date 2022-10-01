import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import chalk from "chalk";

// Governor Values
export const MIN_DELAY = 3600; // 1 hour - after a vote passes, you have 1 hour before you can enact
export const QUORUM_PERCENTAGE = 4; // Need 4% of voters to pass
// export const VOTING_PERIOD = 45818 // 1 week - how long the vote lasts. This is pretty long even for local tests
export const VOTING_PERIOD = 5; // blocks
export const VOTING_DELAY = 1; // 1 Block - How many blocks till a proposal vote becomes active
export const THRESHOLD = 0;
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export const NEW_STORE_VALUE = 77;
export const FUNC = "store";
export const PROPOSAL_DESCRIPTION = "Proposal #1 77 in the Box!";

// run pnpm exec hardhat help to check newly added task: deploy
// the deploy task is added using hardhat-deploy dep
const deployTimelock: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log(chalk.bgMagenta("deploying timelock"));

  /**
   *    * MyTokenTimelock constructor args
   *    1) uint256 minDelay,
        2) address[] memory proposers,
        3) address[] memory executors
   */
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
