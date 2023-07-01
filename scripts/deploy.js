// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const exc = await hre.ethers.deployContract("Excentio", [10000000, 50]);

  await exc.waitForDeployment();
  const address = await exc.getAddress();
  console.log(`EXC deployed at ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});