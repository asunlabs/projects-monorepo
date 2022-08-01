const { hre, ethers } = require("hardhat");

const deployer = async (name, ...args) => {
  const Contract = await ethers.getContractFactory(name);
  const contract = await Contract.deploy(name, ...args);

  return contract;
};

async function main() {
  const newlyCreatedEOA = "0x9232A981C868a97B63c50CE7B4D5d484CE3078f6";
  // 100 is not a correct supply but simplified here.
  const left = await deployer("Left", "LL", 100, newlyCreatedEOA);
  // const right = await deployer("Right", "RR", 100, "0xEcAB21327B6EbA1FB0631Dc9bBc5863B6B2be3E4");

  await left.deployed();
  // await right.deployed();
  // await hre.ether => fix ethers
  // const Left = await ethers.getContractFactory("Left");
  // const left = await Left.deploy("Left", "LL", 100, "0xEcAB21327B6EbA1FB0631Dc9bBc5863B6B2be3E4");

  // await left.deployed();

  console.log("addr?:", left.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
