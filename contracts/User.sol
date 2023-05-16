// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

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
contract User{

    /* 
        La UserStruct definisce:
            balance: soldi dell'utente
            platforms: array di tutte le piattaforme associate all'utente
     */

    struct PlatformStruct{
        string platformName;
        bool isValid;
    }

    struct UserStruct{
        uint balance;
        /* passo un intero e restituisce true/false */
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
        return (userData[userAddress].platforms[idPlatform].isValid, userData[userAddress].platforms[idPlatform].platformName);
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
    function addUser(address userAddress) public {
        userData[userAddress].balance = 100;
    }

    function getUserData(address userAddress) public view returns(address userAdd, uint balance){    
        return (userAddress, userData[userAddress].balance);
    }

}