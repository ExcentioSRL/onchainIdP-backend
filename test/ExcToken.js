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

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await excentioToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await excentioToken.balanceOf(owner.address);
      expect(await excentioToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the max capped supply to the argument provided during deployment", async function () {
      const cap = await excentioToken.cap();
      expect(Number(hre.ethers.formatEther(cap))).to.equal(tokenCap);
    });

    it("Should set the blockReward to the argument provided during deployment", async function () {
      const blockReward = await excentioToken.blockReward();
      expect(Number(hre.ethers.formatEther(blockReward))).to.equal(
        tokenBlockReward
      );
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      await excentioToken.transfer(addr1.address, 50);
      const addr1Balance = await excentioToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      await excentioToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await excentioToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await excentioToken.balanceOf(owner.address);
      // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(
        excentioToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed.
      expect(await excentioToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      // Transfer 100 tokens from owner to addr1.
      await excentioToken.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await excentioToken.transfer(addr2.address, 50);

      const addr1Balance = await excentioToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await excentioToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
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
        .connect(addr2)
        .transferFrom(addr1.address, addr2.address, tokensAmount2);

      let addr2Balance = Number(
        hre.ethers.formatEther(await idpContract.balance(addr2.address))
      );
      expect(addr2Balance).to.equal(5);
    });
  });
});
