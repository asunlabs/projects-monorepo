// A set of arguments for governance contracts

// ========== GovernorTimelockControl ========== //
export const MIN_DELAY = 3600; // 1 hour - after a vote passes, you have 1 hour before you can enact
// ========== GovernorTimelockControl ========== //

// ========== Governor ========== //
// * constructor arguments
export const QUORUM_PERCENTAGE = 4; // Need 4% of voters to pass
export const VOTING_PERIOD = 5; // blocks
export const VOTING_DELAY = 1; // 1 Block - How many blocks till a proposal vote becomes active
export const THRESHOLD = 0; // Minimum number of votes an account must have to create a proposal.

// * propose, execute function parameters
export const NEW_STORE_VALUE = 99;
export const FUNC = "store";
export const PROPOSAL_DESCRIPTION = "Proposal #1 99 in the Box";

// * dev
export const developmentChains = ["hardhat", "localhost"];
export const proposalJsonName = "proposals.json";
// ========== Governor ========== //

// ========== Governor setup transactions, not contract ========== //
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
// ========== Governor setup transactions, not contract ========== //
