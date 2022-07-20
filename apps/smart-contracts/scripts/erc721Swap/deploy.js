const { hre, ethers } = require("hardhat");

async function main() {
  // await hre.ether => fix ethers
  const SwapTokenForToken = await ethers.getContractFactory("SmithToken");
  const swapTokenForToken = await SwapTokenForToken.deploy();

  await swapTokenForToken.deployed();

  console.log("swapTokenForToken deployed to:", swapTokenForToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
