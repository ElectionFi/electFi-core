//CHANGE TO PROD ADDRESSES
const addresses = require('./addresses.kovan.json')

async function main() {
  // We get the contract to deploy
  const [sender] = await ethers.getSigners()
  const senderAddress = await sender.getAddress()
  const BYearn = await ethers.getContractFactory("BidenYearnLPRewards");
  byearn = await BYearn.deploy();
  await byearn.deployed();

  const TYearn = await ethers.getContractFactory("TrumpYearnLPRewards");
  tyearn = await TYearn.deploy();
  await tyearn.deployed();
  
  console.log(`biden Yearn address ${byearn.address}`)
  console.log(`trump Yearn address ${tyearn.address}`)

  await byearn.setRewardDistribution(senderAddress)
  await tyearn.setRewardDistribution(senderAddress)

  await byearn.setYFI(addresses.biden, addresses.bidenLP, addresses.trump, addresses.trumpLP, tyearn.address)
  await tyearn.setYFI(addresses.trump, addresses.trumpLP, addresses.biden, addresses.bidenLP, byearn.address)

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });