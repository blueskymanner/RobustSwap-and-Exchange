import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link } from "react-router-dom"
import Grid from '@material-ui/core/Grid'
import { Card, Text } from '@robustswap-libs/uikit'
import { Farm } from 'state/types'
import useI18n from 'hooks/useI18n'
import { BLOCKS_PER_YEAR } from 'config'
import { QuoteToken } from 'config/constants/types'
import { useFarms, usePriceBnbBusd, usePriceEthBusd, usePriceRbsBusd, usePriceUsdcBusd, usePriceUsdtBusd } from 'state/hooks'
import BigNumber from 'bignumber.js'
import CardValue from './CardValue'

const StyledActivitiesCard = styled(Card)`
  width: 100%;
  border-radius: 8px;
  margin-right: 16px;
  background: #1E215C;
  padding: 16px 16px;
  margin-bottom: 16px;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 16px;
  justify-content: space-between;
  margin-bottom: 16px;
`

const CalculateApr = (farm: Farm, rbsPrice: BigNumber, bnbPrice: BigNumber, ethPrice: BigNumber, usdcPrice: BigNumber, usdtPrice: BigNumber) => {

  const cakeRewardPerBlock = new BigNumber(farm.rbsPerBlock || 1)
    .times(new BigNumber(farm.poolWeight))
    .div(new BigNumber(10).pow(18))


  const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR)
  let apy = rbsPrice.times(cakeRewardPerYear)
  let totalValue = new BigNumber(farm.lpTotalInQuoteToken || 0)

  if (farm.quoteTokenSymbol === QuoteToken.BNB) {
    totalValue = totalValue.times(bnbPrice)
  }

  if (farm.quoteTokenSymbol === QuoteToken.ETH) {
    totalValue = totalValue.times(ethPrice)
  }

  if (farm.quoteTokenSymbol === QuoteToken.USDC) {
    totalValue = totalValue.times(usdcPrice)
  }

  if (farm.quoteTokenSymbol === QuoteToken.USDT) {
    totalValue = totalValue.times(usdtPrice)
  }
  const exception = farm.lpTotalInQuoteToken?.toString() === '0' ? 100000000 : 1

  if (totalValue.comparedTo(0) > 0) {
    apy = apy.div(totalValue).times(100)
  }
  else apy = apy.div(exception)
  return apy.toNumber()
}

const ActivitiesCard = () => {
  const TranslateString = useI18n()
  const farms = useFarms()
  const rbsPrice = usePriceRbsBusd()
  let bnbPrice = usePriceBnbBusd()
  bnbPrice = new BigNumber(1).div(usePriceBnbBusd())
  const ethPrice = usePriceEthBusd()
  const usdcPrice = usePriceUsdcBusd()
  const usdtPrice = usePriceUsdtBusd()
  const [rbsBusd, setRbsBusd] = useState(0)
  const [rbtBnb, setRbtBnb] = useState(0)
  const [rbs, setRbs] = useState(0)
  const [rbt, setRbt] = useState(0)
  useEffect(() => {
    let val = CalculateApr(farms[0], rbsPrice, bnbPrice, ethPrice, usdcPrice, usdtPrice)
    setRbsBusd(val)
    val = CalculateApr(farms[1], rbsPrice, bnbPrice, ethPrice, usdcPrice, usdtPrice)
    setRbtBnb(val)
    val = CalculateApr(farms[24], rbsPrice, bnbPrice, ethPrice, usdcPrice, usdtPrice)
    setRbs(val)
    val = CalculateApr(farms[25], rbsPrice, bnbPrice, ethPrice, usdcPrice, usdtPrice)
    setRbt(val)
  }, [bnbPrice, rbsPrice, ethPrice, usdcPrice, usdtPrice, farms])

  return (
    <Grid container spacing={3}>
      <Grid item sm={6} xs={12} >
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#A0B9FB', paddingBottom: 16 }}>{TranslateString(657, "Top Farms")}</Text>
        <StyledActivitiesCard>
          <Link to='/farms'>
            <Row>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="/images/farms/RBS.png" alt="rbs" width="32px" height="32px" />
                <img src="/images/farms/BUSD.png" alt="rbs" width="32px" height="32px" style={{ marginLeft: -8, marginRight: 8 }} />
                <Text fontSize="16px">{TranslateString(99999, 'RBS-BUSD')}</Text>
              </div>
              <CardValue fontSize="16px" value={rbsBusd} decimals={0} suffix="% APR" />
            </Row>
            <Row style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="/images/farms/RBT.png" alt="rbs" width="32px" height="32px" />
                <img src="/images/farms/BNB.png" alt="rbs" width="32px" height="32px" style={{ marginLeft: -8, marginRight: 8 }} />
                <Text fontSize="16px">{TranslateString(99999, 'RBT-BNB')}</Text>
              </div>
              <CardValue fontSize="16px" value={rbtBnb} decimals={0} suffix="% APR" />
            </Row>
          </Link>
        </StyledActivitiesCard>
      </Grid>
      <Grid item sm={6} xs={12} >
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#A0B9FB', paddingBottom: 16 }}>{TranslateString(655, "Top Pools")}</Text>
        <StyledActivitiesCard>
          <Link to='/pools'>
            <Row>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="/images/farms/RBS.png" alt="rbs" width="32px" height="32px" style={{ marginRight: 8 }} />
                <Text fontSize="16px">{TranslateString(99999, 'RBS')}</Text>
              </div>
              <CardValue fontSize="16px" value={rbs} decimals={0} suffix="% APR" />
            </Row>
            <Row style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="/images/farms/RBT.png" alt="rbs" width="32px" height="32px" style={{ marginRight: 8 }} />
                <Text fontSize="16px">{TranslateString(99999, 'RBT')}</Text>
              </div>
              <CardValue fontSize="16px" value={rbt} decimals={0} suffix="% APR" />
            </Row>
          </Link>
        </StyledActivitiesCard>
      </Grid>
    </Grid>
  )
}

export default ActivitiesCard
