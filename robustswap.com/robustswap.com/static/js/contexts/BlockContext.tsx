import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React, { useState, useEffect, useRef } from 'react'

const BlockContext = React.createContext(0)

const BlockContextProvider = ({ children }) => {
  const previousBlock = useRef(0)
  const [block, setBlock] = useState(0)
  const { library } = useActiveWeb3React()

  useEffect(() => {
    const interval = setInterval(async () => {
      const blockNumber = await library.getBlockNumber()
      if (blockNumber !== previousBlock.current) {
        previousBlock.current = blockNumber
        setBlock(blockNumber)
      }
    }, 6000)

    return () => clearInterval(interval)
  }, [library])

  return <BlockContext.Provider value={block}>{children}</BlockContext.Provider>
}

export { BlockContext, BlockContextProvider }
