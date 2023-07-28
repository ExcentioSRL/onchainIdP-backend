const { expect } = require("chai");
const hre = require("hardhat");
require("@nomicfoundation/hardhat-ethers");

describe("Excentio contract", function () {
  // global vars
  let Token;
  let excentioToken;
  let Idp;
  let idpContract;
  let owner;
  let addr1;
  let addr2;
  let tokenCap = 10000000;
  let tokenBlockReward = 50;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("Excentio");
    [owner, addr1, addr2] = await hre.ethers.getSigners();

    excentioToken = await Token.deploy(tokenCap, tokenBlockReward);
  });

  describe("Idp transactions", function () {
    this.beforeEach(async function () {
      Idp = await ethers.getContractFactory("Idp");
      idpContract = await Idp.deploy(await excentioToken.getAddress());
    });

    it("transfer 10 tokens from owner to another account using transferFrom", async () => {
      await excentioToken.approve(
        await idpContract.getAddress(),
        await excentioToken.balanceOf(owner.address)
      );

      const amount = 10;
      const tokensAmount = hre.ethers.parseUnits(amount.toString(), 18);

      await idpContract.approva(addr1.address, tokensAmount);

      await idpContract
        .connect(addr1)
        .transferFrom(owner.address, addr1.address, tokensAmount);

      let addr1Balance = Number(
        hre.ethers.formatEther(await idpContract.balance(addr1.address))
      );
      expect(addr1Balance).to.equal(10);

      const amount2 = 5;
      const tokensAmount2 = hre.ethers.parseUnits(amount2.toString(), 18);

      await idpContract
        .connect(addr1)
        .transferFrom(addr1.address, addr2.address, tokensAmount2);

      let addr2Balance = Number(
        hre.ethers.formatEther(await idpContract.balance(addr2.address))
      );
      expect(addr2Balance).to.equal(5);
    });
  });
});
