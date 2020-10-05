
const {
  BigNumber,
} = require('ethers');
const addresses = require('./addresses.kovan.json')

function expandTo18Decimals(n) {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(18))
}

async function main() {
  try {
    // We get the contract to deploy
    const [sender] = await ethers.getSigners()
    const senderAddress = await sender.getAddress()

    const BYearn = require('../../artifacts/BidenYearnLPRewards.json')
    const byearn = new ethers.Contract(addresses.byearn, BYearn.abi, sender)

    const TYearn = require('../../artifacts/TrumpYearnLPRewards.json')
    const tyearn = new ethers.Contract(addresses.tyearn, TYearn.abi, sender)

    const Biden = require('../../artifacts/Biden.json')
    const biden = new ethers.Contract(addresses.biden, Biden.abi, sender)

    const Trump = require('../../artifacts/Trump.json')
    const trump = new ethers.Contract(addresses.trump, Trump.abi, sender)

    console.log("Biden address", biden.address)
    console.log("Trump Address", trump.address)
    console.log("Biden Yearn address", byearn.address)
    console.log("Trump Yearn Address", tyearn.address)

    // Transfer tokesn
    const rewards = expandTo18Decimals(30000)
    // await biden.transfer(byearn.address, rewards)
    // await trump.transfer(tyearn.address, rewards)

    //set Rewards
    await byearn.notifyRewardAmount(rewards)
    await tyearn.notifyRewardAmount(rewards)
    console.log("set rewards amount")

  } catch (err) {
    console.log(err)
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });