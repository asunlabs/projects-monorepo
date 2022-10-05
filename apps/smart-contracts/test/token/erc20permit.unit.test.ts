import { ethers } from "hardhat";
import { Contract } from "ethers";
import { expect } from "chai";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import chalk from "chalk";

import dotenv from "dotenv";

dotenv.config({ path: "../../.env.development" });

const { ACCOUNT_GOERLI_PRIVATE_KEY, ACCOUNT_GOERLI_PUBLIC_ADDRESS } = process.env;

const PREFIX = "unit-MyPermit";
let vault: Contract;
let erc20Token: Contract;

// @dev hardhat's new fixture
const useFixture = async () => {
  const MyPermitTokenFactory = await ethers.getContractFactory("MyPermitToken");
  const _myPermitToken = await MyPermitTokenFactory.deploy("jakeToke", "jake");
  const ERC20Token = await _myPermitToken.deployed();
  erc20Token = ERC20Token;

  const MyPermit = await ethers.getContractFactory("MyPermitVault");
  const myPermit = await MyPermit.deploy(ERC20Token.address);
  vault = await myPermit.deployed();

  const [owner, recipient] = await ethers.getSigners();

  return { vault, erc20Token, owner, recipient };
};

describe(`${PREFIX}-ERC20Permit/EIP712`, async function TestPermission() {
  it("Should permit for a signer", async function TestERC20Permit() {
    const { vault, erc20Token, owner } = await loadFixture(useFixture);

    // useERC20Permit.ts => setDeadline, getDeadline
    const oneMinute = time.duration.minutes(1);
    const currentTimestamp = await time.latest();
    const deadline = currentTimestamp + oneMinute;

    const provider = ethers.getDefaultProvider("goerli");
    const signer = new ethers.Wallet(ACCOUNT_GOERLI_PRIVATE_KEY!, provider);

    const mintAmount = ethers.utils.parseEther("1");
    await erc20Token.mint(signer.address, mintAmount);

    /**
     *  IERC20 token,
        uint256 deadline,
        uint256 amount,
        uint8 v,
        bytes32 r,
        bytes32 s
     */
    const domainData = {
      name: "MyPermitVault",
      version: "1",
      chainId: await owner.getChainId(),
      verifyingContract: vault.address,
    };

    // ERC20Permit typeHash: Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline
    const types = {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };

    // data to sign
    const value = {
      owner: signer.address, // token holder
      spender: vault.address,
      value: mintAmount,
      nonce: await signer.provider.getTransactionCount(signer.address),
      deadline: deadline,
    };

    const signature = await signer._signTypedData(domainData, types, value);
    console.log({ signature });
    const { v, r, s } = ethers.utils.splitSignature(signature);

    // TODO fix token balance not moved error
    await expect(vault.connect(signer).verifyPermissionAndTransfer(mintAmount, deadline, v, r, s)).not.to.reverted;
  });

  it("Should return a correct nonce", async function TestNonce() {
    const { erc20Token, owner } = await loadFixture(useFixture);
    const nonceTx = await erc20Token.getNonce(owner.address);
    await nonceTx.wait(1);
    // console.log({ nonceTx }); // tx object contains nonce, data, v, r, s

    expect(nonceTx.nonce).to.equal((await owner.getTransactionCount()) - 1);
  });

  it("Should return a proper chain id", async function TestChainID() {
    const { erc20Token, owner } = await loadFixture(useFixture);

    const jakeSigner = new ethers.Wallet(ACCOUNT_GOERLI_PRIVATE_KEY!);
    const _erc20Token = erc20Token.attach(jakeSigner.address);
    const chainId = 31337;

    expect((await _erc20Token.provider.getNetwork()).chainId).to.equal(chainId);
    expect(await owner.getChainId()).to.equal((await _erc20Token.provider.getNetwork()).chainId);
  });
});
