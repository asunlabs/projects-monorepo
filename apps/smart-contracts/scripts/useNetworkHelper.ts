import * as helpers from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";
import hre from "hardhat";

const scriptCommand = "pnpm exec hardhat run scripts/useNetworkHelper.ts";

async function main() {
  const DAI_WHALE_MAINNET = "0x1B7BAa734C00298b9429b518D621753Bb0f6efF2";
  await helpers.impersonateAccount(DAI_WHALE_MAINNET);

  const impersonatedSigner = await impersonateAddress(DAI_WHALE_MAINNET);
  const [recipient] = await ethers.getSigners();
  const response = await impersonatedSigner.sendTransaction({
    to: recipient.address,
    value: ethers.utils.parseUnits("1", "ether"),
  });

  console.log("tx hash: ", response.hash);
  console.log(await recipient.getBalance());
}

// convert address to impersonated signer
const impersonateAddress = async (address: string) => {
  await helpers.impersonateAccount(address);
  const impersonateSigner = ethers.getSigner(address);
  return impersonateSigner;
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
