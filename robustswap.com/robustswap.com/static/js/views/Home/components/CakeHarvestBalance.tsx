import React from 'react'
import { Text } from '@robustswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import CardValue from './CardValue'

const CakeHarvestBalance = ({ earningsSum }) => {
  const TranslateString = useI18n()
  const { account } = useActiveWeb3React()

  if (!account) {
    return (
      <Text color="textDisabled" fontSize="18px" style={{ color: '#767676', lineHeight: '22px' }}>
        {TranslateString(298, 'Locked')}
      </Text>
    )
  }

  return <CardValue value={earningsSum} fontSize="34px" />
}

export default CakeHarvestBalance
