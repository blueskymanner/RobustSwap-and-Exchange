import React from 'react'
import { Button, useWalletModal } from '@robustswap-libs/uikit'
import useAuth from 'hooks/useAuth'

const UnlockButton = (props) => {

  // const TranslateString = useI18n()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, "0px", logout)
  const self = props
  const text = self.title ? self.title : 'UNLOCK WALLET'

  return (
    <Button variant="subtle" onClick={onPresentConnectModal} {...props}>
      {text}
    </Button>
  )
}

export default UnlockButton
