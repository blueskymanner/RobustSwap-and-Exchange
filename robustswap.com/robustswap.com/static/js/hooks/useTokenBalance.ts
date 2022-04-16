import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import cakeABI from 'config/abi/cake.json'
import pairABI from 'config/abi/pair.json'
import masterChefABI from 'config/abi/masterchef.json'
import { getContract } from 'utils/web3'
import { getTokenBalance } from 'utils/erc20'
import { getRbsAddress, getMasterChefAddress } from 'utils/addressHelpers'
import useRefresh from './useRefresh'
import useActiveWeb3React from './useActiveWeb3React'
import useContract from './useContract'

const useTokenBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account, library } = useActiveWeb3React()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getTokenBalance(library, tokenAddress, account)
      setBalance(new BigNumber(res.toString()))
    }

    if (account && library) {
      fetchBalance()
    }
  }, [account, library, tokenAddress, fastRefresh])

  return balance
}

export const useTotalSupply = () => {
  const { slowRefresh } = useRefresh()
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const cakeContract = useContract(cakeABI, getRbsAddress())

  useEffect(() => {
    async function fetchTotalSupply() {
      const supply = await cakeContract.totalSupply()
      setTotalSupply(new BigNumber(supply.toString()))
    }
    fetchTotalSupply()
  }, [cakeContract, slowRefresh])

  return totalSupply
}

export const useBurnedBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account, library } = useActiveWeb3React()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const cakeContract = getContract(cakeABI, getRbsAddress(), library, account)
      const bal = await cakeContract.balanceOf('0x000000000000000000000000000000000000dEaD')
      setBalance(new BigNumber(bal.toString()))
    }

    fetchBalance()
  }, [account, library, tokenAddress, fastRefresh])

  return balance
}

export const useMasterChefBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account, library } = useActiveWeb3React()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const cakeContract = getContract(cakeABI, getRbsAddress(), library, account)
      const bal = await cakeContract.balanceOf(getMasterChefAddress())
      setBalance(new BigNumber(bal.toString()))
    }

    fetchBalance()
  }, [account, library, tokenAddress, slowRefresh])

  return balance
}

export const useMaxTransferLimitAmount = () => {
  const { slowRefresh } = useRefresh()
  const [maxTransferLimitAmount, setMaxTransferLimitAmount] = useState(new BigNumber(0))
  const { account, library } = useActiveWeb3React()

  useEffect(() => {
    async function fetchMaxTransferLimitAmount() {
      const cakeContract = getContract(cakeABI, getRbsAddress(), library, account)
      const amount = await cakeContract.maxTransferLimitAmount()
      setMaxTransferLimitAmount(new BigNumber(amount.toString()))
    }

    fetchMaxTransferLimitAmount()
  }, [account, library, slowRefresh])

  return maxTransferLimitAmount
}

export const useMaximumSupply = () => {
  const { slowRefresh } = useRefresh()
  const { account, library } = useActiveWeb3React()
  const [maximumSupply, setMaximumSupply] = useState(new BigNumber(0))

  useEffect(() => {
    async function fetchMaximumSupply() {
      const cakeContract = getContract(cakeABI, getRbsAddress(), library, account)
      const maxSupply = await cakeContract.MAXIMUM_SUPPLY()
      setMaximumSupply(new BigNumber(maxSupply.toString()))
    }

    fetchMaximumSupply()
  }, [account, library, slowRefresh])

  return maximumSupply
}

export const useMintedSupply = () => {
  const { slowRefresh } = useRefresh()
  const { account, library } = useActiveWeb3React()
  const [mintedSupply, setMintedSupply] = useState(new BigNumber(0))

  useEffect(() => {
    async function fetchMintedSupply() {
      const cakeContract = getContract(cakeABI, getRbsAddress(), library, account)
      const mintSupply = await cakeContract.mintedSupply()
      setMintedSupply(new BigNumber(mintSupply.toString()))
    }

    fetchMintedSupply()
  }, [account, library, slowRefresh])

  return mintedSupply
}

export const useMintedBurned = () => {
  const { slowRefresh } = useRefresh()
  const { account, library } = useActiveWeb3React()
  const [mintedBurned, setMintedBurned] = useState(new BigNumber(0))

  useEffect(() => {
    async function fetchMintedBurned() {
      const cakeContract = getContract(cakeABI, getRbsAddress(), library, account)
      const mintBurned = await cakeContract.mintedBurned()
      setMintedBurned(new BigNumber(mintBurned.toString()))
    }

    fetchMintedBurned()
  }, [account, library, slowRefresh])

  return mintedBurned
}

