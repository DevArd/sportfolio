// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../SportfolioTalentToken.sol";

contract MBappeSportfolioToken is SportfolioTalentToken {
    constructor()
        SportfolioTalentToken(
            "MBappe Sportfolio Token",
            "MBAPPE",
            100_000 * 10 ** decimals(),
            1_000_000 * 10 ** decimals()
        )
    {}
}
