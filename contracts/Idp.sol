// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


import "./Excentio.sol";

/*
    Questo contratto è per l'utente:
    1.  se l’indirizzo pubblico dell’utente è associato all’id della piattaforma 
        il backend produrrà subito un jwt e farà il reindirizzamento alla piattaforma.
    2.  se l’indirizzo pubblico dell’utente non è associato all’id della piattaforma.
        In questo caso verrà eseguita una call che aggiornerà il contratto associando 
        l’id della piattaforma all’indirizzo pubblico dell’utente. Se la call:
            – dovesse dare esito positivo verrà mostrato a schermo un popup con la conferma di "associazione", 
              dopodichè il backend produrrà un jwt e farà il reindirizzamento alla piattaforma.
            – non dovesse dare esito positivo verrà mostrato a schermo un popup di errore
*/
contract Idp {

    Excentio public tokenExc;

    // receive address during deployment script
    constructor(Excentio tokenExcImport) {
        tokenExc = tokenExcImport;
    }

    /* ------------------ INIZIO PARTE USER ------------------ */

    struct PlatformStruct{
        string platformName;
        bool isValid;
    }

    /* 
        La UserStruct definisce:
            balance: soldi dell'utente
            platforms: array di tutte le piattaforme associate all'utente
     */
    struct UserStruct{
        address userAddr;
        uint balance;
        mapping(uint => PlatformStruct) platforms;
    }

    /* userData è un'array dinamico di utenti che restituisce la balance di ogni utente presente nell'array */
    mapping (address => UserStruct) userData;

    /* Questa funzione serve a controllare che chi nolegga l'account dell'altra persona abbia abbastanza soldi */
     function checkUserBalance(address addressInput, uint amount) public view returns (bool){
         if(userData[addressInput].balance < amount) return false;

         return true;
     }
    
    /*  
        Questa funzione serve a controllare che l'utente abbia l'id della piattaforma nell'"array" 
        delle piattaforme associate 
    */
    function checkUserPlatform(address userAddress, uint idPlatform) public view returns (bool, string memory){
        return (userData[userAddress].platforms[idPlatform].isValid,userData[userAddress].platforms[idPlatform].platformName);
    }

    /* Aggiunge l'id di una piattaforma all'array delle piattaforme dell'utente */
    function addPlatformToUser(address userAddress, uint idPlatform, string memory platformName) public returns (bool){
        if(userData[userAddress].platforms[idPlatform].isValid == false){
            userData[userAddress].platforms[idPlatform].platformName = platformName;
            userData[userAddress].platforms[idPlatform].isValid = true;
            return true;
        }
        else return false;
    }

    /* Aggiunge un utente alla mappa di utenti */
    function addUser(address userAddress, uint balance) public {
        userData[userAddress].userAddr = userAddress;
        userData[userAddress].balance = balance;
    }

    /* Ritorna user address e balance */
    function getUserData(address userAddress) public view returns(address userAddr, uint balance){ 
        return  (userData[userAddress].userAddr, userData[userAddress].balance);
    }

    /* ------------------ FINE PARTE USER ------------------ */

    /* ------------------ INIZIO PARTE NOLEGGIO ------------------ */

    //userRentAddress: rappresenta l'indirizzo dell'utente che darà a noleggio il suo account
    //userDestAddress: rappresenta l'indirizzo dell'utente che noleggerà l'account di userRentAddress
    // function rentAccount(address userRentAddress, address userDestAddress, uint rentalEndDatetime, uint cost) public view {
    //     tokenExc.balanceOf(userDestAddress);
    // }

    function testName() public view returns (string memory){
        return tokenExc.name();
    }

    function testBalance(address userDestAddress) public view returns (uint256 ){
        return tokenExc.balanceOf(userDestAddress);
    }

    function testTransfer(address from, address to, uint256 amount) public returns (bool){
        return tokenExc.transferFrom(from, to, amount);
    }

    function allowanceTest(address owner, address spender) public view returns (uint){
        return tokenExc.allowance(owner, spender);
    }

    function increaseAllowanceTest(address spender, uint256 amount) public returns (bool){
        return tokenExc.increaseAllowance(spender,amount);
    }
 
    function approveTest( address spender, uint256 amount) public returns (bool){
        return tokenExc.approve(spender, amount);
    }

    function totalSupply() public view returns (uint256) {
        return tokenExc.totalSupply();
    }

    /* ------------------ FINE PARTE NOLEGGIO ------------------ */

}