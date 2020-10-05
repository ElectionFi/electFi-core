//CHANGE TO PROD ADDRESSES
const addresses = require('./addresses.kovan.json')
async function main() {
  // We get the contract to deploy
  const [sender] = await ethers.getSigners()
  const senderAddress = await sender.getAddress()

  const BYearn = require('../../artifacts/BidenYearnLPRewards.json')
  const byearn = new ethers.Contract(addresses.byearn, BYearn.abi, sender)

  const TYearn = require('../../artifacts/TrumpYearnLPRewards.json')
  const tyearn = new ethers.Contract(addresses.tyearn, TYearn.abi, sender)

  // const BYearn = await ethers.getContractFactory("BidenYearnLPRewards");
  // byearn = await BYearn.deploy();
  // await byearn.deployed();

  // const TYearn = await ethers.getContractFactory("TrumpYearnLPRewards");
  // tyearn = await TYearn.deploy();
  // await tyearn.deployed();

  // console.log(`biden Yearn address ${byearn.address}`)
  // console.log(`trump Yearn address ${tyeanrn.address}`)

  // await byearn.setRewardDistribution(senderAddress)
  // await tyearn.setRewardDistribution(senderAddress)
  const tyearnRewards = await tyearn.rewardPerToken()
  const byearnRewards = await byearn.rewardPerToken()
  const yfi = await tyearn.yfi()
  console.log(yfi)
  console.log(tyearnRewards)
  console.log(byearnRewards)
  
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });