import Hashids from 'hashids'
import Web3 from 'web3'
import { getRbsAddress } from './addressHelpers'

const hashids = new Hashids(getRbsAddress(), 0, '0123456789abcdefghijklmnopqrstuvwxyz')

export const accountToReferralCode = (account: string) => {
  return account ? hashids.encodeHex(account.substring(2)) : null
}

export const referralCodeToAccount = (referralCode: string) => {
  const hex = hashids.decodeHex(referralCode)
  if (Web3.utils.isAddress(hex)) {
    return Web3.utils.toChecksumAddress(hex)
  }

  return null
}
