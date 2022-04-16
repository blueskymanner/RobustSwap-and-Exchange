import React, { useState, useCallback } from 'react'
import { useMedia } from 'react-use'
import styled from 'styled-components'
import { Card, CardBody, Button } from '@robustswap-libs/uikit'
import BigNumber from 'bignumber.js'
import useI18n from 'hooks/useI18n'
import { useAllHarvest } from 'hooks/useHarvest'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import UnlockButton from 'components/UnlockButton'
import CakeHarvestBalance from './CakeHarvestBalance'
import CakeWalletBalance from './CakeWalletBalance'
import { usePriceRbsBusd } from '../../../state/hooks'
import useTokenBalance from '../../../hooks/useTokenBalance'
import { getRbsAddress } from '../../../utils/addressHelpers'
import useAllEarnings from '../../../hooks/useAllEarnings'
import { getBalanceNumber } from '../../../utils/formatBalance'
import CardBusdValue from './CardBusdValue'
import { useCurrentTime } from '../../../hooks/useTimer'
import getTimePeriods from '../../../utils/getTimePeriods'
import { formatTimePeriodCountdown } from '../../../utils/formatTimePeriod'

const StyledFarmStakingCard = styled(Card)`
  background-color: #293D71;
  background-image: url('/images/farm-staking-bg.svg'), linear-gradient(90.04deg, #0C0720 0.04%, #291A83 99.97%);;
  background-repeat: no-repeat;
  background-position: top right;
`

const Block = styled.div`
  margin-bottom: 16px;
`

const Label = styled.div`
  background:linear-gradient(to bottom, #89FFE3, #BEFF74, #BEFF74);
  -webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
  font-size: 34px;
  font-weight: 600;
  line-height: 40px;
  letter-spacing: 0.5px;
`

const Actions = styled.div`
  margin-top: 24px;
`

const FarmedStakingCard = () => {
  const [pendingTx, setPendingTx] = useState(false)
  const { account } = useActiveWeb3React()
  const TranslateString = useI18n()
  const farmsWithBalance = useFarmsWithBalance()
  const rbsBalance = getBalanceNumber(useTokenBalance(getRbsAddress()))
  const rbsPrice = usePriceRbsBusd().toNumber()
  const allEarnings = useAllEarnings()
  const isMobile = useMedia('(max-width: 760px)')
  const earningsSum = allEarnings.reduce((accum, earning) => {
    return accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
  }, 0)
  const balancesWithValue = farmsWithBalance.filter((balanceType) => balanceType.balance.toNumber() > 0)

  // Get farms can harvest and closet harvest time
  const currentTime = Math.floor(useCurrentTime() / 1000)
  const farmsCanHarvest = balancesWithValue.filter(
    (farm) => farm.nextHarvestUntil <= currentTime && farm.nextHarvestUntil > 0,
  )

  const closetHarvestTime = balancesWithValue.reduce((time, farm) => {
    return time <= 0 || time >= farm.nextHarvestUntil ? farm.nextHarvestUntil : time
  }, 0)

  // Harvest button text display logic
  let harvestButtonText = 'HARVEST ALL'
  if (balancesWithValue.length > 0) {
    if (farmsCanHarvest.length === balancesWithValue.length) {
      harvestButtonText = `HARVEST ALL (${balancesWithValue.length})`
    } else if (farmsCanHarvest.length > 0 && farmsCanHarvest.length < balancesWithValue.length) {
      harvestButtonText = `HARVEST ALL (${farmsCanHarvest.length} of ${balancesWithValue.length})`
    } else if (farmsCanHarvest.length <= 0 && balancesWithValue.length > 0) {
      const secondsUntilHarvest = closetHarvestTime - currentTime
      const timeUntil = getTimePeriods(secondsUntilHarvest)
      harvestButtonText = `HARVEST IN ${formatTimePeriodCountdown(timeUntil)}`
    }
  }

  const { onReward } = useAllHarvest(farmsCanHarvest.map((farmWithBalance) => farmWithBalance.pid))

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true)
    try {
      await onReward()
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    } finally {
      setPendingTx(false)
    }
  }, [onReward])

  return (
    <StyledFarmStakingCard style={{ width: isMobile ? '100%' : '320px' }}>
      <CardBody style={{ padding: 32 }}>
        <Label>{TranslateString(544, 'Farms & Staking')}</Label>
        <Block style={{ display: 'flex', marginTop: 24 }}>
          <div style={{ width: '50%' }}>
            <h5 style={{ fontSize: 12, lineHeight: '14px', color: '#E354FA' }}>RBS to Harvest</h5>
            <CakeHarvestBalance earningsSum={earningsSum} />
            <CardBusdValue value={rbsPrice * earningsSum} decimals={3} />
          </div>
          <div style={{ width: '50%' }}>
            <h5 style={{ fontSize: 12, lineHeight: '14px', color: '#E354FA' }}>RBS in Wallet</h5>
            <CakeWalletBalance rbsBalance={rbsBalance} />
            <CardBusdValue value={rbsPrice * rbsBalance} decimals={3} />
          </div>
        </Block>
        <Actions>
          {account ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Button
                variant="subtle"
                id="harvest-all"
                disabled={balancesWithValue.length <= 0 || farmsCanHarvest.length <= 0 || pendingTx}
                onClick={harvestAllFarms}
                fullWidth
                style={{
                  background: 'linear-gradient(89.57deg, #89FFE3 0.25%, #BEFF74 53.04%, #FFF174 96.52%)',
                  color: '#5F47EE',
                  opacity: (balancesWithValue.length <= 0 || farmsCanHarvest.length <= 0 || pendingTx) ? 0.4 : 1
                }}
              >
                {pendingTx ? TranslateString(548, 'HARVESTING RBS') : TranslateString(999, harvestButtonText)}
              </Button>
              {/* <StyledLink to='/account'>
                VIEW DETAIL
              </StyledLink> */}
            </div>
          ) : (
            <UnlockButton fullWidth variant="primary" />
          )}
        </Actions>
      </CardBody >
    </StyledFarmStakingCard >
  )
}

export default FarmedStakingCard
