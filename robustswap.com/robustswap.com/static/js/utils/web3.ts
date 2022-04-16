import Web3 from 'web3'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { HttpProviderOptions } from 'web3-core-helpers'
import { ethers } from 'ethers'
import { ContractOptions } from 'web3-eth-contract'
import getRpcUrl from 'utils/getRpcUrl'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

const RPC_URL = getRpcUrl()
const httpProvider = new Web3.providers.HttpProvider(RPC_URL, { timeout: 10000 } as HttpProviderOptions)

/**
 * Provides a web3 instance using our own private provider httpProver
 */

const getWeb3 = () => {
  const web3 = new Web3(httpProvider)
  return web3
}

function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

const getContract = (abi: any, address: string, library: Web3Provider, account: string) => {
  const contract = new ethers.Contract(address, abi, getProviderOrSigner(library, account) as any)
  return contract
}

export { getWeb3, getContract, httpProvider }
