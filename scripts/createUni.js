// import { FACTORY_ADDRESS, INIT_CODE_HASH } from "@uniswap/sdk";
import { pack, keccak256 } from '@ethersproject/solidity'
import { getCreate2Address } from '@ethersproject/address'

const token0 = '0xCAFE000000000000000000000000000000000000' // change me!
const token1 = '0xF00D000000000000000000000000000000000000' // change me!

const pair = getCreate2Address(
  "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
  keccak256(['bytes'], [pack(['address', 'address'], [token0, token1])]),
  "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f"
)