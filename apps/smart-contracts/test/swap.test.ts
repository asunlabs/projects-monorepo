import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import * as helpers from "@nomicfoundation/hardhat-network-helpers";
import USDC_ABI from "./USDC.json";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config();

const { FORK_USDC_WHALE, FORK_DAI_WHALE, FORK_USDC_MAINNET } = process.env;
const UNISWAP_ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
let dex: Contract;

describe("Dex", function () {
  beforeEach(async function DeployContract() {
    const Dex = await ethers.getContractFactory("Dex");
    const _dex = await Dex.deploy();
    dex = await _dex.deployed();
  });

  it("Should fetch a correct name", async function TestDexName() {
    expect(await dex.name()).to.equal("Dex");
  });

  it("Should impersonate mainnet account", async function TestMainnetFork() {
    // FORK_DAI_WHALE has 25 ethers and many DAI, USDC
    if (FORK_DAI_WHALE !== undefined) {
      await helpers.impersonateAccount(FORK_DAI_WHALE);
      const impersonatedAccount = await ethers.getSigner(FORK_DAI_WHALE);
      const [hardhatAccount] = await ethers.getSigners();
      console.log(await impersonatedAccount.getChainId());

      await impersonatedAccount.sendTransaction({
        to: hardhatAccount.address,
        value: ethers.utils.parseUnits("1", "ether"),
        gasLimit: 3000000,
      });
      console.log(await impersonatedAccount.getBalance()); // got 24 ether now

      expect(await hardhatAccount.getBalance()).closeTo(await hardhatAccount.getBalance(), ethers.utils.parseEther("0.01"));
    }
  });

  it("Should read USDC whale balance", async function TestUSDCswap() {
    // get mainnet USDC contract
    const USDC = await ethers.getContractAt(USDC_ABI, FORK_USDC_MAINNET!);
    console.log(chalk.bgRed.red("WHALE BALANCE"), await USDC.balanceOf(FORK_USDC_WHALE));
    expect(await USDC.balanceOf(FORK_USDC_WHALE)).not.to.equal(0);
  });

  it("Should approve Dex for USDC", async function TestUSDCswap() {
    const USDC = await ethers.getContractAt(USDC_ABI, FORK_USDC_MAINNET!);

    // impersonate whale account
    await helpers.impersonateAccount(FORK_DAI_WHALE!);
    const impersonatedDAIwhale = await ethers.getSigner(FORK_DAI_WHALE!);
    console.log(await USDC.balanceOf(impersonatedDAIwhale.address));

    await USDC.connect(impersonatedDAIwhale).approve(dex.address, ethers.utils.parseUnits("10", "mwei")); // mwei: 1e6
    expect(await USDC.allowance(impersonatedDAIwhale.address, dex.address)).to.equal((10 * 1e6).toString());
  });

  it("Should swap USCD for ETH", async function TestTransfer() {
    const USDC = await ethers.getContractAt(USDC_ABI, FORK_USDC_MAINNET!);

    await helpers.impersonateAccount(FORK_DAI_WHALE!);
    const signer = await ethers.getSigner(FORK_DAI_WHALE!);
    console.log(chalk.bgWhite.black.bold("before swap:"), await USDC.balanceOf(signer.address));
    console.log(chalk.bgCyan.white("before ETH: "), await signer.getBalance());

    // signer should approve dex
    await USDC.connect(signer).approve(dex.address, ethers.utils.parseUnits("10", "mwei"));
    console.log(await USDC.allowance(signer.address, dex.address));

    // signer should call swap
    await dex.connect(signer).swapUSDCForEth(ethers.utils.parseUnits("10", "mwei")); // signer should call the swap function

    // balance should be updated after swap
    console.log(chalk.bgWhite.black.bold("after swap:"), await USDC.balanceOf(signer.address));
    console.log(chalk.bgCyan.white("after ETH: "), await signer.getBalance());
  });
});
