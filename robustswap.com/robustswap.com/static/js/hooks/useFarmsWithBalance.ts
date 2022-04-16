import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import multicall from 'utils/multicall'
import { getMasterChefAddress } from 'utils/addressHelpers'
import masterChefABI from 'config/abi/masterchef.json'
import { farmsConfig } from 'config/constants'
import { FarmConfig } from 'config/constants/types'
import useRefresh from './useRefresh'
import { useMasterchef } from './useContract'
import useActiveWeb3React from './useActiveWeb3React'

export interface FarmWithBalance extends FarmConfig {
  balance: BigNumber
  nextHarvestUntil: number
}

const useFarmsWithBalance = () => {
  const [farmsWithBalances, setFarmsWithBalances] = useState<FarmWithBalance[]>([])
  const { account } = useActiveWeb3React()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalances = async () => {
      const callsBalance = farmsConfig.map((farm) => ({
        address: getMasterChefAddress(),
        name: 'pendingRBS',
        params: [farm.pid, account],
      }))

      const callsHarvest = farmsConfig.map((farm) => ({
        address: getMasterChefAddress(),
        name: 'userInfo',
        params: [farm.pid, account],
      }))

      const rawResultsBalance = await multicall(masterChefABI, callsBalance)
      const rawResultsHarvest = await multicall(masterChefABI, callsHarvest)
      const results = farmsConfig.map((farm, index) => ({
        ...farm,
        balance: new BigNumber(rawResultsBalance[index]),
        nextHarvestUntil: rawResultsHarvest[index].nextHarvestUntil.toNumber(),
      }))

      setFarmsWithBalances(results)
    }

    if (account) {
      fetchBalances()
    }
  }, [account, fastRefresh])

  return farmsWithBalances
}

export const useTotalLockedUpRewards = () => {
  const [totalLockedUpRewards, setTotalLockedUpRewards] = useState(new BigNumber(0))
  const { slowRefresh } = useRefresh()
  const masterChefContract = useMasterchef()

  useEffect(() => {
    async function fetchTotalLockedUpRewards() {
      const locked = await masterChefContract.totalLockedUpRewards()
      setTotalLockedUpRewards(new BigNumber(locked.toString()))
    }

    fetchTotalLockedUpRewards()
  }, [slowRefresh, masterChefContract])

  return totalLockedUpRewards
}

export default useFarmsWithBalance
