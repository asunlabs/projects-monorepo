import * as helpers from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";

async function main() {
  // mine 100 blocks
  await helpers.mine(100);
  console.log("The current block number is", await helpers.time.latestBlock());
  const address = "0x1B7BAa734C00298b9429b518D621753Bb0f6efF2";
  await helpers.impersonateAccount(address);
  // console.log(ethers.provider.getSigner(address));

  const impersonatedSigner = await ethers.getSigner(address);
  console.log(impersonatedSigner);
  // now you can send a transaction
  // impersonatedSigner.sendTransaction()
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
