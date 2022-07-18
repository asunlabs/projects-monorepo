// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

/**
WETH is commonly used in DeFi project since it can make you
interact with ETH/ERC20 with only one contract.

For example, not like this,
contract A ===> ETH 
contract B ===> ERC20

but like this.
contract A ===(WETH)===> ETH/ERC20

deposit ETH: ERC20 minted
withdraw ETH: ERC20 burned
 */

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WETH is ERC20 {
    event Deposit(address indexed account, uint256 amount);
    event Withdraw(address indexed account, uint256 amount);

    constructor() ERC20("Wrapped Ether", "WETH") {}

    // overriding ether receiving
    receive() external payable {
        this.deposit();
    }

    function deposit() external payable {
        _mint(msg.sender, msg.value);
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 _amount) external {
        _burn(msg.sender, _amount);
        payable(msg.sender).transfer(_amount);
        emit Withdraw(msg.sender, _amount);
    }
}
