
let Web3 = require("web3");
const Tx = require('ethereumjs-tx').Transaction
require("dotenv").config();

const bidenAbi = require('../build/contracts/Biden.json').abi;

const UniswapFactoryAbi = ""
const ownerAddress = process.env.PublicKey
const privKey = process.env.PrivateKey

class Contract {
  constructor(abi, address, host, publicKey="", privateKey="" ) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(process.env.host))
    this.abi = abi;
    this.address = address;
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.host = host;
  }
  sendSigned(txData, cb) {
    const privateKey = new Buffer(this.privKey, 'hex')
    const transaction = new Tx(txData)
    transaction.sign(this.privateKey)
    const serializedTx = transaction.serialize().toString('hex')
  
    web3.eth.sendSignedTransaction('0x' + serializedTx, cb)
  }
}

  // the Uniswap factory contract address
const uniswapFactory = '0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36'
const contract = new web3.eth.Contract(JSON.parse(abi), uniswapFactory);
const tokenAddress = '0x81d7f0084F9a86E49bB0fd8806428bB42836D67c'
const tx = contract.methods.createExchange(tokenAddress);
const encodedABI = tx.encodeABI();




  // the address that will send the test transaction

  send(pub, sec){
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

}


// javascript:  transact with deployed Uniswap Factory contract - createExchange

let Web3 = require("web3");
const Tx = require('ethereumjs-tx')
require("dotenv").config();


var abi = require('../build/contracts/Biden.json').abi;
let web3 = new Web3(new Web3.providers.HttpProvider(process.env.host))


// the account address that will send the test transaction
const ownerAddress = process.env.PublicKey
const privKey = process.env.PrivateKey

// the Uniswap factory contract address
const uniswapFactory = '0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36'
const contract = new web3.eth.Contract(JSON.parse(abi), uniswapFactory);
const tokenAddress = '0x81d7f0084F9a86E49bB0fd8806428bB42836D67c'
const tx = contract.methods.createExchange(tokenAddress);
const encodedABI = tx.encodeABI();

function sendSigned(txData, cb) {
  const privateKey = new Buffer(privKey, 'hex')
  const transaction = new Tx(txData)
  transaction.sign(privateKey)
  const serializedTx = transaction.serialize().toString('hex')

  web3.eth.sendSignedTransaction('0x' + serializedTx, cb)
}

