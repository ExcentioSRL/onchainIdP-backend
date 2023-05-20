const User = artifacts.require("User");

contract("User", (accounts) => {
  it("add user", async () => {
    const userInstance = await User.deployed();

    await userInstance.addUser(accounts[0], 100);
  });

  it("getUserBalance", async () => {
    const userInstance = await User.deployed();

    const u = await userInstance.getUserData(accounts[0]);

    console.log(u);
  });

  it("addPlatformToUser", async () => {
    const userInstance = await User.deployed();

    await userInstance.addPlatformToUser(accounts[0], 1, "netflix");
  });

  it("checkUserPlatform", async () => {
    const userInstance = await User.deployed();

    const u = await userInstance.checkUserPlatform(accounts[0], 1);

    console.log(u);
  });
});
