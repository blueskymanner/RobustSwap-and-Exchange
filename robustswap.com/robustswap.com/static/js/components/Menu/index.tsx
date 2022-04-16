import React, { useContext } from 'react'
import { allLanguages } from 'config/localisation/languageCodes'
import { LanguageContext } from 'contexts/Localisation/languageContext'
import useAuth from 'hooks/useAuth'
import useTheme from 'hooks/useTheme'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { usePriceRbsBusd, usePriceRbtBusd } from 'state/hooks'
import { Menu as UikitMenu } from '@robustswap-libs/uikit'
import config from './config'
import configtw from './configtw'
import configcn from './configcn'

const Menu = (props) => {
  const { login, logout } = useAuth()
  const { account } = useActiveWeb3React()
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext)
  const { isDark, toggleTheme } = useTheme()
  const rbsPriceUsd = usePriceRbsBusd()
  const rbtPrice = usePriceRbtBusd()
  let links = config;
  if (selectedLanguage.code === 'zh-CN') {
    links = configcn;
  }
  else if (selectedLanguage.code === 'zh-TW') {
    links = configtw;
  }

  return (
    <UikitMenu
      account={account}
      login={login}
      logout={logout}
      isDark={isDark}
      toggleTheme={toggleTheme}
      langs={allLanguages}
      setLang={setSelectedLanguage}
      currentLang={selectedLanguage && selectedLanguage.code}
      rbsPriceUsd={rbsPriceUsd}
      rbsPriceLink="https://bscscan.com/token/0x95336aC5f7E840e7716781313e1607F7C9D6BE25"
      rbtPriceUsd={rbtPrice}
      rbtPriceLink="https://bscscan.com/token/0x891e4554227385c5c740f9b483e935e3cbc29f01"
      links={links}
      {...props}
    />
  )
}

export default Menu
