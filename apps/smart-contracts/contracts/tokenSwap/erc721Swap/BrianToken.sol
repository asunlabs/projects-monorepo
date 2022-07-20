// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BrianToken is ERC721, Ownable {
    constructor() ERC721("Brian", "BR") {}

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
