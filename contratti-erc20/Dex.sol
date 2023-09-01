// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "./Token.sol";

contract DEX {

    Token public token;

    event Bought(uint256 amount);
    event Sold(uint256 amount);
    event CheckMsgSender(address indirizzoMsgSender);
    
    
    constructor() {
        token = new Token();
    }

    function buy() payable public {
      
        uint256 amountTobuy = msg.value;
      
        uint256 dexBalance = token.balanceOf(address(this));
        require(amountTobuy > 0, "You need to send some ether");
        require(amountTobuy <= dexBalance, "Not enough tokens in the reserve");

        token.transfer(msg.sender, amountTobuy);

    }

    function sell(uint256 amount, address to) public {
        require(amount > 0, "Devi vendere almeno qualche token");
        emit CheckMsgSender(msg.sender);
        uint256 allowance = token.allowance(msg.sender, address(this));
        require(allowance >= amount, "Verifica l'indennita' del token");
        token.transferFrom(msg.sender, to, amount);
        // payable(msg.sender).transfer(amount);
        emit Sold(amount);
    }

    function balance(address account) public view returns(uint){
        return token.balanceOf(account);
    }

}
