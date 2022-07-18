import { expect } from "chai";
import SwapTokenForToken from "./SwapTokenForToken.json";
import IERC20 from "./IERC20.json";
import { ethers } from "hardhat";
import helpers from "@nomicfoundation/hardhat-network-helpers";

// import {get} from 'ethers'
describe("test network helper", function () {
  const AMOUNT_IN = 10;
  const AMOUNT_OUT_MIN = 1;
  const TOKEN_IN = "0x31F42841c2db5173425b5223809CF3A38FEde360";
  const TOKEN_OUT = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
  const TO = "0xEcAB21327B6EbA1FB0631Dc9bBc5863B6B2be3E4";
  it("asdf", async function () {
    // const IERC20 = await ethers.getContractAt("DAI", TOKEN_IN);
    // const iERC20 = await IERC20.deployed();
    // await iERC20.deployed();
    expect("DAI").to.equal("DAI");
  });
  it("Impersonate DAI whale", async function () {
    const address = "0x1B7BAa734C00298b9429b518D621753Bb0f6efF2";
    // const provider = new ethers.providers.InfuraProvider();
    // await helpers.impersonateAccount(address);
    // const signer = provider.getSigner(address);
    // console.log(await signer.getBalance());
  });
});
