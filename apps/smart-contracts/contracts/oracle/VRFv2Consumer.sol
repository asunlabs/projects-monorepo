// SPDX-License-Identifier: MIT
// An example of a consumer contract that relies on a subscription for funding.
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

// FIX: 20220727 random words not fulfilled
contract VRFv2Consumer is VRFConsumerBaseV2 {
    VRFCoordinatorV2Interface COORDINATOR;

    // The subscription ID that this contract uses for funding requests.
    uint64 s_subscriptionId;

    //  coordinator. For other networks,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    /**
     *
     * Mainnet
     * VRF coordinator: 0x271682DEB8C4E0901D1a1550aD2e64D568E69909
     * LINK: 0x514910771af9ca656af840dff83e8264ecf986ca
     * 200 gwei key hash: 0x8af398995b04c28e9951adb9721ef74c74f93e6a478f39e7e0777be13527e7ef
     * 500 gwei key hash: 0xff8dedfbfa60af186cf3c830acbc32c05aae823045ae5ea7da1e45fbfaba4f92
     * 1000 gwei key hash: 0x9fe0eebf5e446e3c998ec9bb19951541aee00bb90ea201ae456421a2ded86805
     */

    /**
     *
     * Rinkeby
     * VRF coordinator: 0x6168499c0cFfCaCD319c818142124B7A15E857ab
     * LINK: 0x514910771af9ca656af840dff83e8264ecf986ca
     * 30 gwei key hash: 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc
     */
    address vrfCoordinator = 0x6168499c0cFfCaCD319c818142124B7A15E857ab;

    // The gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    bytes32 keyHash = 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
    // so 100,000 is a safe default for this example contract. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 callbackGasLimit = 100000;

    // How many confirmations the Chainlink node should wait before responding.
    // The longer the node waits, the more secure the random value is.
    // It must be greater than the minimumRequestBlockConfirmations limit on the coordinator contract.
    uint16 requestConfirmations = 3;

    // For this example, retrieve 2 random values in one request. How many random values to request
    // Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS, which is 500
    uint32 numWords = 2;

    uint256[] public s_randomWords;
    uint256 public s_requestId;
    address s_owner;

    constructor(uint64 subscriptionId) VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_owner = msg.sender;
        s_subscriptionId = subscriptionId;
    }

    // submits the request to the VRF coordinator contract.
    // Assumes the subscription is funded sufficiently.
    function requestRandomWords() external onlyOwner {
        // Will revert if subscription is not set and funded.
        s_requestId = COORDINATOR.requestRandomWords(keyHash, s_subscriptionId, requestConfirmations, callbackGasLimit, numWords);
    }

    //   Receives random values and stores them with your contract.
    function fulfillRandomWords(
        uint256, /* requestId */
        uint256[] memory randomWords
    ) internal override {
        s_randomWords = randomWords;
    }

    modifier onlyOwner() {
        require(msg.sender == s_owner);
        _;
    }
}
