// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./ERC20.sol";

contract MessiToken is ERC20 {
    IERC20 private usdcToken; // Adresse du contrat USDC

    struct Stake {
        uint256 amount;
        uint256 endTimestamp;
    }

    mapping(address => Stake) private stakedBalances;

    event TokensBought(address indexed buyer, uint256 amount);
    event TokensSold(address indexed seller, uint256 amount);
    event TokensStaked(
        address indexed staker,
        uint256 amount,
        uint256 endTimestamp
    );
    event TokensUnstaked(address indexed unstaker, uint256 amount);

    constructor(address _usdcToken) ERC20("Messi Token", "MESSI") {
        usdcToken = IERC20(_usdcToken);
        _mint(msg.sender, 1000000 * (10 ** decimals()));
    }

    function buy(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        _transfer(address(this), msg.sender, amount);
        emit TokensBought(msg.sender, amount);
    }

    function buy(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        usdcToken.transferFrom(msg.sender, address(this), amount); // Transfert des USDC du compte de l'acheteur vers le contrat
        _mint(msg.sender, amount); // Création des tokens Messi correspondants
    }
    
    function sell(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _transfer(msg.sender, address(this), amount);
        emit TokensSold(msg.sender, amount);
    }

    function stake(uint256 amount, uint256 stakingPeriod) external {
        require(amount > 0, "Amount must be greater than zero");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(stakedBalances[msg.sender].amount == 0, "Already staking");

        _transfer(msg.sender, address(this), amount);
        stakedBalances[msg.sender] = Stake(
            amount,
            block.timestamp + stakingPeriod
        );
        emit TokensStaked(
            msg.sender,
            amount,
            stakedBalances[msg.sender].endTimestamp
        );
    }

    function unstake() external {
        Stake storage stake = stakedBalances[msg.sender];
        require(stake.amount > 0, "Not staking");
        require(
            block.timestamp >= stake.endTimestamp,
            "Staking period not completed"
        );

        _transfer(address(this), msg.sender, stake.amount);
        delete stakedBalances[msg.sender];
        emit TokensUnstaked(msg.sender, stake.amount);
    }

    function getStakedBalance(address account) public view returns (uint256) {
        return stakedBalances[account].amount;
    }

    function getStakingEndTimestamp(
        address account
    ) public view returns (uint256) {
        return stakedBalances[account].endTimestamp;
    }
}
