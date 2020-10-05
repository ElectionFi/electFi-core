const { expect } = require("chai");
const {
  BigNumber,
} = require('ethers')


function expandTo18Decimals(n) {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(18))
}

describe("Trump", function() {
  let trump 
  let sender
  beforeEach(async () => {
    // Deploy contract
    const Trump = await ethers.getContractFactory("Trump");
    trump = await Trump.deploy();
    await trump.deployed();
    
    // Get account
    const accounts = await ethers.getSigners();
    sender = await accounts[0].getAddress()
  })
  
  it("Should have only 50k", async function() {   
    expect((await trump.totalSupply())._hex).to.eq(expandTo18Decimals(50000)._hex);
  });
  it("Contract Owner is sender", async function () {
    let balance = await trump.balanceOf(sender)
    
    expect(balance.toHexString()).to.eq(expandTo18Decimals(50000).toHexString())
  })
});

describe("Biden", function () {
  let biden
  let sender
  beforeEach(async () => {
    // Deploy contract
    const Biden = await ethers.getContractFactory("Biden");
    biden = await Biden.deploy();
    await biden.deployed();

    // Get account
    const accounts = await ethers.getSigners();
    sender = await accounts[0].getAddress()
  })

  it("Should have only 50k", async function () {
    expect((await biden.totalSupply()).toHexString()).to.eq(expandTo18Decimals(50000).toHexString());
  });
  it("Contract Owner is sender", async function () {
    let balance = await biden.balanceOf(sender)

    expect(balance.toHexString()).to.eq(expandTo18Decimals(50000).toHexString())
  })
});
