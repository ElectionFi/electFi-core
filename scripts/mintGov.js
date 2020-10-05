// mint owner tokens

let Web3 = require("web3");
const Tx = require('ethereumjs-tx').Transaction
require("dotenv").config();

var abi = require('../build/contracts/Biden.json').abi;
let web3 = new Web3(new Web3.providers.HttpProvider(process.env.host))

// the address that will send the test transaction
const ownerAddress = process.env.PublicKey
const privKey = process.env.PrivateKey
const ETH = 10000000000;
const numTokens = 100000 * ETH
// the exchange contract address
const tokenAddress = '0x2F08fe10CdAF1d9aFCf85c3b8D805000aE34d0c2'
const contract = new web3.eth.Contract(abi, tokenAddress);

const tx = contract.methods.mint(ownerAddress, numTokens)
const encodedABI = tx.encodeABI();

contract.methods.governance()

// Signs the given transaction data and sends it.
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
    to: tokenAddress,
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