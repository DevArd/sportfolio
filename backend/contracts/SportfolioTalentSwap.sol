// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC20.sol";

contract SportfolioTalentSwap {
    IERC20 public talentToken;
    IERC20 public usdcToken;
    uint256 private constant FEE_PERCENTAGE = 2;
    address private owner;

    event TokensPurchased(address indexed buyer, uint256 amount, uint256 cost);
    event TokensSold(address indexed seller, uint256 amount, uint256 reward);

    constructor(address _talentToken, address _usdcToken) {
        talentToken = IERC20(_talentToken);
        usdcToken = IERC20(_usdcToken);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function."
        );
        _;
    }

    function buyTokens(uint256 amount) external {
        uint256 usdcAmount = (amount * 10 ** usdcToken.decimals()) / 100;
        uint256 feeAmount = (usdcAmount * FEE_PERCENTAGE) / 100;
        uint256 netAmount = usdcAmount - feeAmount;

        require(
            usdcToken.balanceOf(msg.sender) >= usdcAmount,
            "Insufficient USDC balance"
        );

        usdcToken.transferFrom(msg.sender, address(this), usdcAmount);
        talentToken.transfer(msg.sender, amount);

        emit TokensPurchased(msg.sender, amount, netAmount);
    }

    function sellTokens(uint256 amount) external {
        uint256 usdcAmount = (amount * 10 ** usdcToken.decimals()) / 100;
        uint256 feeAmount = (usdcAmount * FEE_PERCENTAGE) / 100;
        uint256 netAmount = usdcAmount - feeAmount;

        require(
            talentToken.balanceOf(msg.sender) >= amount,
            "Insufficient talent token balance"
        );

        talentToken.transferFrom(msg.sender, address(this), amount);
        usdcToken.transfer(msg.sender, netAmount);

        emit TokensSold(msg.sender, amount, netAmount);
    }

    function withdrawFees() external onlyOwner {
        uint256 balance = usdcToken.balanceOf(address(this));
        require(balance > 0, "No fees to withdraw");

        usdcToken.transfer(owner, balance);
    }
}
