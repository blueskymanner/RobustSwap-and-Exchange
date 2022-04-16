import { useEffect } from 'react'
import { usePriceRbsBusd } from 'state/hooks'

const useGetDocumentTitlePrice = (page: string) => {
  const rbsPriceUsd = usePriceRbsBusd()

  const rbsPriceUsdString = rbsPriceUsd.eq(0)
    ? ''
    : `$${rbsPriceUsd.toNumber().toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`

  useEffect(() => {
    document.title = `RobustSwap | ${rbsPriceUsdString} | ${page}`
  }, [rbsPriceUsdString, page])
}
export default useGetDocumentTitlePrice
