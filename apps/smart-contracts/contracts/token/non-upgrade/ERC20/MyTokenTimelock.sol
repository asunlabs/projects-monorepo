// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

// import "@openzeppelin/contracts/token/preset/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/token/ERC20/utils/TokenTimelock.sol";
 
contract MyTokenTimelock is TokenTimelock {
    /**
     * see this article: https://forum.openzeppelin.com/t/example-using-tokentimelock/2325/2
     * conditions for token lock 
     * 1) you have to calculate release time using block.timestamp
     * 2) you have to transfer token to this contract
     */
    constructor(IERC20 token, address beneficiary, uint256 releaseTime) TokenTimelock(token, beneficiary, releaseTime) {}
}