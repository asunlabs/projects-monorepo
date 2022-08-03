import { Contract, Signer } from "ethers";
import { ethers, upgrades } from "hardhat";
import chalk from "chalk";

type proxyPattern = "transparent" | "uups" | "beacon";

async function useTransparent(contractName: string, signer?: Signer, constructorArgs?: any) {
  let contract: Contract;
  const Contract = await ethers.getContractFactory(contractName, signer);
  contract = await upgrades.deployProxy(Contract, [...constructorArgs], {
    initializer: "initializer",
    kind: "transparent",
  });

  console.log(`===== ${contractName} is transparent proxy =====`);
  console.log(chalk.bgMagenta.bold(`${contractName} deployed to: `), contract.address);

  return contract;
}

async function upgradeTransparent(proxyAddress: string) {}

async function useUUPS() {}

async function useBeacon() {
  // upgrades.prepareUpgrade; // upgrade-safe validation
}

async function proxyRouter(pattern: proxyPattern) {
  if (pattern == "transparent") {
    // await useTransparent();
  }

  if (pattern == "uups") {
    // await useUUPS();
  }

  if (pattern == "beacon") {
    // await useBeacon();
  }
}

export default proxyRouter;
