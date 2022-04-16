import React from 'react'
import { useMedia } from 'react-use'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import { Card } from '@robustswap-libs/uikit'
import {
  useSellTax,
  useBuyTax,
  useTransferTaxRate,
  useMaxTransferLimitAmount
} from 'hooks/useTokenBalance'
import useI18n from 'hooks/useI18n'
import CardValue from './CardValue'
import { getBalanceNumber } from '../../../utils/formatBalance'

const StyledSupplyStatsCard = styled(Card)`
  width: 100%;
  border-radius: 16px;
  margin-right: 16px;
  background: #1E215C;
  border-radius: 0px;
  border-right: 1px solid #151745;
  border-bottom:1px solid #151745;
  padding: 16px 0px 16px 16px;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  color: #A0B9FB;
  padding-right: 16px;
  font-size: 16px;
  justify-content: space-between;
`
const SupplyStatsCard = () => {
  const TranslateString = useI18n()
  const sellTax = useSellTax()
  const buyTax = useBuyTax()
  const transferTax = useTransferTaxRate()
  const limitAmount = useMaxTransferLimitAmount()
  const isMobile = useMedia('(max-width: 760px)')

  return (
    <Grid container spacing={2}>
      <Grid item sm={6} xs={12} style={{ padding: 0 }}>
        <StyledSupplyStatsCard style={{ borderTopLeftRadius: 16, borderTopRightRadius: isMobile ? 16 : 0 }}>
          <Row>
            {TranslateString(720, "Sell Tax")}
            <CardValue fontSize="16px" value={getBalanceNumber(sellTax, 2)} decimals={0} suffix="%" />
          </Row>
        </StyledSupplyStatsCard>
      </Grid>
      <Grid item sm={6} xs={12} style={{ padding: 0 }}>
        <StyledSupplyStatsCard style={{ borderTopRightRadius: isMobile ? 0 : 16 }}>
          <Row>
            {TranslateString(722, "Buy Tax")}
            <CardValue fontSize="16px" value={getBalanceNumber(buyTax, 2)} decimals={0} suffix="%" />
          </Row>
        </StyledSupplyStatsCard>
      </Grid>
      <Grid item sm={6} xs={12} style={{ padding: 0 }}>
        <StyledSupplyStatsCard style={{ borderBottomLeftRadius: isMobile ? 0 : 16 }}>
          <Row>
            {TranslateString(724, "Transfer Tax")}
            <CardValue fontSize="16px" value={getBalanceNumber(transferTax, 2)} decimals={0} suffix="%" />
          </Row>
        </StyledSupplyStatsCard>
      </Grid>
      <Grid item sm={6} xs={12} style={{ padding: 0 }}>
        <StyledSupplyStatsCard style={{ borderBottomRightRadius: 16, borderBottomLeftRadius: isMobile ? 16 : 0 }}>
          <Row>
            {TranslateString(726, "Amount Limit")}
            <CardValue fontSize="16px" value={getBalanceNumber(limitAmount, 18)} decimals={2} suffix=" RBS" />
          </Row>
        </StyledSupplyStatsCard>
      </Grid>
    </Grid >
  )
}

export default SupplyStatsCard