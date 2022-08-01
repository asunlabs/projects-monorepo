// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

/// @title CalculatorVer01
/// @author Jake Sung, find @developerasun on github
/// @notice Development schedule calculator for Junior engineers. Enter work and get total schedule.
/// @dev This is a implementation contract. Contract architecture motivated by Chainlink Data feeds

contract CalculatorVer01 {

    uint256 public divider = 10 ** 3;
    uint256 private immutable _decimals = 10 ** 2;
    uint256 private immutable MINIMUM_WEIGHT = 10;
    uint256 private immutable PLAIN_WEIGHT = 25;
    uint256 private immutable MAXIMUM_WEIGHT = 40;

    mapping (bytes32=>Work) public workList;
    Work[] private _workList;

    /// @dev Expected development schedule mode. 
    struct Work {
        bytes32 label;
        uint256 MINIMUM;
        uint256 PLAIN;
        uint256 MAXIMUM;
    }

    /// @dev error handling for weight
    error InvalidWeight(uint256 actual, uint256 expected);

    /// @return default unit decimal is 10 ** 2.
    function decimals() external pure returns(uint256) {
        return _decimals;
    }

    /// @return weight in this contract's decimals
    function weight(uint256 _weight) internal pure returns(uint256) {
        if (_weight == MINIMUM_WEIGHT) {
            return MINIMUM_WEIGHT;
        } else if (_weight == PLAIN_WEIGHT) {
            return PLAIN_WEIGHT; 
        } else if (_weight == MAXIMUM_WEIGHT) {
            return MAXIMUM_WEIGHT; 
        } else { 
            revert InvalidWeight({
                actual: _weight,
                expected: MINIMUM_WEIGHT | PLAIN_WEIGHT | MAXIMUM_WEIGHT
            });
        }
    }

    /// @param _expected should be entered in hour format
    function toSeconds(uint256 _expected) public pure returns(uint256) {
        require(_expected / 1 hours == 0, "Format is 1 hour");
        uint256 inSeconds = _expected * 3600;
        return inSeconds;
    }

    /// @param _work a type of functionality to develop
    /// @param _expectedHour an amount of expected time for the work. should be entered in hour. e.g 1, 2, 3, ...
    function calculateOneWork(string memory _work, uint256 _expectedHour) external returns(Work memory) {
        bytes32 _label = keccak256(abi.encode(_work));
        uint256 inSeconds = toSeconds(_expectedHour);
        uint256 calculatedWithDecimals = inSeconds ** _decimals;

        Work memory oneWork = Work({
            label: _label,
            MINIMUM: calculatedWithDecimals * weight(MINIMUM_WEIGHT),
            PLAIN: calculatedWithDecimals * weight(PLAIN_WEIGHT),
            MAXIMUM : calculatedWithDecimals * weight(MAXIMUM_WEIGHT)
        });

        workList[_label] = oneWork;
        _workList.push(oneWork);

        return oneWork;
    }

    function deleteOneWork(string memory _work, uint256 _index) external {
        bytes32 _label = keccak256(abi.encode(_work));
        delete workList[_label];
        delete _workList[_index];
    }

    /// @dev overloading MINIMUM, PLAIN, MAXIMUM
    /// @notice Returns a schedule within plain timeline
    /// @return minimum time unit
    function getTotalSchedule(uint256 _minimum) external view returns(uint256) {
        require(_minimum == MINIMUM_WEIGHT, "Only minimum");
        uint256 minimumTotalSchedule;
        for (uint256 i=0; i<_workList.length; i++) {
            minimumTotalSchedule += _workList[i].MINIMUM;
        }
        return minimumTotalSchedule; // in seconds(3600) * decimal(100) * weight(10 | 25 | 40) => should be divided 3600 and 1e3
    }

    /// @return plain time unit. default
    function getTotalSchedule() external view returns(uint256) {
        uint256 plainTotalSchedule;
        for (uint256 i=0; i<_workList.length; i++) {
            plainTotalSchedule += _workList[i].PLAIN;
        }
        return plainTotalSchedule;
    }

    /// @param _init overloading differentiator
    /// @return maximum time unit
    function getTotalSchedule(uint8 _init) external view returns(uint256) {
        require(_init == 0, "Initial value should be 0");
        
        uint256 maximumTotalSchedule = _init;
        for (uint256 i=0; i<_workList.length; i++) {
            maximumTotalSchedule += _workList[i].MAXIMUM;
        }
        return maximumTotalSchedule;
    }
}