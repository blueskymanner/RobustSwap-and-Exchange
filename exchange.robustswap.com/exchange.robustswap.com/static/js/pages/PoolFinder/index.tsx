import { Currency, ETHER, JSBI, TokenAmount } from '@pancakeswap/sdk'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, ChevronDownIcon, AddNoRoundIcon, CardBody, Text } from '@robustswap-libs/uikit'
import CardNav from 'components/CardNav'
import { LightCard } from 'components/Card'
import { AutoColumn, ColumnCenter } from 'components/Column'
import CurrencyLogo from 'components/CurrencyLogo'
import { FindPoolTabs } from 'components/NavigationTabs'
import { MinimalPositionCard } from 'components/PositionCard'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import { PairState, usePair } from 'data/Reserves'
import { useActiveWeb3React } from 'hooks'
import { usePairAdder } from 'state/user/hooks'
import { useTokenBalance } from 'state/wallet/hooks'
import { StyledInternalLink } from 'components/Shared'
import { TranslateString } from 'utils/translateTextHelpers'
import { currencyId } from 'utils/currencyId'
import TranslatedText from 'components/TranslatedText'
import AppBody from '../AppBody'
import { Dots } from '../Pool/styleds'

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1
}

export default function PoolFinder() {
  const { account } = useActiveWeb3React()

  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)

  const [currency0, setCurrency0] = useState<Currency | null>(ETHER)
  const [currency1, setCurrency1] = useState<Currency | null>(null)

  const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined)
  const addPair = usePairAdder()
  useEffect(() => {
    if (pair) {
      addPair(pair)
    }
  }, [pair, addPair])

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
      pair &&
      JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
      JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0))
    )

  const position: TokenAmount | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken)
  const hasPosition = Boolean(position && JSBI.greaterThan(position.raw, JSBI.BigInt(0)))

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency)
      } else {
        setCurrency1(currency)
      }
    },
    [activeField]
  )

  const handleSearchDismiss = useCallback(() => {
    setShowSearch(false)
  }, [setShowSearch])

  const prerequisiteMessage = (
    <LightCard padding="45px 10px">
      <Text style={{ textAlign: 'center' }}>
        {!account ? TranslateString(320, 'Connect to a wallet to find pools') : TranslateString(321, 'Select a token to find your liquidity.')}
      </Text>
    </LightCard>
  )

  return (
    <>
      <CardNav activeIndex={1} />
      <AppBody>
        <FindPoolTabs />
        <CardBody>
          <AutoColumn gap="md">
            <Button
              variant="secondary"
              onClick={() => {
                setShowSearch(true)
                setActiveField(Fields.TOKEN0)
              }}
              startIcon={currency0 ? <CurrencyLogo currency={currency0} style={{ marginRight: '.5rem' }} /> : null}
              endIcon={<ChevronDownIcon width="24px" />}
              fullWidth
            >
              {currency0 ? currency0.symbol : <TranslatedText translationId={322}>Select a Token</TranslatedText>}
            </Button>

            <ColumnCenter>
              <AddNoRoundIcon />
            </ColumnCenter>

            <Button
              variant="secondary"
              onClick={() => {
                setShowSearch(true)
                setActiveField(Fields.TOKEN1)
              }}
              startIcon={currency1 ? <CurrencyLogo currency={currency1} style={{ marginRight: '.5rem' }} /> : null}
              endIcon={<ChevronDownIcon width="24px" />}
              fullWidth
            >
              {currency1 ? currency1.symbol : <TranslatedText translationId={322}>Select a Token</TranslatedText>}
            </Button>

            {hasPosition && (
              <ColumnCenter
                style={{ justifyItems: 'center', backgroundColor: '', padding: '12px 0px', borderRadius: '12px' }}
              >
                <Text style={{ textAlign: 'center' }}>
                  {TranslateString(323, "Pool Found!")}
                </Text>
              </ColumnCenter>
            )}

            {currency0 && currency1 ? (
              pairState === PairState.EXISTS ? (
                hasPosition && pair ? (
                  <MinimalPositionCard pair={pair} />
                ) : (
                  <LightCard padding="45px 10px">
                    <AutoColumn gap="sm" justify="center">
                      <Text style={{ textAlign: 'center' }}>
                        {TranslateString(324, "You don’t have liquidity in this pool yet.")}
                      </Text>
                      <Button>
                        <StyledInternalLink to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                          <Text style={{ textAlign: 'center' }}>
                            <TranslatedText translationId={296}>Add Liquidity</TranslatedText>
                          </Text>
                        </StyledInternalLink>
                      </Button>
                    </AutoColumn>
                  </LightCard>
                )
              ) : validPairNoLiquidity ? (
                <LightCard padding="45px 10px">
                  <AutoColumn gap="sm" justify="center">
                    <Text style={{ textAlign: 'center' }}>
                      {TranslateString(301, "No pool found.")}</Text>
                    <StyledInternalLink to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                      {TranslateString(326, "Create pool.")}
                    </StyledInternalLink>
                  </AutoColumn>
                </LightCard>
              ) : pairState === PairState.INVALID ? (
                <LightCard padding="45px 10px">
                  <AutoColumn gap="sm" justify="center">
                    <Text style={{ textAlign: 'center' }}>
                      <TranslatedText translationId={328}>Invalid pair.</TranslatedText>
                    </Text>
                  </AutoColumn>
                </LightCard>
              ) : pairState === PairState.LOADING ? (
                <LightCard padding="45px 10px">
                  <AutoColumn gap="sm" justify="center">
                    <Text style={{ textAlign: 'center' }}>
                      {TranslateString(299, "Loading")}
                      <Dots />
                    </Text>
                  </AutoColumn>
                </LightCard>
              ) : null
            ) : (
              prerequisiteMessage
            )}
          </AutoColumn>

          <CurrencySearchModal
            isOpen={showSearch}
            onCurrencySelect={handleCurrencySelect}
            onDismiss={handleSearchDismiss}
            showCommonBases
            selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
          />
        </CardBody>
      </AppBody>
    </>
  )
}
