import { PoolCategory, PoolConfig } from './types'

const pools: PoolConfig[] = [
  {
    sousId: 1,
    tokenName: 'WBNB',
    stakingTokenName: 'PANTHER',
    stakingTokenAddress: '0xb04A88fCBB482c4954E3f5BC789d161f0ED0e042',
    contractAddress: {
      97: '',
      56: '0x3b5ed7b0f8bf5d2b485352e15a416092ca741c2c',
    },
    poolCategory: PoolCategory.CORE,
    projectLink: 'https://binance.org/',
    harvest: true,
    tokenPerBlock: '0.0005',
    sortOrder: 999,
    isFinished: false,
    tokenDecimals: 18,
  },
  {
    sousId: 2,
    tokenName: 'BUSD',
    stakingTokenName: 'PANTHER',
    stakingTokenAddress: '0xb04A88fCBB482c4954E3f5BC789d161f0ED0e042',
    contractAddress: {
      97: '',
      56: '0xf31cbe0b2bb2e704310c90a6f74300b3d4627ce8',
    },
    poolCategory: PoolCategory.CORE,
    projectLink: 'https://www.paxos.com/busd/',
    harvest: true,
    tokenPerBlock: '0.3',
    sortOrder: 999,
    isFinished: false,
    tokenDecimals: 18,
  },
]

export default pools
