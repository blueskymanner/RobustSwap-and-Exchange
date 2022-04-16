import React, { useEffect, useState } from 'react'
import { useMedia } from 'react-use'
import styled from 'styled-components'
import { Heading, Text } from '@robustswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import { usePriceRbsBusd, usePriceRbtBusd, useReferralCode } from 'state/hooks'
import useGetDocumentTitlePrice from 'hooks/useGetDocumentTitlePrice'
import FarmStakingCard from './components/FarmStakingCard'
import LotteryCard from './components/LotteryCard'
import FarmJoinCard from './components/FarmJoinCard'
import CakeStats from './components/CakeStats'
import DexStatsCard from './components/DexStatsCard'
import SupplyStatsCard from './components/SupplyStatsCard'
import LimitStatsCard from './components/LimitStatsCard'
import ActivitiesCard from './components/ActivitiesCard'
import FollowStatsCard from './components/FollowStatsCard'
import 'assets/css/chart.css'

const Hero = styled.div<{ isMobile: boolean }>`
  background-image: ${({ isMobile }) => isMobile ? "url('/images/header-welcome-bg-mobile.svg')" : "url('/images/header-welcome-bg.png')"};
  background-position: center, center;
  background-size: cover;
  background-repeat: no-repeat;
  margin-bottom: 25px;
  margin-top: ${({ isMobile }) => isMobile ? "-15px" : "0px"};

  height: ${({ isMobile }) => isMobile ? "320px" : "360px"};
  padding-top: ${({ isMobile }) => isMobile ? "40px" : "0px"};
`
const StyledHeading = styled(Heading) <{ isMobile: boolean }>`
  font-weight: 800;
  font-size: ${({ isMobile }) => isMobile ? "48px" : "72px"};
  line-height: ${({ isMobile }) => isMobile ? "48px" : "80px"};
  letter-spacing: -0.5px;
  color: #FCFCFC;
  width: ${({ isMobile }) => isMobile ? "343px" : "543px"};
  margin-left: ${({ isMobile }) => isMobile ? "24px" : "80px"};
  margin-top: 24px;
`
const SubTitle = styled(Text) <{ isMobile: boolean }>`
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  color: #FCFCFC;
  width: ${({ isMobile }) => isMobile ? "343px" : "543px"};
  margin-left: ${({ isMobile }) => isMobile ? "24px" : "80px"};
  margin-top: 16px;
`
const LogTitle = styled(Text)`
  font-weight: 300;
  font-size: 12px;
  line-height: 14px;
  color: #FCFCFC;
`
const LogPrice = styled(Text)`
  fontWeight: 300;
  fontSize: 16px;
  line-height: 24px;
  color: #FCFCFC;
  margin-right: 16px;
`
const Home: React.FC = () => {

  useGetDocumentTitlePrice('Home')
  const TranslateString = useI18n()
  const [height, setHeight] = useState(0)
  useReferralCode()
  const isMobile = useMedia('(max-width: 970px)')
  const rbsPrice = usePriceRbsBusd().toFixed(2)
  const rbtPrice = usePriceRbtBusd().toFixed(2)

  useEffect(() => {
    const leftTab = document.getElementsByClassName("leftTab")[0]
    const stakingCard = document.getElementsByClassName("staking")[0]
    const joinCard = document.getElementsByClassName("join")[0]
    setHeight(leftTab?.clientHeight - stakingCard?.clientHeight - joinCard?.clientHeight - 96)
  }, [isMobile])

  return (
    <div style={{ paddingBottom: isMobile ? 64 : 0 }}>
      <Hero isMobile={isMobile}>
        {!isMobile && <div style={{ display: 'flex', alignItems: 'center', padding: '18px 48px 16px 40px' }}>
          <div>
            <LogTitle>
              RBS
            </LogTitle>
            <LogPrice>
              ${rbsPrice}
            </LogPrice>
          </div>
          <div style={{ height: '38px', borderRight: '1px solid #E2E9EF', display: 'block' }}>
          </div>
          <div style={{ marginLeft: 16 }}>
            <LogTitle>
              RBT
            </LogTitle>
            <LogPrice>
              ${rbtPrice}
            </LogPrice>
          </div>
        </div>}
        <StyledHeading isMobile={isMobile}>
          {TranslateString(576, 'Welcome to ROBUSTSWAP')}
        </StyledHeading>
        <SubTitle isMobile={isMobile}>
          {TranslateString(578, 'A hyper-deflationary decentralized exchange with yield farming designed to optimize profitability.')}
        </SubTitle>
      </Hero>
      <Page style={{ marginLeft: isMobile ? '24px' : '80px', marginRight: isMobile ? '24px' : '80px' }}>
        <div style={{ justifyContent: 'center', display: 'flex' }}>
          <div className="leftTab" style={{ flexGrow: 1 }}>
            <div>
              <DexStatsCard />
              <CakeStats />
            </div>
            <div style={{ marginBottom: 32 }}>
              <ActivitiesCard />
            </div>
            {isMobile && <FarmJoinCard />}
            <div style={{ marginBottom: 48 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#A0B9FB', paddingBottom: 16 }}>{TranslateString(733, 'RBS Supply Stats')}</Text>
              <SupplyStatsCard />
            </div>
            <div style={{ marginBottom: isMobile ? 48 : 0 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#A0B9FB', paddingBottom: 16 }}>{TranslateString(731, 'RBS Transaction Limit')}</Text>
              <LimitStatsCard />
            </div>
            {isMobile && <div>
              <FollowStatsCard height={460} />
            </div>}
          </div>
          {!isMobile && <div style={{
            flexGrow: 0,
            marginLeft: "16px"
          }}>
            <div className="staking" style={{ opacity: 1, marginBottom: 48 }}>
              <FarmStakingCard />
            </div>
            <div className="join" style={{ opacity: 1, marginBottom: 48 }}>
              <LotteryCard />
            </div>
            <div className="twitter">
              <FollowStatsCard height={height} />
            </div>
          </div>}
        </div>
      </Page >
    </div >
  )
}

export default Home
