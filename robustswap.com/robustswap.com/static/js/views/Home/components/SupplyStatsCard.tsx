import React from 'react'
import { useMedia } from 'react-use'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import { Card } from '@robustswap-libs/uikit'
import BigNumber from 'bignumber.js'
import {
  useMasterChefBalance,
  useMaximumSupply,
  useMintedSupply,
  useMintedBurned,
  useTaxTotal,
  useRbsPerBlock,
  useRbsAmountFromLP,
  useTotalSupply
} from 'hooks/useTokenBalance'
import useI18n from 'hooks/useI18n'
import { getRbsAddress } from 'utils/addressHelpers'
import CardValue from './CardValue'
import { getBalanceNumber } from '../../../utils/formatBalance'
import { useTotalLockedUpRewards } from '../../../hooks/useFarmsWithBalance'

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
  font-size: 16px;
  justify-content: space-between;
  padding-right:16px;
`
const SupplyStatsCard = () => {
  const TranslateString = useI18n()
  const rbsBusd = useRbsAmountFromLP("0x4f8FD7B0A83E506d022d45ce0913BDD89596cf25")
  const rbsBnb = useRbsAmountFromLP("0x4B09CEA647a1029472f309fb633356b929D50714")
  const rbsTaxed = useRbsAmountFromLP(getRbsAddress())
  const maximumSupply = useMaximumSupply()
  const mintedSupply = useMintedSupply()
  const mintedBurned = useMintedBurned()
  const totalSupply = useTotalSupply()
  const masterChefBalance = useMasterChefBalance(getRbsAddress())
  const totalLocked = useTotalLockedUpRewards()
  const taxTotal = useTaxTotal()
  const rbsPerBlock = useRbsPerBlock()
  const circSupply = totalSupply
    ? totalSupply.minus(rbsTaxed.plus(masterChefBalance).plus(rbsBnb).plus(rbsBusd))
    : new BigNumber(0)
  const cakeSupply = getBalanceNumber(circSupply)
  const isMobile = useMedia('(max-width: 760px)')

  // const volumeUSD = data ? new BigNumber(data?.data?.volume_USD) : ZERO

  return (
    <Grid container spacing={2} style={{ paddingLeft: 0 }}>
      <Grid item sm={6} xs={12} style={{ padding: 0 }}>
        <StyledSupplyStatsCard style={{ borderTopLeftRadius: 16, borderTopRightRadius: isMobile ? 16 : 0 }}>
          <Row>
            {TranslateString(10030, "Maximum")}
            <CardValue fontSize="16px" value={getBalanceNumber(maximumSupply, 18)} decimals={0} />
          </Row>
        </StyledSupplyStatsCard>
      </Grid>
      <Grid item sm={6} xs={12} style={{ padding: 0 }}>
        <StyledSupplyStatsCard style={{ borderTopRightRadius: isMobile ? 0 : 16 }}>
          <Row>
            {TranslateString(536, "Minted")}
            <CardValue fontSize="16px" value={getBalanceNumber(mintedSupply)} decimals={0} />
          </Row>
        </StyledSupplyStatsCard>
      </Grid>
      <Grid item sm={6} xs={12} style={{ padding: 0 }}>
        <StyledSupplyStatsCard>
          <Row>
            {TranslateString(686, "Liquidity")}
            <CardValue fontSize="16px" value={getBalanceNumber(rbsBusd.plus(rbsBnb))} decimals={2} />
          </Row>
        </StyledSupplyStatsCard>
      </Grid>
      <Grid item sm={6} xs={12} style={{ padding: 0 }}>
        <StyledSupplyStatsCard>
          <Row>
            {TranslateString(329, 'Staked')}
            <CardValue fontSize="16px" value={getBalanceNumber(masterChefBalance)} decimals={0} />
          </Row>
        </StyledSupplyStatsCard>
      </Grid>
      <Grid item sm={6} xs={12} style={{ padding: 0 }}>
        <StyledSupplyStatsCard>
          <Row>
            {TranslateString(10004, "Circulation")}
            <CardValue fontSize="16px" value={cakeSupply} decimals={2} />
          </Row>
        </StyledSupplyStatsCard>
      </Grid>
      <Grid item sm={6} xs={12} style={{ padding: 0 }}>
        <StyledSupplyStatsCard>
          <Row>
            {TranslateString(10033, "Taxed")}
            <CardValue fontSize="16px" value={getBalanceNumber(taxTotal)} decimals={0} />
          </Row>
        </StyledSupplyStatsCard>
      </Grid>
      <Grid item sm={6} xs={12} style={{ padding: 0 }}>
        <StyledSupplyStatsCard style={{ borderBottomLeftRadius: isMobile ? 0 : 16 }}>
          <Row>
            {TranslateString(302, "Emission Per Block")}
            <CardValue fontSize="16px" value={rbsPerBlock.div(new BigNumber(10 ** 18)).toNumber()} decimals={2} />
          </Row>
        </StyledSupplyStatsCard>
      </Grid>
      <Grid item sm={6} xs={12} style={{ padding: 0 }}>
        <StyledSupplyStatsCard style={{ borderBottomLeftRadius: isMobile ? 16 : 0, borderBottomRightRadius: 16 }}>
          <Row>
            {TranslateString(538, 'Burned')}
            <CardValue fontSize="16px" value={getBalanceNumber(mintedBurned, 0)} decimals={0} />
          </Row>
        </StyledSupplyStatsCard>
      </Grid>
    </Grid >
  )
}

export default SupplyStatsCard