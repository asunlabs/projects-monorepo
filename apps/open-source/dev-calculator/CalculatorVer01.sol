// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

/// @title CalculatorVer01
/// @author Jake Sung, find @developerasun on github
/// @notice Development schedule calculator for Junior engineers. Enter work and get total schedule.
/// @dev This is a implementation contract. Contract architecture motivated by Chainlink Data feeds

// mode(minimum, plain, maximum) ===(set weight)===> weight(minimum, plain, maximum)
// weight ===(set schedule)===> calculateSchedule()
// end user ===(get schedule)===> getTotalSchedule()

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

    /// @return default unit decimal is 10 ** 2.
    function decimals() external pure returns(uint256) {
        return _decimals;
    }

    // TODO add error handling
    /// @return weight in this contract's decimals
    function weight(uint256 _weight) internal pure returns(uint256) {
        if (_weight == MINIMUM_WEIGHT) {
            return MINIMUM_WEIGHT;
        } else if (_weight == PLAIN_WEIGHT) {
            return PLAIN_WEIGHT; 
        } else if (_weight == MAXIMUM_WEIGHT) {
            return MAXIMUM_WEIGHT; 
        } else { 
            revert();
        }
    }

    /// @param _work a type of functionality to develop
    /// @param _expected an amount of expected time for the work
    function calculateOneWork(string memory _work, uint256 _expected) external returns(Work memory) {
        bytes32 _label = keccak256(abi.encode(_work));
        uint256 calculatedWithDecimals = _expected ** _decimals;

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

    function deleteOneWork(string memory _work) external {
        bytes32 _label = keccak256(abi.encode(_work));
        delete workList[_label];
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
        return minimumTotalSchedule;
    }

    /// @return plain time unit. default
    function getTotalSchedule() external view returns(uint256) {
        uint256 plainTotalSchedule;
        for (uint256 i=0; i<_workList.length; i++) {
            plainTotalSchedule += _workList[i].PLAIN;
        }
        return plainTotalSchedule;
    }

    /// @return maximum time unit
    function getTotalSchedule(uint256 _maximum, uint256 _init) external view returns(uint256) {
        require(_maximum == MAXIMUM_WEIGHT, "Only maximum");
        require(_init == 0, "Init should be 0");
        
        uint256 maximumTotalSchedule = _init;
        for (uint256 i=0; i<_workList.length; i++) {
            maximumTotalSchedule += _workList[i].MAXIMUM;
        }
        return maximumTotalSchedule;
    }


}