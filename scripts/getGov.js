// javascript:  query the new exchange contract address for given token contract

let fs = require("fs");
let Web3 = require("web3");
require("dotenv").config();

var abi = require('../build/contracts/Biden.json').abi;
let web3 = new Web3(new Web3.providers.HttpProvider(process.env.host))
const tokenAddress = process.env.bidenAddress
const contract = new web3.eth.Contract(abi, tokenAddress);
const ownerAddress = process.env.PublicKey

async function call(transaction) {
    return await transaction.call({from: ownerAddress});
}

async function getGovAddress() {
    let exchange = await call(contract.methods.governance());
    console.log("the gov address for ERC20 token is:" + exchange)
}
getGovAddress()
