// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../SportfolioTalentToken.sol";

contract MessiSportfolioToken is SportfolioTalentToken {
    constructor()
        SportfolioTalentToken(
            "Messi Sportfolio Token",
            "MESSI",
            100_000 * 10 ** decimals(),
            1_000_000 * 10 ** decimals()
        )
    {}
}
