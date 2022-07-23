// SPDX-License-Identifier: MIT
pragma solidity 0.6.6;

import "@uniswap/v2-periphery/contracts/UniswapV2Router02.sol";

contract Dex {
    string public name = "Dex";
    address internal constant UNISWAP_V2_ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    IUniswapV2Router02 public uniswapRouter;
    address internal constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    constructor() public payable {
        uniswapRouter = IUniswapV2Router02(UNISWAP_V2_ROUTER);
    }

    function swapEthForUSDC(uint256 ethAmount) external payable {
        // deadline: unix timestamp after which the transaction will revert
        uint256 deadline = block.timestamp + 150;
        address[] memory path = getEthForUSDCPath();
        uint256 amountOutMin = uniswapRouter.getAmountsOut(ethAmount, path)[1];
        uniswapRouter.swapExactETHForTokens{value: msg.value}(amountOutMin, path, msg.sender, deadline);
    }

    function swapUSDCForEth(uint256 tokenAmount) external {
        uint256 deadline = block.timestamp + 150;
        address[] memory path = getUSDCForEthPath();
        uint256 amountOutMin = uniswapRouter.getAmountsOut(tokenAmount, path)[1];

        // send tokens to this contract
        IERC20(USDC).transferFrom(msg.sender, address(this), tokenAmount);

        // allow this contract to spend the tokens
        IERC20(USDC).approve(UNISWAP_V2_ROUTER, tokenAmount);
        uniswapRouter.swapExactTokensForETH(tokenAmount, amountOutMin, path, msg.sender, deadline);
    }

    function getEthForUSDCPath() private view returns (address[] memory) {
        address[] memory path = new address[](2);
        // path is required by uniswap router
        path[0] = uniswapRouter.WETH();
        path[1] = USDC;

        return path;
    }

    function getUSDCForEthPath() private view returns (address[] memory) {
        address[] memory path = new address[](2);
        path[0] = USDC;
        path[1] = uniswapRouter.WETH();

        return path;
    }
}
