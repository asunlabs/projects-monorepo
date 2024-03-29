import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import USDC_ABI from "../abi/USDC.json";
import DAI_ABI from "../abi/DAI.json";
import dotenv from "dotenv";
import chalk from "chalk";
import { loadFixture, impersonateAccount } from "@nomicfoundation/hardhat-network-helpers";
import { anyUint, anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { PANIC_CODES } from "@nomicfoundation/hardhat-chai-matchers/panic";
import { WHALE, CONTRACT_ADDR } from "../../scripts/manager/constantManager";

dotenv.config();

const PREFIX = "unit-dex";
let dex: Contract;

const useFixture = async () => {
  const Dex = await ethers.getContractFactory("Dex");
  const _dex = await Dex.deploy();
  dex = await _dex.deployed();

  return {
    dex,
  };
};

describe(`${PREFIX}-functionality`, function () {
  it("Should fetch a correct name", async function TestDexName() {
    const { dex } = await loadFixture(useFixture);
    expect(await dex.name()).to.equal("Dex");
  });

  it("Should impersonate mainnet account", async function TestMainnetFork() {
    // DAI WHALE has 25 ethers and many DAI, USDC
    if (WHALE.MAINNET.ERC20.DAI !== undefined) {
      await impersonateAccount(WHALE.MAINNET.ERC20.DAI);
      const impersonatedAccount = await ethers.getSigner(WHALE.MAINNET.ERC20.DAI);
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
    const USDC = await ethers.getContractAt(USDC_ABI, WHALE.MAINNET.ERC20.USDC);
    console.log(chalk.bgRed.red("WHALE BALANCE"), await USDC.balanceOf(WHALE.MAINNET.ERC20.USDC));
    expect(await USDC.balanceOf(WHALE.MAINNET.ERC20.USDC)).not.to.equal(0);
  });

  it("Should approve Dex for USDC", async function TestUSDCswap() {
    const { dex } = await loadFixture(useFixture);
    const USDC = await ethers.getContractAt(USDC_ABI, CONTRACT_ADDR.MAINNET.USDC);

    // impersonate whale account
    await impersonateAccount(WHALE.MAINNET.ERC20.DAI);
    const impersonatedDAIwhale = await ethers.getSigner(WHALE.MAINNET.ERC20.DAI);
    console.log(await USDC.balanceOf(impersonatedDAIwhale.address));

    await USDC.connect(impersonatedDAIwhale).approve(dex.address, ethers.utils.parseUnits("10", "mwei")); // mwei: 1e6
    expect(await USDC.allowance(impersonatedDAIwhale.address, dex.address)).to.equal((10 * 1e6).toString());
  });

  it("Should swap USCD for ETH", async function TestTransfer() {
    const { dex } = await loadFixture(useFixture);
    const USDC = await ethers.getContractAt(USDC_ABI, CONTRACT_ADDR.MAINNET.USDC);

    await impersonateAccount(WHALE.MAINNET.ERC20.DAI);
    const signer = await ethers.getSigner(WHALE.MAINNET.ERC20.DAI);
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

  it("Should read the whale's DAI balance", async function TestDaiBalance() {
    await impersonateAccount(WHALE.MAINNET.ERC20.DAI);
    const signer = await ethers.getSigner(WHALE.MAINNET.ERC20.DAI);
    const DAI = await ethers.getContractAt(DAI_ABI, CONTRACT_ADDR.MAINNET.DAI);
    expect((await DAI.balanceOf(signer.address)) / 1e18).not.to.equal(0);
  });

  it("Should swap ETH for USDC", async function TestDAIEthSwap() {
    const { dex } = await loadFixture(useFixture);

    await impersonateAccount(WHALE.MAINNET.ERC20.DAI);
    const signer = await ethers.getSigner(WHALE.MAINNET.ERC20.DAI);
    const USDC = await ethers.getContractAt(USDC_ABI, WHALE.MAINNET.ERC20.USDC);

    console.log(chalk.bgGray("BEFORE SWAP: USDC"), await USDC.balanceOf(signer.address));
    // swapEthForUSDC requires ETH value, which is entered as a parameter in ethersjs mapping.
    await dex.connect(signer).swapEthForUSDC(ethers.utils.parseEther("1"), {
      value: ethers.utils.parseEther("1"),
    });

    console.log(chalk.bgRed.bold("AFTER SWAP: ETH "), await signer.getBalance());
    expect(await signer.getBalance()).closeTo(ethers.utils.parseEther("24"), ethers.utils.parseEther("1"));

    console.log(chalk.bgCyan("AFTER SWAP: USDC"), await USDC.balanceOf(signer.address));
    expect(await USDC.balanceOf(signer.address)).above(155078679406831);
  });
});
