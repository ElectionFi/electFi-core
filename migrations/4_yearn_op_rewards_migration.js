const Biden = artifacts.require("TrumpYearnLPRewards");
const Trump = artifacts.require("BidenYearnLPRewards");

module.exports = function (deployer) {
  deployer.deploy(Biden);
  deployer.deploy(Trump);
};
