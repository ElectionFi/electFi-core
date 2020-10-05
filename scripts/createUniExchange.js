
// javascript:  transact with deployed Uniswap Factory contract - createExchange

let Web3 = require("web3");
const Tx = require('ethereumjs-tx').Transaction
require("dotenv").config();

var abi = require('../build/contracts/UniswapV2Factory').abi;
let web3 = new Web3(new Web3.providers.HttpProvider(process.env.host))

// the account address that will send the test transaction
const ownerAddress = process.env.PublicKey
const privKey = process.env.PrivateKey

// the Uniswap factory contract address
const uniswapFactory = process.env.uniswapFactory

const contract = new web3.eth.Contract(abi, uniswapFactory);
const bidenAddress = process.env.bidenAddress
const trumpAddress = process.env.trumpAddress

const tx = contract.methods.createPair(trumpAddress, bidenAddress);

const encodedABI = tx.encodeABI();

function sendSigned(txData, cb) {
  const privateKey = new Buffer(privKey, 'hex')
  const transaction = new Tx(txData)
  transaction.sign(privateKey)
  const serializedTx = transaction.serialize().toString('hex')

  web3.eth.sendSignedTransaction('0x' + serializedTx, cb)
}
// get the number of transactions sent so far so we can create a fresh nonce
web3.eth.getTransactionCount(ownerAddress).then(txCount => {
  // construct the transaction data
  const txData = {
    nonce: web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(6000000),
    gasPrice: web3.utils.toHex(10000000000),
    to: uniswapFactory,
    from: ownerAddress,
    data: encodedABI
  }
  // fire away!
  sendSigned(txData, function(err, result) {
    if (err) return console.log('error', err)
    console.log('sent', result)
  })
}).catch(err => {
  console.log(err)
})
