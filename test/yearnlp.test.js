const { expect, use } = require("chai");
const {step} = require('mocha-steps')
const {
  BigNumber,
} = require('ethers');
const { solidity } = require("ethereum-waffle");

function expandTo18Decimals(n) {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(18))
}
use(solidity)
describe("LP Rewards", async function () {
  const totalSupply = expandTo18Decimals("50000")
  const amountToStake = expandTo18Decimals("100")
  const rewardAmount = expandTo18Decimals("49700")
  
  const ownerBalacne = totalSupply.sub(rewardAmount)
  
  let biden
  let trump
  let byearn
  let tyearn
  let sender
  let sender2
  let sender3
  
  before( async () => {
    // Deploy contracts
    const BYearn = await ethers.getContractFactory("BidenYearnLPRewards");
    byearn = await BYearn.deploy();
    await byearn.deployed();

    const TYearn = await ethers.getContractFactory("TrumpYearnLPRewards");
    tyearn = await TYearn.deploy();
    await tyearn.deployed();

    const Trump = await ethers.getContractFactory("Trump");
    trump = await Trump.deploy();
    await trump.deployed();

    const Biden = await ethers.getContractFactory("Biden");
    biden = await Biden.deploy();
    await biden.deployed();

    // Get account
    const accounts = await ethers.getSigners();
    sender = accounts[0]
    sender2 = accounts[1]
    sender3 = accounts[2]
  })
  
  step("Biden rewards should have 0 balance", async function () {
    const balance = await biden.balanceOf(byearn.address)
    expect(balance.toHexString()).to.equal(BigNumber.from(0).toHexString())
  })
  
  step("Trump rewards should have 0 balance", async function () {
    const balance = await trump.balanceOf(tyearn.address)
    expect(balance.toHexString()).to.equal(BigNumber.from(0).toHexString())
  })
  step("Send tokens to bidenRewards", async function () {
    await biden.transfer(byearn.address, rewardAmount)
    expect((await biden.balanceOf(byearn.address)).toHexString()).to.equal(rewardAmount.toHexString())
    expect((await biden.balanceOf(await sender.getAddress())).toHexString()).to.equal(ownerBalacne.toHexString())
  })
  step("Send tokens to trumpRewards", async function () {
    await trump.transfer(tyearn.address, rewardAmount)
    expect((await trump.balanceOf(tyearn.address)).toHexString()).to.equal(rewardAmount.toHexString())
    expect((await trump.balanceOf(await sender.getAddress())).toHexString()).to.equal(ownerBalacne.toHexString())
  })
  step("Send Biden to account 2", async function () {
    await biden.transfer(await sender2.getAddress(), amountToStake)
    expect((await biden.balanceOf(await sender2.getAddress())).toString()).to.equal(amountToStake.toString())
  })
  step("Send Trump to account 3", async function () {
    await trump.transfer(await sender3.getAddress(), amountToStake)
    expect((await trump.balanceOf(await sender3.getAddress())).toString()).to.equal(amountToStake.toString())
  })
  
  describe("Staking Biden", async () => {    
    step("Set YFI", async function() {
      await byearn.setRewardDistribution(await sender.getAddress())
      await byearn.setYFI(biden.address, biden.address, trump.address, trump.address, tyearn.address)
      expect(await byearn.bpt()).to.equal(biden.address)
      expect(await byearn.yfi()).to.equal(biden.address)
      expect(await byearn.obpt()).to.equal(trump.address)
      expect(await byearn.xyfi()).to.equal(trump.address)
      expect(await byearn.opponent()).to.equal(tyearn.address)
    })
    
    describe("Stake Biden for 1 person", async function () {
      step("Exit without staking... Should fail", async function () {
        await expect(byearn.exit()).to.be.revertedWith("Cannot withdraw 0");
      })
      step("Approve Biden tokens", async function () {
        //send initial tokens to contract
        await biden.approve(byearn.address, amountToStake)
        expect((await biden.allowance(await sender.getAddress(), byearn.address)).toString()).to.equal(amountToStake.toString())
      })
      step("Stake Biden", async function () {
        await byearn.stake(amountToStake)
        expect((await byearn.totalSupply()).toString()).to.equal(amountToStake.toString())
      })

      step("Exit Biden Rewards", async function () {
        await byearn.exit()
        expect((await byearn.totalSupply()).toString()).to.equal(BigNumber.from(0).toString())
      })
    })
    
    describe("Stake Biden for 2 person", async function () {
      step("Approve Biden tokens (account 1)", async function () {
        //send initial tokens to contract
        await biden.approve(byearn.address, amountToStake)
        expect((await biden.allowance(await sender.getAddress(), byearn.address)).toString()).to.equal(amountToStake.toString())
      })
      step("Stake Biden (account 1)", async function () {
        await byearn.stake(amountToStake)
        expect((await byearn.totalSupply()).toString()).to.equal(amountToStake.toString())
      })
      
      step("Approve Biden tokens (account 2)", async function () {
        //send initial tokens to contract
        await biden.connect(sender2).approve(byearn.address, amountToStake)
        expect((await biden.allowance(await sender2.getAddress(), byearn.address)).toString()).to.equal(amountToStake.toString())
      })
      
      step("Stake Biden (account 2)", async function () {
        await byearn.connect(sender2).stake(amountToStake)
        expect((await byearn.totalSupply()).toString()).to.equal(amountToStake.mul(2).toString())
      })

      step("Exit Biden Rewards (account 1)", async function () {
        await byearn.exit()
        expect((await byearn.totalSupply()).toString()).to.equal(amountToStake.toString())
      })
      step("Exit Biden Rewards (account 2) should penalize by 30%", async function () {
        await byearn.connect(sender2).exit()
        expect((await byearn.totalSupply()).toString()).to.equal(BigNumber.from(0).toString())
        expect((await biden.balanceOf(await sender2.getAddress())).toString()).to.equal(amountToStake.mul(7).div(10).toString())
      })
    })
  })
  
  describe("Election Purge (trump loses)", async () => {

    step("Set YFI", async function () {
      await byearn.setRewardDistribution(await sender.getAddress())
      await byearn.setYFI(biden.address, biden.address, trump.address, trump.address, tyearn.address)
      await tyearn.setRewardDistribution(await sender.getAddress())
      await tyearn.setYFI(trump.address, trump.address, biden.address, biden.address, byearn.address)
    })

    describe("3 people 2 pools", async function () {
      
      const sender2StakePenalized = amountToStake.mul(7).div(10)
      const finalTotalSupply = amountToStake.mul(7).div(10).add(amountToStake)
      const opponentStake = rewardAmount.add(amountToStake)
      const senderClaimable = opponentStake.mul(amountToStake).div(finalTotalSupply)
      const sender2Claimable = opponentStake.mul(sender2StakePenalized).div(finalTotalSupply)
      
      step("totalClaim", async function() {
        const remainder = opponentStake.sub(senderClaimable).sub(sender2Claimable).toNumber()
        expect(remainder).to.be.approximately(0, 10)
      })

      step("Claim without staking before election (account 2) again... Should fail", async function () {
        await expect(byearn.connect(sender2).claim()).to.be.revertedWith("Election must be finalized");
      })
      
      step("Approve Biden tokens (account 1)", async function () {
        //send initial tokens to contract
        await biden.approve(byearn.address, amountToStake)
        expect((await biden.allowance(await sender.getAddress(), byearn.address)).toString()).to.equal(amountToStake.toString())
      })
      step("Stake Biden (account 1)", async function () {
        await byearn.stake(amountToStake)
        expect((await byearn.totalSupply()).toString()).to.equal(amountToStake.toString())
      })
      
      step("Approve Biden tokens (account 2)", async function () {
        //send initial tokens to contract
        await biden.connect(sender2).approve(byearn.address, amountToStake)
        expect((await biden.allowance(await sender2.getAddress(), byearn.address)).toString()).to.equal(amountToStake.toString())
      })

      step("Stake Biden (account 2)", async function () {
        expect((await biden.balanceOf(await sender2.getAddress())).toString()).to.equal(amountToStake.mul(7).div(10).toString())
        await byearn.connect(sender2).stake(sender2StakePenalized)
        expect((await byearn.totalSupply()).toString()).to.equal(sender2StakePenalized.add(amountToStake).toString())
      })

      step("Approve Trump tokens (account 3)", async function () {
        //send initial tokens to contract
        await trump.connect(sender3).approve(tyearn.address, amountToStake)
        expect((await trump.allowance(await sender3.getAddress(), tyearn.address)).toString()).to.equal(amountToStake.toString())
      })

      step("Stake Trump (account 3)", async function () {
        await tyearn.connect(sender3).stake(amountToStake)
        expect((await tyearn.totalSupply()).toString()).to.equal(amountToStake.toString())
      })

      step("Trump loses", async function () {
        await tyearn.lose()
        expect((await tyearn.totalSupply()).toString()).to.equal(BigNumber.from(0).toString())
        expect((await trump.balanceOf(byearn.address)).toString()).to.equal(rewardAmount.add(amountToStake).toString())
      })
      step("Finalize results", async function () {
        await tyearn.finalize()
        await byearn.finalize()
        expect((await tyearn.totalSupply()).toString()).to.equal(BigNumber.from(0).toString())
        expect((await tyearn.finalTotalSupply()).toString()).to.equal(BigNumber.from(0).toString())
        expect((await tyearn.finalOTotalSupply()).toString()).to.equal(BigNumber.from(0).toString())

        expect((await trump.balanceOf(byearn.address)).toString()).to.equal(rewardAmount.add(amountToStake).toString())
        expect((await byearn.finalTotalSupply()).toString()).to.equal(finalTotalSupply.toString())
        expect((await byearn.finalOTotalSupply()).toString()).to.equal(opponentStake.toString())
      })
      step("Claim as winner (account 2)", async function() {
        await byearn.connect(sender2).claim()
        expect((await trump.balanceOf(await sender2.getAddress())).toString()).to.equal(sender2Claimable.toString())
      })
      step("Claim as winner (account 2) again... Should fail", async function () {
        await expect(byearn.connect(sender2).claim()).to.be.revertedWith("revert Already claimed");
      })
      step("Claim as winner (account 1)", async function () {
        const balance = await trump.balanceOf(await sender.getAddress())
        await byearn.claim()
        expect((await trump.balanceOf(await sender.getAddress())).toString()).to.equal(senderClaimable.add(balance).toString())
      })
    })
  })
});
