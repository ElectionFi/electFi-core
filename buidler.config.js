usePlugin("@nomiclabs/buidler-waffle");

const fs = require("fs");
const mnemonic = fs.readFileSync(".secret").toString().trim();
require("dotenv").config();

// This is a sample Buidler task. To learn how to create your own go to
// https://buidler.dev/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.getAddress());
  }
});

// You have to export an object to set up your config
// This object can have the following optional entries:
// defaultNetwork, networks, solc, and paths.
// Go to https://buidler.dev/config/ to learn more
module.exports = {
  // This is a sample solc configuration that specifies which version of solc to use
  networks: {
    kovan: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_ID}`,
      chainId: 42,
      accounts: { mnemonic },
      gasPrice: "auto"
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`,
      chainId: 1,
      accounts: { mnemonic },
      gasPrice: "auto"
    },
  },
  solc: {
    version: "0.5.16",
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
};
