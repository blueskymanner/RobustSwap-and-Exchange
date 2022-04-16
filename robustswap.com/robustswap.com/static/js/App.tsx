import React, { useEffect, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ResetCSS } from '@robustswap-libs/uikit'
import { ConnectorNames } from 'utils/web3React'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useAuth from 'hooks/useAuth'
import BigNumber from 'bignumber.js'
import { useFetchPublicData } from 'state/hooks'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import PageLoader from './components/PageLoader'
import useGetDocumentTitlePrice from './hooks/useGetDocumentTitlePrice'


// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page'
const Home = lazy(() => import('./views/Home'))
const Farms = lazy(() => import('./views/Farms'))
const NotFound = lazy(() => import('./views/NotFound'))
const Referrals = lazy(() => import('./views/Referrals'))
const Account = lazy(() => import('./views/Account'))

// This config is required for number formating
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  const { login } = useAuth()
  const { account } = useActiveWeb3React()
  useEffect(() => {
    if (!account && window.localStorage.getItem('accountStatus')) {
      login(ConnectorNames.Injected)
    }
  }, [account, login])

  useFetchPublicData()
  useGetDocumentTitlePrice('Home')

  return (
    <Router>
      <ResetCSS />
      <GlobalStyle />
      <Menu>
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/farms">
              <Farms />
            </Route>
            <Route path="/pools">
              <Farms tokenMode />
            </Route>
            <Route path="/referrals" exact>
              <Referrals />
            </Route>
            <Route path="/account">
              <Account />
            </Route>
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </Menu>
    </Router>
  )
}

export default React.memo(App)
