import { ethers, network } from "hardhat";
import "ethereum-waffle";
import { deployContract, loadFixture, Fixture, MockProvider } from "ethereum-waffle";
import hre from "hardhat";
import { Contract, Wallet } from "ethers";
import { expect } from "chai";

let contract: Contract;

// 20220726 FIX: invliadInputError
const useFixture = async (wallets: Wallet[], provider: MockProvider) => {
  const { abi, bytecode } = await hre.artifacts.readArtifact("DataFeedFactory");
  const contractJSON = { abi, bytecode };
  const [owner] = await ethers.getSigners();
  const dataFeedFactory = await deployContract(owner, contractJSON);
  contract = await dataFeedFactory.deployed();
  return { owner, contract };
};

describe("Price oracle with chainlink", function TestOracle() {
  beforeEach("Should deploy", async function () {
    const DataFeedFactory = await ethers.getContractFactory("DataFeedFactory");
    const dataFeedFactory = await DataFeedFactory.deploy();
    contract = await dataFeedFactory.deployed();
  });
  it("ETH/USD aggregator should initialize", async function TestEthUsdFeed() {
    // Kovan: ETH/USD
    const kovanEthUsdAggregator = "0x9326BFA02ADD2366b30bacB125260Af641031331";
    await contract.initDataFeeds(kovanEthUsdAggregator);
    // console.log(contract);
    // only public state variable is readable
    expect(await contract.feeds(0)).to.equal(kovanEthUsdAggregator);
  });
  it.only("Should read the latest price", async function TestFetchingLatestPrice() {
    console.log(await contract.getPrice(0));
  });
});
