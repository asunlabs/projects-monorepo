const { hre, ethers } = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const { BigNumber } = require("ethers");
require("dotenv").config({ path: "../../.env.development" });

async function DeployDex() {
  let token;
  const Dex = await ethers.getContractFactory("Dex");
  const dex = await Dex.deploy();
  token = await dex.deployed();

  const etherAmount = 1;
  console.log(await token.name()); // Dex

  if (typeof process.env.FORK_DAI_WHALE !== undefined) {
    // const provider = ethers.getImpersonatedSigner(); // workfs after mainnet fork

    // FIX: gas not estimated error
    helpers.impersonateAccount(process.env.FORK_DAI_WHALE);
    const impersonateAccount = ethers.getSigner(process.env.FORK_DAI_WHALE);
    console.log((await impersonateAccount).provider._isProvider);
    console.log(await (await impersonateAccount).getBalance());
    (await impersonateAccount).sendTransaction({ from: (await impersonateAccount).address, value: ethers.utils.parseEther("1") });
    console.log(await token.swapEthForUSDC(ethers.utils.parseEther("1")));
    console.log(await token.estimateGas.swapEthForUSDC(BigNumber.from(1)));
  }
}

DeployDex()
  .then((val) => console.log("val:", val))
  .catch((err) => {
    process.exitCode = 1;
    console.error(err);
  });
