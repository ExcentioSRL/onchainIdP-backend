// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    event CheckUser(address indirizzo);

    address private owner;

    constructor() ERC20("Excentio", "EXC") {
        _mint(msg.sender, 7_000_000 * (10 ** decimals()));
        emit CheckUser(msg.sender);
        owner = msg.sender;
    }

    function getOwner() public view returns(address){
        return owner;
    }

    function whoAmI() public view returns(address){
        return msg.sender;
    }


}