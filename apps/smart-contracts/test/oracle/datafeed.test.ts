import { ethers } from "hardhat";
import { Contract } from "ethers";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import chalk from "chalk";

const PREFIX = "unit-datafeedfactory";
let contract: Contract;

// @dev hardhat's new fixture
const useFixture = async () => {
  const DataFeedFactory = await ethers.getContractFactory("DataFeedFactory");
  const dataFeedFactory = await DataFeedFactory.deploy();
  contract = await dataFeedFactory.deployed();
  return { contract };
};

describe(`${PREFIX}-price-oracle`, function TestOracle() {
  it("ETH/USD aggregator should initialize", async function TestEthUsdFeed() {
    const { contract } = await loadFixture(useFixture);
    // Kovan: ETH/USD
    const kovanEthUsdAggregator = "0x9326BFA02ADD2366b30bacB125260Af641031331";
    await contract.initDataFeeds(kovanEthUsdAggregator);
    // console.log(contract);
    // only public state variable is readable
    expect(await contract.feeds(0)).to.equal(kovanEthUsdAggregator);
  });

  it("Should read the latest price from mainnet", async function TestFetchingLatestPrice() {
    const { contract } = await loadFixture(useFixture);
    const mainnetEthUsdAggregator = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
    await contract.initDataFeeds(mainnetEthUsdAggregator);
    const ETH_USD_AGGREGATOR_INDEX = 0;
    console.log(chalk.bgMagenta.bold("PRICE ORACLE: "), await contract.getPrice(ETH_USD_AGGREGATOR_INDEX));
    await expect(contract.getPrice(ETH_USD_AGGREGATOR_INDEX)).not.to.be.reverted;
  });

  it("Should return pair string", async function TestPairString() {
    const { contract } = await loadFixture(useFixture);
    const mainnetEthUsdAggregator = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
    await contract.initDataFeeds(mainnetEthUsdAggregator);
    const ETH_USD_AGGREGATOR_INDEX = 0;
    console.log(chalk.bgMagenta.bold("PAIR: "), await contract.getDescription(ETH_USD_AGGREGATOR_INDEX));
    expect(await contract.getDescription(ETH_USD_AGGREGATOR_INDEX)).to.equal("ETH / USD");
  });

  it("Should retrun a correct decimals", async function TestDecimals() {
    const { contract } = await loadFixture(useFixture);
    const mainnetEthUsdAggregator = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
    await contract.initDataFeeds(mainnetEthUsdAggregator);
    const ETH_USD_AGGREGATOR_INDEX = 0;
    console.log(chalk.bgMagenta.bold("DECIMAL: "), await contract.getDecimals(ETH_USD_AGGREGATOR_INDEX));
    expect(await contract.getDecimals(ETH_USD_AGGREGATOR_INDEX)).to.equal(8);
  });

  it("Should read USDC/ETH data feeds", async function TestUsdcEthFeed() {
    const { contract } = await loadFixture(useFixture);
    const mainnetUsdcEthAggregator = "0x986b5E1e1755e3C2440e960477f25201B0a8bbD4";
    await contract.initDataFeeds(mainnetUsdcEthAggregator);
    const USDC_ETH_AGGREGATOR_INDEX = 0;
    console.log(chalk.bgMagenta.bold("PRICE ORACLE: "), await contract.getPrice(USDC_ETH_AGGREGATOR_INDEX));
    await expect(contract.getPrice(USDC_ETH_AGGREGATOR_INDEX)).not.to.be.reveted;
  });
});
