// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract SportfolioTalentToken is ERC20, Ownable {
    using SafeMath for uint256;

    uint256 private _maxSupply;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply_,
        uint256 maxSupply_
    ) ERC20(name_, symbol_) {
        require(
            maxSupply_ > initialSupply_,
            "Max supply must be greater than initial supply"
        );
        _maxSupply = maxSupply_;
        _mint(msg.sender, initialSupply_);
    }

    function maxSupply() public view returns (uint256) {
        return _maxSupply;
    }

    function mint(address account, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= _maxSupply, "Exceeds maximum supply");
        _mint(account, amount);
    }
}
