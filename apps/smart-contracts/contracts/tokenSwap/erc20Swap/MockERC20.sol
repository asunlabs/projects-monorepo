// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Mock is ERC20 {
    constructor() ERC20("USDC Coin", "USDC") {
        _mint(msg.sender, 1000 * 10**decimals());
    }
}
