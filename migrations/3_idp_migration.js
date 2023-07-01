var Idp = artifacts.require("./Idp.sol");
var Excentio = artifacts.require("./Excentio.sol");

module.exports = function (deployer) {
    //   prima faccio il deploy del token poi passo al costruttore dell'idp l'indirizzo del contratto del token
    deployer.deploy(Excentio).then(() => {
        return deployer.deploy(Idp, Excentio.address);
    });
};

// module.exports = function (deployer) {
//     deployer.deploy(Idp3, "0x94b01Cd1cD69b9213B7b6401f53B2fbabC05075B");
// };
