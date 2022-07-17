// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract SwapTokenForToken {
    // address should be checksummed
    // the router is deployed at: mainnet, ropsten, rinkedby, gorli, and kovan(all the same)
    address private constant UNISWAP_VER2_ROUTER_02 = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    // WETH: intermediary token for helping swap
    // mainnet: 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
    // kovan: 0xd0A1E359811322d97991E03f863a0C30C2cF029C
    // ropsten: 0xc778417E063141139Fce010982780140Aa0cD5Ab
    // rinkedby: 0xc778417E063141139Fce010982780140Aa0cD5Ab
    address private constant WETH_MAINNET = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address private constant WETH_ROPSTEN = 0xc778417E063141139Fce010982780140Aa0cD5Ab;
    address private constant DAI_ROPSTEN = 0x31F42841c2db5173425b5223809CF3A38FEde360;
    address private constant UNI_ROPSTEN = 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984;
    address private constant JAKE_ROPSTEN = 0xEcAB21327B6EbA1FB0631Dc9bBc5863B6B2be3E4;

    // TEST: swap DAI to UNI
    function swap(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        uint256 _amountOutMin,
        address _to
    ) external {
        // 1. user deposits a token into this contract(pool)
        IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn);

        // 2. user approves uniswap rotuer to spend the token
        IERC20(_tokenIn).approve(UNISWAP_VER2_ROUTER_02, _amountIn);

        address[] memory path = new address[](3);
        path[0] = _tokenIn;
        path[1] = WETH_MAINNET;
        path[2] = _tokenOut;

        IUniswapV2Router02(UNISWAP_VER2_ROUTER_02).swapExactTokensForTokens(_amountIn, _amountOutMin, path, _to, block.timestamp);
    }
}
