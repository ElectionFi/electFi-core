
const {
  BigNumber,
} = require('ethers');
const addresses = require('../addresses.kovan.json')

function expandTo18Decimals(n) {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(18))
}

async function main() {
  try {
    // We get the contract to deploy
    const [sender] = await ethers.getSigners()
    const senderAddress = await sender.getAddress()
    
    const Biden = require('../../artifacts/Biden.json')
    const biden = new ethers.Contract(addresses.biden, Biden.abi, sender)

    const Trump = require('../../artifacts/Trump.json')
    const trump = new ethers.Contract(addresses.trump, Trump.abi, sender)

    console.log("Biden address", biden.address)
    console.log("Trump Address", trump.address)
    
    await trump.setGovernance("0x0000000000000000000000000000000000000000")
    await biden.setGovernance("0x0000000000000000000000000000000000000000")

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