// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
contract MyFirstERC1155 is ERC1155 {
    constructor()ERC1155("ipfs://my-token"){}
}