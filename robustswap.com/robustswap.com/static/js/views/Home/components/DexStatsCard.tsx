import React, { useCallback, useState, useEffect } from "react";
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import { Card, Text } from '@robustswap-libs/uikit'
import Button from '@material-ui/core/Button';
import BigNumber from 'bignumber.js'
import useI18n from 'hooks/useI18n'
import { useExchangeStats } from 'hooks/api'
import { getBalanceNumber } from "utils/formatBalance";
import { useFarmFromPid, usePriceBnbBusd, useTotalValue } from "state/hooks";
import { useGetReserves } from "hooks/useTokenBalance";
import CardValue from './CardValue'
import useStyles from "../../../assets/styles";
import { registerToken } from '../../../utils/wallet'
import { getRbsAddress } from '../../../utils/addressHelpers'

const StyledDexStatsCard = styled(Card)`
  width: 100%;
  border-radius: 8px;
  margin-right: 16px;
  background: #1E215C;
  padding: 16px;
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0px;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`
const ValueTitle = styled(Text)`
  color: #FCFCFC;
  font-size: 12px;
  line-height: 14px;  
`

const DexStatsCard = () => {
  const [totalLiquidityUSD, setTotalLiquidityUsd] = useState(new BigNumber(0))
  const chainId = 56
  const farm1 = useFarmFromPid(1)
  const bnbReserve = useGetReserves(farm1.lpAddresses[chainId])
  let bnbPrice = usePriceBnbBusd()
  if (!bnbPrice.isNaN() && bnbPrice.toString() !== '0') {
    bnbPrice = new BigNumber(1).div(bnbPrice)
  }
  const farm2 = useFarmFromPid(0)
  const busdReserve = useGetReserves(farm2.lpAddresses[chainId])

  useEffect(() => {
    const rbs1 = bnbReserve.times(bnbPrice).times(new BigNumber(2))
    const rbs2 = busdReserve.times(new BigNumber(2))
    const total = rbs1.plus(rbs2)
    if (totalLiquidityUSD.toNumber() < rbs1.plus(rbs2).toNumber()) {
      setTotalLiquidityUsd(total)
    }
  }, [bnbPrice])

  const TranslateString = useI18n()
  const classes = useStyles.chart();
  const totalValue = useTotalValue()
  // const data = useExchangeStats()
  const ZERO = new BigNumber(0)
  // const volumeUSD = data ? new BigNumber(data?.data?.volume_USD) : ZERO

  const registerNativeToken = useCallback(async () => {
    try {
      await registerToken(getRbsAddress(), 'RBS', 18, `https://robustswap.com/images/farms/RBS.png`)
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    }
  }, [])

  return (
    <>
      <Header>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#A0B9FB', paddingBottom: 16 }}>{TranslateString(688, 'Overview')}</Text>
        <Button onClick={registerNativeToken} className={classes.metamaskButton} style={{ marginTop: 0, width: 89, borderRadius: 28, border: '1px solid #5F47EE', color: '#5F47EE', fontWeight: 600, fontSize: 18, padding: '4px 24px' }}>
          <img style={{ marginRight: 8 }} width={16} src="/images/wallet/metamask.png" alt="metamask logo" /> +
        </Button>
      </Header>
      <Grid container spacing={3}>
        <Grid item sm={4} xs={12}>
          <StyledDexStatsCard>
            <Row>
              <ValueTitle>{TranslateString(10035, 'Total Liquidity')}</ValueTitle>
            </Row>
            <Row>
              <CardValue weight={800} fontSize="20px" value={totalLiquidityUSD?.toNumber()} decimals={0} prefix="$" />
            </Row>
          </StyledDexStatsCard>
        </Grid>
        <Grid item sm={4} xs={12}>
          <StyledDexStatsCard>
            <Row>
              <ValueTitle>{TranslateString(10036, '24H Volume')}</ValueTitle>
            </Row>
            <Row>
              <CardValue weight={800} fontSize="20px" value={getBalanceNumber(new BigNumber(0), 0)} decimals={0} prefix="$" />
            </Row>
          </StyledDexStatsCard>
        </Grid>
        <Grid item sm={4} xs={12}>
          <StyledDexStatsCard style={{ marginRight: 0 }}>
            <Row>
              <ValueTitle>{TranslateString(297, 'TVL')}</ValueTitle>
            </Row>
            <Row>
              <CardValue weight={800} fontSize="20px" value={totalValue.toNumber()} decimals={0} prefix="$" />
            </Row>
          </StyledDexStatsCard>
        </Grid>
      </Grid></>
  )
}

export default DexStatsCard
