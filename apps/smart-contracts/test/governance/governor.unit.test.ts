import { ethers } from "hardhat";
import { BigNumber, Contract, Wallet } from "ethers";
import { expect } from "chai";
import { loadFixture, mine, time } from "@nomicfoundation/hardhat-network-helpers";
import chalk from "chalk";
import dotenv from "dotenv";
import deployer from "../../scripts/hooks/useDeployer";

dotenv.config({ path: "../../.env.development" });

const { ACCOUNT_GOERLI_PRIVATE_KEY, ACCOUNT_GOERLI_PUBLIC_ADDRESS } = process.env;

const PREFIX = "unit-MyGovernor";

function useWalletSigner(privateKey: string, _contract?: Contract) {
  let contract;
  const walletSigner = new ethers.Wallet(privateKey);

  if (_contract !== undefined) {
    // change network to wallet signer's network
    contract = _contract.attach(walletSigner.address);
  } else {
    contract = "";
  }

  return { walletSigner, contract };
}

/**
 *
 * @param minDelay before agenda execution
 * @returns
 */
function useTimelockParams(minDelay: number) {
  const proposers: any[] = [];
  const executors: any[] = [];

  return {
    minDelay,
    proposers,
    executors,
  };
}

async function useGovernorContractParams() {
  const { minDelay, proposers, executors } = useTimelockParams(30);
  const _governanceToken = await deployer("GovernanceToken");
  const _timelock = await deployer("MyGovernorTimelock", [minDelay, proposers, executors]);

  const governanceToken = _governanceToken.contract;
  const timelock = _timelock.contract;

  return { governanceToken, timelock };
}

function useGovernorParams() {
  const votingDelay = 5;
  const votingPeriod = 10;
  const threshold = ethers.utils.parseEther("10"); // require 10 tokens to create a proposal
  const quorum = 4;

  return {
    votingDelay,
    votingPeriod,
    threshold,
    quorum,
  };
}

const useFixture = async () => {
  const { governanceToken, timelock } = await useGovernorContractParams();
  const { votingDelay, votingPeriod, threshold, quorum } = useGovernorParams();

  const MyGovernorFactory = await ethers.getContractFactory("MyGovernor");
  const _governor = await MyGovernorFactory.deploy(governanceToken.address, timelock.address, votingDelay, votingPeriod, threshold, quorum);
  const govenor = await _governor.deployed();

  const [owner, recipient] = await ethers.getSigners();

  return { govenor, owner, recipient };
};

describe(`${PREFIX}-metadata`, async function TestGovernorSetup() {
  it("Should have a correct voting delay", async function TestVotingDelay() {
    const { govenor } = await loadFixture(useFixture);
    const { votingDelay } = useGovernorParams();
    expect(await govenor.votingDelay()).to.equal(votingDelay);
  });

  it("Should have a correct voting period", async function TestVotingDelay() {
    const { govenor } = await loadFixture(useFixture);
    const { votingPeriod } = useGovernorParams();
    expect(await govenor.votingPeriod()).to.equal(votingPeriod);
  });

  it("Should have a correct quorum", async function TestQuorum() {
    const { govenor } = await loadFixture(useFixture);
    const { quorum, votingDelay } = useGovernorParams();
    const { timelock, governanceToken } = await useGovernorContractParams();
  });
});

describe(`${PREFIX}-token-delegation`, async function TestDelegation() {
  it("Should delegate and increase voting power", async function TestVotingDelegation() {
    const { owner, recipient } = await loadFixture(useFixture);
    const { governanceToken } = await useGovernorContractParams();
    const { walletSigner } = useWalletSigner(ACCOUNT_GOERLI_PRIVATE_KEY!);

    expect(await governanceToken.balanceOf(owner.address)).not.to.equal(0);
    const ownerTokenBalance = (await governanceToken.balanceOf(owner.address)).toString();
    console.log("deployer val: ", ownerTokenBalance);

    console.log(await governanceToken.delegate(recipient.address));
    expect((await governanceToken.getVotes(recipient.address)).toString()).to.equal(ownerTokenBalance);

    // check how many delegation is done
    expect(await governanceToken.numCheckpoints(recipient.address)).to.equal(1);
  });
});
