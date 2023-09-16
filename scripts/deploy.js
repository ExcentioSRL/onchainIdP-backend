// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat');

async function main() {
    /* deploy idp */
    const exc = await ethers.getContractFactory('Excentio');
    const idp = await hre.ethers.deployContract('Idp', [10000000, 50]);
    await idp.waitForDeployment();
    const addressIdp = await idp.getAddress();

    const addressExc = await idp.getToken();

    console.log(`Idp deployed at: ${addressIdp}`);
    console.log(`EXC deployed at ${addressExc}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
