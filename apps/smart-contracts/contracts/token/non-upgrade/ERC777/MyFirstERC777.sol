// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";
contract MyFirstERC777 is ERC777 {
    constructor() ERC777("MyFirst777", "MF", new address[](0)){}

    function getInterfaceId() external pure returns(bytes4) {
        return type(IERC777).interfaceId;
    }
}