export const useSellTax = () => {
  const { slowRefresh } = useRefresh()
  const { account, library } = useActiveWeb3React()
  const [sellTax, setSellTax] = useState(new BigNumber(0))

  useEffect(() => {
    async function fetchSellTax() {
      const cakeContract = getContract(cakeABI, getRbsAddress(), library, account)
      const stax = await cakeContract.transferTaxRateSell()
      setSellTax(new BigNumber(stax.toString()))
    }

    fetchSellTax()
  }, [account, library, slowRefresh])

  return sellTax
}

export const useBuyTax = () => {
  const { slowRefresh } = useRefresh()
  const { account, library } = useActiveWeb3React()
  const [buyTax, setBuyTax] = useState(new BigNumber(0))

  useEffect(() => {
    async function fetchbuyTax() {
      const cakeContract = getContract(cakeABI, getRbsAddress(), library, account)
      const btax = await cakeContract.transferTaxRateBuy()
      setBuyTax(new BigNumber(btax.toString()))
    }

    fetchbuyTax()
  }, [account, library, slowRefresh])

  return buyTax
}

export const useTaxTotal = () => {
  const { slowRefresh } = useRefresh()
  const { account, library } = useActiveWeb3React()
  const [taxTotal, setTaxTotal] = useState(new BigNumber(0))

  useEffect(() => {
    async function fetchTaxTotal() {
      const cakeContract = getContract(cakeABI, getRbsAddress(), library, account)
      const tax = await cakeContract.mintedTaxed()
      setTaxTotal(new BigNumber(tax.toString()))
    }

    fetchTaxTotal()
  }, [account, library, slowRefresh])

  return taxTotal
}

export const useTransferTaxRate = () => {
  const { slowRefresh } = useRefresh()
  const { account, library } = useActiveWeb3React()
  const [transferTaxRate, setTransferTaxRate] = useState(new BigNumber(0))

  useEffect(() => {
    async function fetchTransferTaxRate() {
      const rate = 0
      setTransferTaxRate(new BigNumber(rate.toString()))
    }

    fetchTransferTaxRate()
  }, [account, library, slowRefresh])

  return transferTaxRate
}

export const useRbsPerBlock = () => {
  const { slowRefresh } = useRefresh()
  const { account, library } = useActiveWeb3React()
  const [rbsPBlock, setrbsPBlock] = useState(new BigNumber(0))

  useEffect(() => {
    async function fetchRbsPBlock() {
      const cakeContract = getContract(masterChefABI, getMasterChefAddress(), library, account)
      const rbs = await cakeContract.rbsPerBlock()
      setrbsPBlock(new BigNumber(rbs.toString()))
    }

    fetchRbsPBlock()
  }, [account, library, slowRefresh])

  return rbsPBlock
}

export const useGetReserves = (lpAddress: string) => {
  const { slowRefresh } = useRefresh()
  const { account, library } = useActiveWeb3React()
  const [reserves, setReserves] = useState(new BigNumber(0))

  useEffect(() => {
    async function fetchGetReserves() {
      const cakeContract = getContract(pairABI, lpAddress, library, account)
      const rbs = await cakeContract.getReserves()
      setReserves(new BigNumber(rbs._reserve1.toString()).div(new BigNumber(10 ** 18).toString()))
    }

    fetchGetReserves()
  }, [account, library, slowRefresh, lpAddress])

  return reserves
}

export const useCirculatinSupply = (lpAddress: string) => {
  const { slowRefresh } = useRefresh()
  const [supply, setSupply] = useState(new BigNumber(0))
  const { account, library } = useActiveWeb3React()

  useEffect(() => {
    async function fetchSupply() {
      const cakeContract = getContract(pairABI, lpAddress, library, account)
      const rbs = await cakeContract.totalSupply()
      setSupply(new BigNumber(rbs.toString()).div(new BigNumber(10 ** 18)))
    }

    fetchSupply()
  }, [account, library, slowRefresh, lpAddress])

  return supply
}

export const useRbsAmountFromLP = (lpAddress: string) => {
  const { slowRefresh } = useRefresh()
  const { account, library } = useActiveWeb3React()
  const [rbsAmount, setRbsAmount] = useState(new BigNumber(0))

  useEffect(() => {
    async function fetchRbsAmount() {
      const cakeContract = getContract(cakeABI, getRbsAddress(), library, account)
      const rbs = await cakeContract.balanceOf(lpAddress)
      setRbsAmount(new BigNumber(rbs.toString()))
    }

    fetchRbsAmount()
  }, [account, library, slowRefresh, lpAddress])

  return rbsAmount
}

export default useTokenBalance
