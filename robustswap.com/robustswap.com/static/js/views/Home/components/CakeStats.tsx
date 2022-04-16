import React from 'react'
import { Card } from '@robustswap-libs/uikit'
import styled from 'styled-components'
import ChartComp from './ChartComp'

const StyledCakeStats = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  background: #1E215C;
  margin-bottom: 24px;
  min-height: 595px !important;
  margin-top: 24px;
`

const CakeStats = () => {

  return (
    <StyledCakeStats>
      <ChartComp />
    </StyledCakeStats>
  )
}

export default CakeStats
