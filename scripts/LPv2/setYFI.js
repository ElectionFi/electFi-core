//CHANGE TO PROD ADDRESSES
const addresses = require('./addresses.kovan.json')

async function main() {
  // We get the contract to deploy
  const [sender] = await ethers.getSigners()
  
  const BYearn = require('../../artifacts/BidenYearnLPRewards.json')
  const byearn = new ethers.Contract(addresses.byearn, BYearn.abi, sender)

  const TYearn = require('../../artifacts/TrumpYearnLPRewards.json')
  const tyearn = new ethers.Contract(addresses.tyearn, TYearn.abi, sender)

  await byearn.setYFI(addresses.biden, addresses.bidenLP, addresses.trump, addresses.trumpLP, tyearn.address)
  await tyearn.setYFI(addresses.trump, addresses.trumpLP, addresses.biden, addresses.bidenLP, byearn.address)

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });