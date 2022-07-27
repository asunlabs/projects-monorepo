import { ethers, network } from "hardhat";
import "ethereum-waffle";
import { deployContract, loadFixture, Fixture, MockProvider, solidity } from "ethereum-waffle";
import hre from "hardhat";
import { Contract, Wallet } from "ethers";
import { expect, use } from "chai";
import * as helpers from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chalk from "chalk";

use(solidity);

const PREFIX = "unit-datafeedfactory";
let contract: Contract;

// 20220726 FIX: invliadInputError
// 20220727 FIX: fixture not working
// const useFixture = async (wallets: Wallet[], provider: MockProvider) => {
//   const DATAFEEDFACTORY_ABI = await hre.artifacts.readArtifact("DataFeedFactory");
//   const [owner, recipient] = await ethers.getSigners();
//   contract = await deployContract(owner, DATAFEEDFACTORY_ABI);
//   return { owner, recipient, contract };
// };

describe.only(`${PREFIX}-price-oracle`, function TestOracle() {
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
  it("Should read the latest price from mainnet", async function TestFetchingLatestPrice() {
    // const { owner } = await loadFixture(useFixture);
    const mainnetEthUsdAggregator = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
    await contract.initDataFeeds(mainnetEthUsdAggregator);
    const ETH_USD_AGGREGATOR_INDEX = 0;
    console.log(chalk.bgMagenta.bold("PRICE ORACLE: "), await contract.getPrice(ETH_USD_AGGREGATOR_INDEX));
    await expect(contract.getPrice(ETH_USD_AGGREGATOR_INDEX)).not.to.be.reverted;
  });
  it("Should return pair string", async function TestPairString() {
    const mainnetEthUsdAggregator = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
    await contract.initDataFeeds(mainnetEthUsdAggregator);
    const ETH_USD_AGGREGATOR_INDEX = 0;
    console.log(chalk.bgMagenta.bold("PAIR: "), await contract.getDescription(ETH_USD_AGGREGATOR_INDEX));
    expect(await contract.getDescription(ETH_USD_AGGREGATOR_INDEX)).to.equal("ETH / USD");
  });
  it("Should retrun a correct decimals", async function TestDecimals() {
    const mainnetEthUsdAggregator = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
    await contract.initDataFeeds(mainnetEthUsdAggregator);
    const ETH_USD_AGGREGATOR_INDEX = 0;
    console.log(chalk.bgMagenta.bold("DECIMAL: "), await contract.getDecimals(ETH_USD_AGGREGATOR_INDEX));
    expect(await contract.getDecimals(ETH_USD_AGGREGATOR_INDEX)).to.equal(8);
  });
  it("Should read USDC/ETH data feeds", async function TestUsdcEthFeed() {
    const mainnetUsdcEthAggregator = "0x986b5E1e1755e3C2440e960477f25201B0a8bbD4";
    await contract.initDataFeeds(mainnetUsdcEthAggregator);
    const USDC_ETH_AGGREGATOR_INDEX = 0;
    console.log(chalk.bgMagenta.bold("PRICE ORACLE: "), await contract.getPrice(USDC_ETH_AGGREGATOR_INDEX));
    await expect(contract.getPrice(USDC_ETH_AGGREGATOR_INDEX)).not.to.be.reverted;
  });
});
