// javascript:  query the new exchange contract address for given token contract

let Web3 = require("web3");
const Tx = require('ethereumjs-tx').Transaction
require("dotenv").config();

var abi = require('../build/contracts/UniswapV2Factory').abi;
let web3 = new Web3(new Web3.providers.HttpProvider(process.env.host))

var bidenAddress = process.env.bidenAddress
var trumpAddress = process.env.trumpAddress
var uniswapFactory = process.env.uniswapFactory
const ownerAddress = process.env.PublicKey

const uniswap = new web3.eth.Contract(abi, uniswapFactory);
async function call(transaction) {
    return await transaction.call({from: ownerAddress});
}

async function getTokenExchange() {
    let exchange = await call(uniswap.methods.getPair(bidenAddress, trumpAddress));
    console.log("the exchange address for ERC20 token is:" + exchange)
}
getTokenExchange()
