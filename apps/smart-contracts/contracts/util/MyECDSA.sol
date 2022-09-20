// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract MyECDSA {
    using ECDSA for bytes32;

    /**
     * * Verify if a recovered address is the same with the message signer.
     * get signature with ethers js, for example, 
     const hashedMessage = ethers.utilss.hashMessage('jake') // hashedData
     const signature = ethers.utils.signMessage(hashedMessage)
     */
    function verify(
        bytes32 hashedData,
        bytes memory signature,
        address messageSigner
    ) public pure returns (bool) {
        bytes32 signedMessage = hashedData.toEthSignedMessageHash();
        address recoveredAddress = signedMessage.recover(signature);
        return recoveredAddress == messageSigner ? true : false;
    }
}
