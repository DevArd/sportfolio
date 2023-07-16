// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../SportfolioTalentToken.sol";

contract MBappeSportfolioToken is SportfolioTalentToken {

    constructor() SportfolioTalentToken(
        "MBappe Sportfolio Token",
        "MBAPPE",
        100000000 * 10 ** decimals(),
        1000000000 * 10 ** decimals()
    ) {

    }

}
