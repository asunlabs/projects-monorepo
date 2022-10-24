// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MyFuzzing {
    uint256 start;
    uint256 marked;

    constructor() {
        start = block.timestamp;
        marked = block.timestamp;
    }

    function mark() public {
        marked = block.timestamp;
    }

    // set invariants with echidna
    // see details here: https://github.com/crytic/echidna#writing-invariants
    function echidna_timepassed() public returns (bool) {
        return (start == marked);
    }

    function echidna_moretimepassed() public returns (bool) {
        return (block.timestamp < start + 10 weeks);
    }
}
