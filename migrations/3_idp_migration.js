var Idp = artifacts.require("./Idp.sol");
var Excentio = artifacts.require("./Excentio.sol");

// module.exports = function (deployer) {
//   // prima faccio il deploy del token poi passo al costruttore dell'idp l'indirizzo del contratto del token
//   deployer.deploy(Excentio).then(() => {
//     return deployer.deploy(Idp, Excentio.address);
//   });
// };

module.exports = function (deployer) {
  deployer.deploy(Idp, "0x5A6CE8B59cD89B505681beB2Fa6ba6342ba474E6");
};
