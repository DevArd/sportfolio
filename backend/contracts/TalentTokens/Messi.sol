// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
;
import "../SportfolioTalentToken.sol";

contract SportfolioTalentToken is SportfolioToken {

    constructor() SportfolioToken(
        "Messi Sportfolio Token",
        "MESSI",
        200000 * 10 ** 18,
        1000000 * 10 ** 18
    ) {

    }

}
