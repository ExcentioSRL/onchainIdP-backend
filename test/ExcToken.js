const { expect } = require('chai');
const hre = require('hardhat');
require('@nomicfoundation/hardhat-ethers');

describe('Excentio contract', function () {
    // global vars

    let token;
    let tokenAddress;
    let idp;
    let idpAddress;
    let owner;
    let addr1;
    let addr2;
    let tokenCap = 10000000;
    let tokenBlockReward = 50;

    beforeEach(async function () {
        idp = await ethers.getContractFactory('Idp');
        token = await ethers.getContractFactory('Excentio');
        [addr1, addr2] = await hre.ethers.getSigners();

        idpAddress = await idp
            .connect(addr1)
            .deploy(tokenCap, tokenBlockReward);
        tokenAddress = token.attach(await idpAddress.getToken());
    });

    describe('Deployment', function () {
        it('Should set the right owner', async function () {
            expect(await tokenAddress.owner()).to.equal(
                await idpAddress.getAddress(),
            );
        });

        it('Should assign the total supply of tokens to the owner', async function () {
            const ownerBalance = await tokenAddress.balanceOf(
                await idpAddress.getAddress(),
            );
            expect(await tokenAddress.totalSupply()).to.equal(ownerBalance);
        });

        it('Should set the max capped supply to the argument provided during deployment', async function () {
            const cap = await tokenAddress.cap();
            expect(Number(hre.ethers.formatEther(cap))).to.equal(tokenCap);
        });

        it('Should set the blockReward to the argument provided during deployment', async function () {
            const blockReward = await tokenAddress.blockReward();
            expect(Number(hre.ethers.formatEther(blockReward))).to.equal(
                tokenBlockReward,
            );
        });
    });

    describe('Transactions', function () {
        it('Should transfer tokens between accounts', async function () {
            await idpAddress.transfer(addr1.address, 50);
            const addr1Balance = await tokenAddress.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(50);

            await idpAddress.connect(addr1).transfer(addr2.address, 50);
            const addr2Balance = await tokenAddress.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        });

        it("Should fail if sender doesn't have enough tokens", async function () {
            const initialOwnerBalance = await tokenAddress.balanceOf(
                await idpAddress.getAddress(),
            );
            // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
            // `require` will evaluate false and revert the transaction.
            await expect(
                tokenAddress
                    .connect(addr1)
                    .transfer(await idpAddress.getAddress(), 1),
            ).to.be.revertedWith('ERC20: transfer amount exceeds balance');

            // Owner balance shouldn't have changed.
            expect(
                await tokenAddress.balanceOf(await idpAddress.getAddress()),
            ).to.equal(initialOwnerBalance);
        });

        it('Should update balances after transfers', async function () {
            // Transfer 100 tokens from owner to addr1.
            await idpAddress.transfer(addr1.address, 100);

            // Transfer another 50 tokens from owner to addr2.
            await idpAddress.transfer(addr2.address, 50);

            const addr1Balance = await tokenAddress.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(100);

            const addr2Balance = await tokenAddress.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        });
    });

    describe('Idp transactions', function () {
        it('buy token from addr2', async function () {
            const tokensAmount = hre.ethers.parseUnits('1000', 18);

            // facendo connect il msg sender diventa l'addr2
            await idpAddress.connect(addr2).buy({ value: tokensAmount });

            let balanceAddr2 = await tokenAddress.balanceOf(addr2);
            expect(Number(hre.ethers.formatEther(balanceAddr2))).to.equal(1000);
        });

        it('sell token from addr2', async function () {
            const tokensAmount = hre.ethers.parseUnits('1000', 18);

            // facendo connect il msg sender diventa l'addr2
            await idpAddress.connect(addr2).buy({ value: tokensAmount });

            let postBuy2 = await tokenAddress.balanceOf(addr2);
            expect(Number(hre.ethers.formatEther(postBuy2))).to.equal(1000);

            await tokenAddress
                .connect(addr2)
                .approve(await idpAddress.getAddress(), tokensAmount);

            await idpAddress.connect(addr2).sell(tokensAmount);

            let balanceAddr2 = await tokenAddress.balanceOf(addr2);
            expect(Number(hre.ethers.formatEther(balanceAddr2))).to.equal(0);
        });

        it('transfer token from addr2 to addr1', async function () {
            const tokensAmount = hre.ethers.parseUnits('1000', 18);

            await idpAddress.connect(addr2).buy({ value: tokensAmount });

            let postBuy2 = await tokenAddress.balanceOf(addr2);
            expect(Number(hre.ethers.formatEther(postBuy2))).to.equal(1000);

            await tokenAddress
                .connect(addr2)
                .approve(await idpAddress.getAddress(), tokensAmount);

            await idpAddress
                .connect(addr2)
                .transferFrom(addr2.address, addr1.address, tokensAmount);

            let balanceAddr2 = await tokenAddress.balanceOf(addr2);
            expect(Number(hre.ethers.formatEther(balanceAddr2))).to.equal(0);

            let balanceAddr1 = await tokenAddress.balanceOf(addr1);
            expect(Number(hre.ethers.formatEther(balanceAddr1))).to.equal(1000);
        });
    });
});
