const Biden = artifacts.require("TrumpYearnRewards");
const Trump = artifacts.require("BidenYearnRewards");

module.exports = function (deployer) {
  deployer.deploy(Biden);
  deployer.deploy(Trump);
};
