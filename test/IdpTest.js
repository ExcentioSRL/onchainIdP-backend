const Idp = artifacts.require("Idp");

contract("Idp", (accounts) => {
  //   it("add user", async () => {
  //     const userInstance = await Idp.deployed();
  //     await userInstance.addUser(accounts[0], 100);
  //   });
  //   it("getUserBalance", async () => {
  //     const userInstance = await Idp.deployed();
  //     const u = await userInstance.getUserData(accounts[0]);
  //     console.log(u);
  //   });
  //   it("addPlatformToUser", async () => {
  //     const userInstance = await Idp.deployed();
  //     await userInstance.addPlatformToUser(accounts[0], 1, "netflix");
  //   });
  //   it("checkUserPlatform", async () => {
  //     const userInstance = await Idp.deployed();
  //     const u = await userInstance.checkUserPlatform(accounts[0], 1);
  //     console.log(u);
  //   });

  it("testBalanceAccount0", async () => {
    const idpInstance = await Idp.deployed();
    const balance = await idpInstance.testBalance(accounts[0]);
    console.log(balance.toString());
  });

  it("testBalanceAccount1", async () => {
    const idpInstance = await Idp.deployed();
    const balance = await idpInstance.testBalance(accounts[1]);
    console.log(balance.toString());
  });

  it("testTokenTransfer", async () => {
    const idpInstance = await Idp.deployed();
    const transfer = await idpInstance.testTransfer(accounts[0], accounts[1]);
    console.log(transfer);
  });
});
