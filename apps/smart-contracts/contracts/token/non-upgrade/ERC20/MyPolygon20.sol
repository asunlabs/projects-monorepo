// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// add polygon network(mainnet, mumbai) to wallet and deploy as it is
// fill out the wallet with matic before the deployment
// polygon block explorer: https://mumbai.polygonscan.com/
contract MyPolygon20 is ERC20 {
    constructor(uint256 _initialSupply) ERC20("MyPolygon20", "MP") {
        _mint(msg.sender, _initialSupply);
    }
}
