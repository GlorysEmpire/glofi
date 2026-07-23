/**
 * Contract descriptors: address + ABI for ethers / viem / mobile SDKs.
 */
import { ADDRESSES } from './addresses'
import GlofiTokenABI from './abis/GlofiToken.json'
import GlofiPoolABI from './abis/GlofiPool.json'
import GlofiChallengeABI from './abis/GlofiChallenge.json'
import GlofiPayoutABI from './abis/GlofiPayout.json'
import ProxyGovernanceABI from './abis/ProxyGovernance.json'

export const CONTRACTS = {
  GlofiToken: {
    address: ADDRESSES.GlofiToken,
    abi: GlofiTokenABI,
  },
  GlofiPool: {
    address: ADDRESSES.GlofiPool,
    abi: GlofiPoolABI,
  },
  GlofiChallenge: {
    address: ADDRESSES.GlofiChallenge,
    abi: GlofiChallengeABI,
  },
  GlofiPayout: {
    address: ADDRESSES.GlofiPayout,
    abi: GlofiPayoutABI,
  },
  ProxyGovernance: {
    address: ADDRESSES.ProxyGovernance,
    abi: ProxyGovernanceABI,
  },
} as const

export type ContractsMap = typeof CONTRACTS
