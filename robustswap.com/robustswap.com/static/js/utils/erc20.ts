import Web3 from 'web3'
import { provider as ProviderType } from 'web3-core'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { ethers } from 'ethers'
import erc20 from 'config/abi/erc20.json'

export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

export const getContract = (provider: Web3Provider, address: string, account: string) => {
  const contract = new ethers.Contract(address, erc20, getProviderOrSigner(provider, account) as any)
  return contract
}

export const getAllowance = async (
  lpContract: Contract,
  masterChefContract: Contract,
  account: string,
): Promise<string> => {
  try {
    const allowance: string = await lpContract.allowance(account, masterChefContract.options.address)
    return allowance
  } catch (e) {
    return '0'
  }
}

export const getTokenBalance = async (
  provider: Web3Provider,
  tokenAddress: string,
  userAddress: string,
): Promise<string> => {
  const contract = getContract(provider, tokenAddress, userAddress)
  try {
    const balance: string = await contract.balanceOf(userAddress)
    return balance
  } catch (e) {
    return '0'
  }
}
