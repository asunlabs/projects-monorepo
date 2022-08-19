// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/crosschain/CrossChainEnabledUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlCrossChainUpgradeable.sol";

/**
 * * How Cross chain support is done
 * Assume like below
 * Token A: deploy to Ethereum mainnet
 * User B: Polygon network user, wanting to mint the token A
 
 * 1. abstractize token contract so that it can be interchangeable for various chains
 * 2. add onlyCrossChainSender modifier for cross-chain-only operation
 * 3. specialize the token for the target chain with bridge system

 * ! Note that Ownerable mechanism does not work in cross-chain owner entity. Use Access contrl intead.
 */

abstract contract MyTokenCrossChainUpgradeable is Initializable, ERC20Upgradeable, UUPSUpgradeable, CrossChainEnabledUpgradeable, AccessControlCrossChainUpgradeable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwnerFromRemote) initializer public {
        __ERC20_init("MyToken", "MTK");
        __UUPSUpgradeable_init();

        /// @dev Use access control for more strict local account control
        /// @dev Remember that the same contract addresses can have totally different logics and states
        __AccessControl_init();
        _grantRole(_crossChainRoleAlias(DEFAULT_ADMIN_ROLE), initialOwnerFromRemote);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}
}
