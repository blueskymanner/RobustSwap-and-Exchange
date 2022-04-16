import React from 'react'
import { useMedia } from 'react-use'
import styled from 'styled-components'
import { Card, CardBody, Button } from '@robustswap-libs/uikit'
import useI18n from 'hooks/useI18n'
// import CakeWinnings from './CakeWinnings'

const StyledLotteryCard = styled(Card)`
  background: linear-gradient(90.04deg, #0C0720 0.04%, #291A83 99.97%);
  background-repeat: no-repeat;
  background-position: top right;
  border-radius: 16px;
  width: 100%;
`

const Block = styled.div`
  margin-bottom: 16px;
`

const Label = styled.div`
  color: #FCFCFC;
  text-align: center;
  font-size: 20px;
  line-height: 24px;
  font-weight: 800;
  letter-spacing: 0.5px;
`

const FarmedStakingCard = () => {
  const TranslateString = useI18n()
  const isMobile = useMedia('(max-width: 760px)')

  return (
    <StyledLotteryCard style={{ maxWidth: isMobile ? '100%' : '320px' }}>
      <CardBody>
        <Block>
          <Label>{TranslateString(554, 'Join the revolution with the Robust Protocol community.')}</Label>
        </Block>
        <Button style={{ width: '100%', marginTop: isMobile ? 48 : 16 }} as="a" href="https://exchange.robustswap.com/#/swap?outputCurrency=0x95336aC5f7E840e7716781313e1607F7C9D6BE25">
          {TranslateString(558, "BUY")} RBS
        </Button>
        <Button style={{ width: '100%', marginTop: 16 }} as="a" href="https://exchange.robustswap.com/#/swap?outputCurrency=0x891e4554227385c5c740f9b483e935e3cbc29f01">
          {TranslateString(558, "BUY")} RBT
        </Button>
      </CardBody>
    </StyledLotteryCard>
  )
}

export default FarmedStakingCard
