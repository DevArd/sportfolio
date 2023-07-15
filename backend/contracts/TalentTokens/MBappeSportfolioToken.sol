// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../SportfolioTalentToken.sol";

contract MBappeSportfolioToken is SportfolioTalentToken {

    constructor() SportfolioTalentToken(
        "Messi Sportfolio Token",
        "MESSI",
        100000000 * 10 ** decimals(),
        1000000000 * 10 ** decimals()
    ) {

    }

}
