// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../SportfolioTalentToken.sol";

contract MessiSportfolioToken is SportfolioTalentToken {

    constructor() SportfolioTalentToken(
        "Messi Sportfolio Token",
        "MESSI",
        100000000 * 10 ** decimals(),
        1000000000 * 10 ** decimals()
    ) {

    }

}
