// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Excentio is ERC20{
    constructor() ERC20("Excentio", "EXC") {
        _mint(msg.sender, 10000 * 10 ** decimals());
    }
}