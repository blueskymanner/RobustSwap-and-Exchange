import React from 'react'
import { Card, CardBody } from '@robustswap-libs/uikit'
import styled from 'styled-components'
import { Timeline } from 'react-twitter-widgets'
// import useI18n from 'hooks/useI18n'

const StyledTwitterCard = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  background-color: #151745;
  border: 8px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  overflow-y: scroll;
`

interface TwitterProps {
  height: number
  isMobile: boolean
}

const TwitterCard: React.FC<TwitterProps> = ({ height = 0, isMobile }) => {

  return (
    <StyledTwitterCard style={{ maxHeight: height <= 0 ? 'auto' : height }}>
      <CardBody>
        <Timeline
          dataSource={{
            sourceType: 'profile',
            screenName: 'RobustProtocol',
          }}
          options={{
            chrome: 'transparent, noheader, nofooter, noscrollbar',
            theme: 'dark',
            borderColor: '#1f2432',
          }}
        />
      </CardBody>
    </StyledTwitterCard>
  )
}

export default TwitterCard
