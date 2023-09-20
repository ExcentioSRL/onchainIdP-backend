// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

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
    /* ------------- INIZIO EVENTI PER DEBUG ------------ */
    event CheckNumber(uint number);
    
    event CheckString(string response);

    event CheckUser(address indirizzo, uint numeroPiattaforme);
    
    event CheckPlatform(uint uuid, bool isValid);

    event CheckValue(uint key, bool isValid);

    event CheckRent(RentalStruct r);

    event CheckBooleanValue(bool b);

    event CheckRentKey(uint key, bool valid);
      
    /* ------------- FINE EVENTI PER DEBUG ------------ */


    /* -------------- INIZIO  VARIABILI -------------- */
    Excentio private tokenExc;

    struct KeyStruct{
        uint key;
        bool valid;
    }

    struct PlatformStruct{
        string uuid;
        bool isValid;
        uint cost; // costo ora, in exc
    }
  
    struct RentalStruct{
        string transactionId;
        address renter; /* chi cede il suo account */
        address hirer; /* chi noleggia l'account di un altro */
        uint start;
        uint end;
        uint amount;
        string platformId;
        uint timestamp;
    }

    struct UserData{
        address userAddr;
        uint platformNumber;
        uint rentalsNumber;
        uint allRentalsNumber;
        mapping(uint => PlatformStruct) platforms;
        mapping(string => KeyStruct) platformsKey;
        mapping(uint => RentalStruct[]) rentals;
        mapping(uint => KeyStruct) rentalsKey;
    }

    struct GlobalUserData{
        address userAddr;
        PlatformStruct[] platforms;
    }

    struct PrivateUserData{
        address userAddr;
        PlatformStruct[] platforms;
        RentalStruct[] rentals;
    }
   

    /* userData è un'array dinamico di utenti che restituisce i dati di ogni utente presente nell'array */
    mapping (uint => UserData) userData;

    mapping(address => KeyStruct) usersKey;
   
    mapping(address => KeyStruct) rentalsKey;

    /* tiene traccia del numero di utenti e del numero di noleggi */
    uint private userNumber;
 

    /*  cap e reward servono per il token */
    constructor(uint cap, uint reward) {
        tokenExc = new Excentio(cap,reward);
        userNumber = 0;
    }
    
    /* -------------- FINE VARIABILI -------------- */

    /* ------------------ INIZIO PARTE CONTRATTO ------------------ */

    function buy() payable public {
      
        uint256 amountTobuy = msg.value;
      
        uint256 excBalance = tokenExc.balanceOf(address(this));
        require(amountTobuy > 0, "You need to send some excentio");
        require(amountTobuy <= excBalance, "Not enough tokens in the reserve");

        tokenExc.transfer(msg.sender, amountTobuy);

    }

    function sell(uint256 amount) public {
        require(amount > 0, "Devi vendere almeno qualche token");
    
        uint256 allowance = tokenExc.allowance(msg.sender, address(this));
        require(allowance >= amount, "Fondi insufficienti");
        tokenExc.transferFrom(msg.sender, address(this), amount);
        payable(msg.sender).transfer(amount);
    }

    function getToken() public view returns(Excentio){
        return tokenExc;
    }
    
    /* ------------------ FINE PARTE CONTRATTO ------------------ */

    
    /* ------------------ INIZIO PARTE USER ------------------ */

    function checkUserExist(address userAddress) internal view returns (bool){
        return usersKey[userAddress].valid;
    }

    /* restituisce la chiave dell'utente */
    function getUserKey(address userAddress) internal view returns (uint){
        return usersKey[userAddress].key;
    }

    function getPlatformValidity(uint userNumberInput, string memory idPlatform) internal view returns ( bool){
       return userData[userNumberInput].platformsKey[idPlatform].valid;   
    }

    /*  
        Questa funzione serve a controllare che l'utente abbia l'id della piattaforma nell'"array" 
        delle piattaforme associate 
    */
    function checkUserPlatform(address userAddress, string memory idPlatform) public view returns (bool){
        uint userNumberInput = getUserKey(userAddress);
        return getPlatformValidity(userNumberInput, idPlatform);
    }

    /* Aggiunge l'id di una piattaforma all'array delle piattaforme dell'utente */
    function addPlatformToUser(address userAddress, string memory idPlatform, uint platformCost) public returns (bool, string memory){
        require(userAddress != address(0), "l'utente non puo' avere indirizzo 0");
        
        uint userNumberInput = getUserKey(userAddress);

        require(userAddress == userData[userNumberInput].userAddr, "l'indirizzo dello user passato non corrisponde a quello salvato");

        require(userData[userNumberInput].platformsKey[idPlatform].valid == false, "piattaforma gia' aggiunta");
        
        uint platformNumber = userData[userNumberInput].platformNumber;
        
        userData[userNumberInput].platformsKey[idPlatform].key = platformNumber;
        userData[userNumberInput].platformsKey[idPlatform].valid = true;

        userData[userNumberInput].platforms[platformNumber].uuid = idPlatform;
        userData[userNumberInput].platforms[platformNumber].isValid = true;
        userData[userNumberInput].platforms[platformNumber].cost = platformCost;
        userData[userNumberInput].platformNumber++;

        return (true,"piattaforma aggiunta");    

    }

    /* Aggiunge un utente alla mappa di utenti */
    function addUser(address userAddress) public {
        require(userAddress != address(0), "l'utente non puo' avere indirizzo 0");
        require(usersKey[userAddress].valid == false, "l'utente e' gia' presente");

        usersKey[userAddress].key = userNumber;
        usersKey[userAddress].valid = true;

        userData[userNumber].userAddr = userAddress;
        userData[userNumber].platformNumber = 0;
        userData[userNumber].rentalsNumber = 0;
        userData[userNumber].allRentalsNumber = 0;
        userNumber++;
    }

    function getPrivateUserData() public view returns(PrivateUserData[] memory){ 
        PrivateUserData[] memory result = new PrivateUserData[](userNumber);

		for (uint index = 0; index < userNumber; index++) {
		        result[index].platforms = new PlatformStruct[](userData[index].platformNumber);
				result[index].userAddr = userData[index].userAddr;
                result[0].rentals = new RentalStruct[](userData[index].allRentalsNumber);
      
                for(uint i = 0; i < userData[index].platformNumber; i++){
                    result[index].platforms[i] = userData[index].platforms[i];
                }
               
                uint j = 0;
                for(uint i = 0; i < userData[index].rentalsNumber; i++){
                    uint totRent = userData[index].rentals[i].length;
                    for(uint k = 0; k < totRent; k++){
                        result[0].rentals[j] = userData[index].rentals[i][k];
                        j++;
                    }
                }
		}

		return result;
    }
   
    function getPrivateUserDataById(address user) public view returns(PrivateUserData[] memory){ 
        PrivateUserData[] memory result = new PrivateUserData[](1);
        
        uint index = getUserKey(user);
		
		result[0].platforms = new PlatformStruct[](userData[index].platformNumber);
		result[0].userAddr = userData[index].userAddr;
        result[0].rentals = new RentalStruct[](userData[index].allRentalsNumber);


        for(uint i = 0; i < userData[index].platformNumber; i++){
            result[0].platforms[i] = userData[index].platforms[i];
        }
                     
        uint j = 0;
        for(uint i = 0; i < userData[index].rentalsNumber; i++){
            uint totRent = userData[index].rentals[i].length;
            for(uint k = 0; k < totRent; k++){
                result[0].rentals[j] = userData[index].rentals[i][k];
                j++;
            }
        }
        
		return result;
    }

    /* ------------------ FINE PARTE USER ------------------ */

    /* ------------------ INIZIO PARTE NOLEGGIO ------------------ */

     function isSlotBusy (uint time, uint sd, uint ed) internal pure returns(bool){
        if (time >= sd){
            if(time <= ed)
                return true;
            else
                return false;     
        }
        else return false;
    }

   function checkRent(uint timestamp, uint time, address userAddress, string memory platformId) public view returns(bool){
        uint userKey = getUserKey(userAddress);

        //renter 0
        //hirer: 1
        uint userType = 1;

        if(checkUserPlatform(userAddress, platformId) == true)
            userType = 0;

        if(userData[userKey].rentalsKey[timestamp].valid == false){
            if(userType == 0)
                return true;
            else return false;
        }
        
        uint rentalKey = userData[userKey].rentalsKey[timestamp].key;

        uint length = userData[userKey].rentals[rentalKey].length;

        RentalStruct memory rent;
        for(uint i = 0; i < length; i++){
                if(userData[userKey].rentals[rentalKey][i].start <= time && 
                    userData[userKey].rentals[rentalKey][i].end >= time && 
                    keccak256(abi.encodePacked(userData[userKey].rentals[rentalKey][i].platformId)) == keccak256(abi.encodePacked(platformId)) )
                        rent = userData[userKey].rentals[rentalKey][i];
        }

        if(userType == 0){
            // controllo che il renter, chi cede l'account, sia effettivamente lui
            // dopodiché controllo che lo slot è occupato, 
            // se è occupato lancio l'eccezione atrimenti restituisce true per indicare che il proprietario della piattaforma
            // può accedere
            if(rent.renter == userAddress){
                bool value = isSlotBusy(time, rent.start, rent.end);
                require(value == false, "Al momento il tuo account e' noleggiato, non puoi accederci");
                return true; 
            }
            else return true;
        }
        else {
            //ritorna true, vuol dire che il noleggio è iniziato
            if(rent.hirer == userAddress)
                return true;
            else return false;
        }

    }

    function isSlotAvailable (uint isd, uint ied, uint sd, uint ed) internal pure returns(bool){
        if (isd >= sd && isd <= ed)
            return false;
        if (ied >= sd && ied <= ed)
            return false;
        if (isd <= sd && ed <= ied)
            return false;

        return true;
    }

    function isRentValid(RentalStruct memory newRent, uint timestamp, uint userKey) internal view returns(bool){
        uint rentKey = userData[userKey].rentalsKey[timestamp].key;

        uint length = userData[userKey].rentals[rentKey].length;

        for(uint i = 0; i < length; i++){
            RentalStruct memory rent = userData[userKey].rentals[rentKey][i];
            bool available = isSlotAvailable(newRent.start, newRent.end, rent.start, rent.end);
            if(available == false)
                return false;
        }

        return true;
    }

    function addRentToUser(RentalStruct memory newRent, uint timestamp, uint userKey)  internal {
      
        if(userData[userKey].rentalsKey[timestamp].valid == false){
            userData[userKey].rentalsKey[timestamp].key = userData[userKey].rentalsNumber;
            userData[userKey].rentalsKey[timestamp].valid = true;
            userData[userKey].rentalsNumber++;
        }

        userData[userKey].rentals[userData[userKey].rentalsKey[timestamp].key].push(newRent);
        userData[userKey].allRentalsNumber++;
       
    }

    function addRent(string memory transactionId, address renter, address hirer, uint startDate, uint endDate, uint amount, string memory platformId, uint timestamp) public   {
        require(checkUserExist(renter) == true, "L'utente non esiste");
        require(checkUserExist(hirer) == true, "Non esisti, devi prima aggiungerti");
        require(endDate > startDate,"La data di fine noleggio e' prima dell'inizio del noleggio");
        require(checkUserPlatform(renter,platformId) == true, "Piattaforma non associata all'utente");
        require(checkUserPlatform(hirer,platformId) == false, "Non puoi noleggiare un account di una piattaforma che hai");
        require(renter != hirer, "Non puoi noleggiare da te stesso");
        
        uint renterKey = getUserKey(renter);
        uint hirerKey = getUserKey(hirer);
        require(renter == userData[renterKey].userAddr, "l'indirizzo dello user passato non corrisponde a quello salvato");
        require(hirer == userData[hirerKey].userAddr, "l'indirizzo dello user passato non corrisponde a quello salvato");

        RentalStruct memory newRent = RentalStruct({
            transactionId: transactionId,
            renter: renter, 
            hirer: hirer, 
            start: startDate,
            end: endDate,
            amount: amount,
            platformId: platformId,
            timestamp: timestamp
        });

        bool validRenter = isRentValid(newRent, timestamp, renterKey);
        bool validHirer = isRentValid(newRent, timestamp, hirerKey);
        
        require(validRenter == true, "Non e' possibile effettuare il noleggio");
        require(validHirer == true, "Non e' possibile effettuare il noleggio");
        
        require(tokenExc.balanceOf(hirer) >= amount, "La tua balance non copre il costo del noleggio");
        bool result = tokenExc.transferFrom(hirer,renter, amount);
        require(result == true, "Trasferimento fondi non andato a buon fine, il noleggio non e' stato approvato");

        addRentToUser(newRent, timestamp, renterKey);
        addRentToUser(newRent, timestamp, hirerKey);

    }

    /* ------------------ FINE PARTE NOLEGGIO ------------------ */

}