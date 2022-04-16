import BigNumber from 'bignumber.js'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Cookies from 'js-cookie'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmsPublicDataAsync, fetchPoolsPublicDataAsync, fetchPoolsUserDataAsync } from './actions'
import { State, Farm, Pool } from './types'
import { QuoteToken } from '../config/constants/types'
import useParsedQueryString from '../hooks/useParsedQueryString'
import { referralCodeToAccount } from '../utils/referralCode'

const ZERO = new BigNumber(0)

export const useFetchPublicData = () => {
  const dispatch = useDispatch()
  const { slowRefresh } = useRefresh()
  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync())
  }, [dispatch, slowRefresh])
}

// Farms

export const useFarms = (): Farm[] => {
  const farms = useSelector((state: State) => state.farms.data)
  return farms
}

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)

  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : new BigNumber(0),
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : new BigNumber(0),
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : new BigNumber(0),
    nextHarvestUntil: farm.userData ? farm.userData.nextHarvestUntil : 0,
    canHarvest: farm.userData ? farm.userData.canHarvest : false,
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : new BigNumber(0),
  }
}

// Pools

export const usePools = (account): Pool[] => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchPoolsPublicDataAsync())
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const pools = useSelector((state: State) => state.pools.data)
  return pools
}

export const usePriceBnbBusd = (): BigNumber => {
  const pid = 6 // BUSD-BNB LP
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceRbsBusd = (): BigNumber => {
  const pid = 0 // RBS-BUSD CAKE-LP
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceRbtBnb = (): BigNumber => {
  const pid = 2 // RBT-BNB CAKE LP
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceEthBnb = (): BigNumber => {
  const pid = 8 // ETH-BNB LP
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceCakeBnb = (): BigNumber => {
  const pid = 5 // CAKE-BNB LP
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceUsdcBusd = (): BigNumber => {
  const pid = 13 // USDC-BUSD LP
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceUsdtBusd = (): BigNumber => {
  const pid = 27 // USDT-BUSD LP
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceEthBusd = (): BigNumber => {
  const ethBnbPrice = usePriceEthBnb()
  const bnbPrice = usePriceBnbBusd()
  return ethBnbPrice && bnbPrice ? ethBnbPrice.div(bnbPrice) : ZERO
}

export const usePriceRbtBusd = (): BigNumber => {
  const rbtBnbPrice = usePriceRbtBnb()
  const bnbPrice = new BigNumber(1).div(usePriceBnbBusd())
  return rbtBnbPrice && bnbPrice ? rbtBnbPrice.times(bnbPrice) : ZERO
}

export const useTotalValue = (): BigNumber => {
  const farms = useFarms()
  let bnbPrice = usePriceBnbBusd()
  bnbPrice = new BigNumber(1).div(usePriceBnbBusd())
  const ethPrice = usePriceEthBusd()
  const usdcPrice = usePriceUsdcBusd()
  const usdtPrice = usePriceUsdtBusd()
  let value = new BigNumber(0)
  for (let i = 0; i < farms.length; i++) {
    const farm = farms[i]
    if (farm.lpTotalInQuoteToken && !new BigNumber(farm.lpTotalInQuoteToken).isNaN()) {
      let val
      if (farm.quoteTokenSymbol === QuoteToken.BNB) {
        val = bnbPrice.times(farm.lpTotalInQuoteToken)
      } else if (farm.quoteTokenSymbol === QuoteToken.ETH) {
        val = ethPrice.times(farm.lpTotalInQuoteToken)
      } else if (farm.quoteTokenSymbol === QuoteToken.USDC) {
        val = usdcPrice.times(farm.lpTotalInQuoteToken)
      } else if (farm.quoteTokenSymbol === QuoteToken.USDT) {
        val = usdtPrice.times(farm.lpTotalInQuoteToken)
      } else {
        val = farm.lpTotalInQuoteToken
      }
      value = value.plus(val)
    }
  }
  return value
}

export const useReferralCode = (): string => {
  const parsedQs = useParsedQueryString()
  const referralCode = typeof parsedQs.ref === 'string' ? parsedQs.ref : ''
  const account = referralCodeToAccount(referralCode)
  const isValid = referralCode && account

  useEffect(() => {
    if (isValid) {
      try {
        Cookies.set('referral_code', referralCode, {
          path: '/',
          expires: 365,
        })
      } catch (error) {
        console.error(error)
      }
    }
  }, [isValid, referralCode])

  return isValid ? referralCode : null
}

export const useReferrerAddressFromCookie = (): string => {
  const referralCode = Cookies.get('referral_code')
  const account = referralCodeToAccount(referralCode)
  const zeroAddress = '0x0000000000000000000000000000000000000000'
  return typeof account === 'string' ? account : zeroAddress
}
