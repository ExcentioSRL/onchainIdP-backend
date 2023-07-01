require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhatNet: {
      url: "HTTP://127.0.0.1:8545",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 31337,
    },
  },
};
