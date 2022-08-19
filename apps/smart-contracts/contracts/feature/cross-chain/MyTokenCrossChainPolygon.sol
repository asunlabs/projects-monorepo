// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./MyTokenCrossChainUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/crosschain/polygon/CrossChainEnabledPolygonChildUpgradeable.sol";

address constant polygonMainnetChild = 0x8397259c983751DAf40400790063935a11afa28a; 
contract MyTokenCrossChainPolygon is MyTokenCrossChainUpgradeable, CrossChainEnabledPolygonChildUpgradeable(polygonMainnetChild) {
/**
 * Polygon uses a FX portal system with state sync for chain bridge
 * Fx-portal docs: https://docs.polygon.technology/docs/develop/l1-l2-communication/fx-portal/#contract-addresses[Polygon's%20Fx-Portal%20documentation]
 
 * * FxRoot contract 
 * * Ethereum mainnet: 0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2
 * * Goerli testnet: 0x3d1d3E34f7fB6D26245E6640E1c50710eFFf15bA

 * * FxChild contract
 * * Polygon mainnet: 0x8397259c983751DAf40400790063935a11afa28a
 * * Mumbai testnet: 0xCf73231F28B7331BBe3124B907840A94851f9f11

 */
}
