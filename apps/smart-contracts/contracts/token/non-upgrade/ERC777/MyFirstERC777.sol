// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

/// @dev ERC777 is not deployable in Remix IDE
import "@openzeppelin/contracts/token/ERC777/ERC777.sol";
contract MyFirstERC777 is ERC777 {
    /**
     * receive hook: prevent user error (revert if callee contract not implementing token interface)
     * decimals in ERC777 is fixed as 18
     * operator and token holder: operator can execute token transfer if authorized
     * operator can use: operatorSend, operatorBurn
     * operator access control is: authroizeOperator, isOperatorFor, revokeOperator
     * operator must have enough tokens and ether for transaction execution
     */
    constructor(uint256 initialSupply, address[] memory defaultOperator) ERC777("MyFirst777", "MF", defaultOperator){
        _mint(msg.sender, initialSupply * uint256(10 ** decimals()), "", "");
    }
    function mint(address _account, uint256 _amount, bytes memory _userData, bytes memory _operatorData) public {
        _mint(_account, _amount, _userData, _operatorData);
    }

    function getInterfaceId() external pure returns(bytes4) {
        return type(IERC777).interfaceId;
    }
}