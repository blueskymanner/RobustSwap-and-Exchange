import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { getMasterChefAddress } from './addressHelpers'

export const approve = async (lpContract, masterChefContract, account) => {
  return lpContract
    .approve(getMasterChefAddress(), ethers.constants.MaxUint256)
}

export const stake = async (masterChefContract, pid, amount, account, referrer) => {
  const tx = await masterChefContract
    .deposit(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(), referrer)
  const res = await tx.wait()
  return res.hash
}

export const sousStake = async (sousChefContract, amount, account) => {
  const tx = await sousChefContract
    .deposit(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
  const res = await tx.wait()
  return res.hash
}

export const sousStakeBnb = async (sousChefContract, amount, account) => {
  const tx = await sousChefContract
    .deposit()
  const res = await tx.wait()
  return res.hash
}

export const unstake = async (masterChefContract, pid, amount, account) => {
  const tx = await masterChefContract
    .withdraw(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
  const res = await tx.wait()

  return res.hash
}

export const sousUnstake = async (sousChefContract, amount, account) => {
  // shit code: hard fix for old CTK and BLK
  if (sousChefContract.options.address === '0x3B9B74f48E89Ebd8b45a53444327013a2308A9BC') {
    const tx = await sousChefContract
      .emergencyWithdraw()
    const res = await tx.wait()
    return res.hash
  }
  if (sousChefContract.options.address === '0xBb2B66a2c7C2fFFB06EA60BeaD69741b3f5BF831') {
    const tx = await sousChefContract
      .emergencyWithdraw()
    const res = await tx.wait()
    return res.hash
  }
  const tx = await sousChefContract
    .withdraw(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
  const res = await tx.wait()
  return res.hash
}

export const sousEmegencyUnstake = async (sousChefContract, amount, account) => {
  const tx = await sousChefContract
    .emergencyWithdraw()
  const res = await tx.wait()
  return res.hash
}

export const harvest = async (masterChefContract, pid, account) => {
  const tx = await masterChefContract
    .deposit(pid, '0', '0x0000000000000000000000000000000000000000')
  const res = await tx.wait()
  return res.hash
}

export const soushHarvest = async (sousChefContract, account) => {
  const tx = await sousChefContract
    .deposit('0')
  const res = await tx.wait()
  return res.hash
}

export const soushHarvestBnb = async (sousChefContract, account) => {
  const tx = sousChefContract
    .deposit()
  const res = await tx.wait()
  return res.hash
}
