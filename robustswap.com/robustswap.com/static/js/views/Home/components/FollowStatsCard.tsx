import React from 'react'
import { useMedia } from 'react-use'
import styled from 'styled-components'
import { Card } from '@robustswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import TwitterCard from './TwitterCard'

const StyledLimitStatsCard = styled(Card) <{ height: string, isMobile: boolean }>`
  width: 100%;
  max-width: ${({ isMobile }) => isMobile ? '' : '320px !important'};
  border-radius: 16px;
  background: #1E215C;
  padding: 16px;
  height: ${({ height }) => height};
`

const LabelTitle = styled.div`
  margin-bottom:8px;
  color: #A0B9FB;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
`

const LabelSubTitle = styled.div`
  margin-bottom:8px;
  color: #FCFCFC;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
`

interface LimitProps {
  height: number
}

const LimitStatsCard: React.FC<LimitProps> = ({ height = 0 }) => {
  const TranslateString = useI18n()
  const isMobile = useMedia('(max-width: 970px)')

  return (
    <StyledLimitStatsCard height={height <= 0 ? 'auto' : `${height}px`} isMobile={isMobile}>
      <LabelTitle>{TranslateString(10039, 'Follow us on twitter')}</LabelTitle>
      <LabelSubTitle>@robustprotocol</LabelSubTitle>
      <TwitterCard height={height <= 0 ? 0 : height - 90} isMobile={isMobile} />
    </StyledLimitStatsCard>
  )
}

export default LimitStatsCard