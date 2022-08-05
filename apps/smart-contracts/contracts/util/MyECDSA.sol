// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract MyECDSA {
    using ECDSA for bytes32;

    /// @dev a common type of signature is a bytes65 array, with v(1), r(32), s(32) elements. 
    struct RawSignature {
        bytes8 v;
        bytes32 r;
        bytes32 s;
    }
    
    function hashData(string memory _data) public pure returns(bytes32) {
        bytes32 data = keccak256(abi.encode(_data));
        return data;
    }

    /**
     * recover: returns an address and error enum. this should be the same address
     * that has sent a transaction and signed the message.
     */
    function verify(bytes32 data, bytes memory signature, address account) public pure returns(bool) {
        return data
            .toEthSignedMessageHash() // prefix: '\x19Ethereum Signed Message:\n'
            .recover(signature) == account; 
    }
}