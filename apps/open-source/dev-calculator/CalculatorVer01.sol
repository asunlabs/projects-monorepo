// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

/// @title CalculatorVer01
/// @author Jake Sung, find @developerasun on github
/// @notice Development schedule calculator for Junior engineers. Enter work and get total schedule.
/// @dev This is a implementation contract. Contract architecture motivated by Chainlink Data feeds

// 1. 일정 추정을 위한 일정을 만든다.
// 1. 작업에 대한 세부 기능을 쪼갠다.
// 1. 세부 기능에 대한 일정을 추정한다.
// 1. 세부 기능 일정의 총합이 전체 추정 일정이다.
// 1. 구해진 전체 일정에 x2.5를 한 후 아래 3가지 버전을 만들어 팀에게 공유한다.

// 최소 일정: x1 => 100
// 보통 일정: x2.5 => 250 
// 최대 일정: x4 => 400

contract CalculatorVer01 {

    uint256 private immutable _decimals = 10 ** 2;

    mapping (bytes32=>Work) public totalSchedule;

    /// @dev Expected development schedule mode. 
    struct Work {
        bytes32 label;
        uint256 MINIMUM;
        uint256 PLAIN;
        uint256 MAXIMUM;
    }

    enum TimeWeight { 
        _REVERTED, // 0. weight function will revert
        _MINIMUM, // 1
        _PLAIN, // 2
        _MAXIMUM // 3
    }

    /// @return default unit decimal is 10 ** 2.
    function decimals() external pure returns(uint256) {
        return _decimals;
    }

    /// @return weight in this contract's decimals
    function weight(TimeWeight _timeWeight) external pure returns(uint256) {
        uint256 timeWeight = uint256(_timeWeight);
        
        // predefined. based on rule of thumb
        uint256 minimum = 10;
        uint256 plain = 25;
        uint256 maximum = 40;

        if (timeWeight == 0) {
            revert();
        } else if (timeWeight == 1) {
            return minimum * _decimals; // 1000
        } else if (timeWeight == 2) {
            return plain * _decimals; // 2500
        } else { 
            return maximum * _decimals; // 4000
        }
    }

    /// @param _work a type of functionality to develop
    /// @param _expected an amount of expected time for the work
    function calculateOneWork(string memory _work, uint256 _expected) external returns(Work memory) {
        bytes32 _label = keccak256(abi.encode(_work));

        uint256 calculatedWithDecimals = _expected ** _decimals;
        uint256 calculatedMinimumWeight = this.weight(TimeWeight._MINIMUM);
        uint256 calculatedPlainWeight = this.weight(TimeWeight._PLAIN);
        uint256 calculatedMaximumWeight = this.weight(TimeWeight._MAXIMUM);

        Work memory oneWork = Work({
            label: _label,
            MINIMUM: calculatedWithDecimals * calculatedMinimumWeight,
            PLAIN: calculatedWithDecimals * calculatedPlainWeight,
            MAXIMUM : calculatedWithDecimals * calculatedMaximumWeight
        });

        totalSchedule[_label] = oneWork;

        return oneWork;
    }

    /// @dev overloading MINIMUM, PLAIN, MAXIMUM
    /// @notice Returns a schedule within plain timeline
    /// @return minimum time unit
    function getTotalSchedule(string memory _work, uint8 _minimum) external returns(uint256) {
        // iterate map and calculate
    }

    /// @return plain time unit. default
    function getTotalSchedule(string memory _work) external returns(uint256) {
        
    }

    /// @return maximum time unit
    function getTotalSchedule(string memory _work, uint256 _maximum) external returns(uint256) {
        
    }


}