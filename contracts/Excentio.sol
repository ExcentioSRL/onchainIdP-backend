// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";


contract Excentio is ERC20Capped, ERC20Burnable {
    address payable public owner;
    uint256 public blockReward;


    constructor(uint256 cap, uint256 reward) ERC20("Excentio", "EXC") ERC20Capped(cap * (10 ** decimals())) {
        owner = payable(msg.sender);
        _mint(owner, 7_000_000 * (10 ** decimals()));
        setBlockReward(reward);
    }

    /* 
        _mint: è il blocco fondamentale che consente di scrivere estensioni ERC20 che implementano un meccanismo di fornitura.

        Questo metodo viene riscritto perché ERC20Capped e ERC20Burnable hanno entrambi il metodo _mint.
        Causa quindi un errore di duplicazione del metodo. Faccio override del metodo nel contratto ERC20Capped 
        per poter controllare che non ecceda il limite
    */
    function _mint(address account, uint256 amount) internal virtual override(ERC20Capped, ERC20){
        /* 
            aggiunge alla totalSupply, cioè il totale dei token già presenti, un amount incrementando così la disponibilità del token
            poi controlla che non abbia ecceduto il limite(cap)
         */
        require(ERC20.totalSupply() + amount <= cap(), "ERC20Capped: cap exceeded");
        super._mint(account, amount);
    }

    /* 
        block.coinbase: variabile globale, accede all'indirizzo del minatore del blocco corrente 
        Creeremo una ricompensa in token per questo indirizzo quando il metodo verrà chiamato in beforeTokenTransfer
    */
    function _mintMinerReward() internal {
        _mint(block.coinbase, blockReward);
    }

    /*
        _beforeTokenTransfer: è un hook che viene chiamato prima di qualsiasi trasferimento di token
        Utilizziamo questo hook per creare una ricompensa per i minatori per ogni trasferimento di token che viene incluso nella blockchain,
        compreso creazione (_mint) e distruzione 
     */
    function _beforeTokenTransfer(address from, address to, uint256 value) internal virtual override {
        if(from != address(0) && to != block.coinbase && block.coinbase != address(0))
            _mintMinerReward();

        super._beforeTokenTransfer(from,to,value);
    }

    /* Setta la ricompensa da dare al miner del blocco */
    function setBlockReward(uint256 reward) public onlyOwner {
        blockReward = reward * (10 ** decimals());
    }

    modifier onlyOwner{
        require(msg.sender == owner, "Only the owner can call this functin");
        _; //significa che deve prima leggere la linea sopra e poi il resto della funzione, viene applicato come "guard"
    }
}
