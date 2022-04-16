import { useMemo } from 'react'
import { AbiItem } from 'web3-utils'
import { ContractOptions } from 'web3-eth-contract'
import {
  getMasterChefAddress,
  getRbsAddress,
  getReferralAddress,
  getCakeRouterAddress,
} from 'utils/addressHelpers'
import { getContract } from 'utils/web3'
import { poolsConfig } from 'config/constants'
import { PoolCategory } from 'config/constants/types'
import ifo from 'config/abi/ifo.json'
import erc20 from 'config/abi/erc20.json'
import pancakeRabbits from 'config/abi/pancakeRabbits.json'
import masterChef from 'config/abi/masterchef.json'
import sousChef from 'config/abi/sousChef.json'
import sousChefBnb from 'config/abi/sousChefBnb.json'
import referral from 'config/abi/referral.json'
import cakeRouter from 'config/abi/cakeRouter.json'
import pair from 'config/abi/pair.json'
import useActiveWeb3React from './useActiveWeb3React'

const useContract = (abi: any, address: string) => {
  const { account, library } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !abi || !library) return null
    try {
      return getContract(abi, address, library, account)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, abi, library, account])
}

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoContract = (address: string) => {
  const ifoAbi = (ifo as unknown) as AbiItem
  return useContract(ifoAbi, address)
}

export const useERC20 = (address: string) => {
  const erc20Abi = (erc20 as unknown) as AbiItem
  return useContract(erc20Abi, address)
}

export const useCake = () => {
  return useERC20(getRbsAddress())
}

export const usePancakeRabbits = (address: string) => {
  const pancakeRabbitsAbi = (pancakeRabbits as unknown) as AbiItem
  return useContract(pancakeRabbitsAbi, address)
}

export const useMasterchef = () => {
  const abi = (masterChef as unknown) as AbiItem
  return useContract(abi, getMasterChefAddress())
}

export const useSousChef = (id) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  const rawAbi = config.poolCategory === PoolCategory.BINANCE ? sousChefBnb : sousChef
  const abi = (rawAbi as unknown) as AbiItem
  return useContract(abi, config.contractAddress[process.env.REACT_APP_CHAIN_ID])
}

export const useReferral = () => {
  const abi = referral
  return useContract(abi, getReferralAddress())
}

export const useCakeRouter = () => {
  const abi = (cakeRouter as unknown) as AbiItem
  return useContract(abi, getCakeRouterAddress())
}

export const usePath = (address: string) => {
  const abi = (pair as unknown) as AbiItem
  return useContract(abi, address)
}

export default useContract
