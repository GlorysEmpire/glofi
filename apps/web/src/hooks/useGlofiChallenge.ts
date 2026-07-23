'use client'

/**
 * Challenge + payout interactions with GlofiChallenge / GlofiPayout.
 * Normalizes ethers Result structs so the dashboard never renders NaN (N1).
 */
import { useState } from 'react'
import { ethers } from 'ethers'
import {
  CONTRACTS,
  USDC_ADDRESS,
  CHALLENGE_TIERS,
  type TierKey,
} from '@glofi/sdk'
import {
  getEthereum,
  getReadProvider,
  errMsg,
  ensureAmoy,
  asBigInt,
  asNumber,
  formatUsdc,
} from '@/lib/web3'

// ─── Types ───────────────────────────────────────────────────────────────────

/** UI-ready challenge row (all human-readable amounts where needed). */
export type NormalizedChallenge = {
  id: string
  trader: string
  tier: number
  startTime: number
  accountSize: string // human USDC e.g. "100.0"
  accountSizeRaw: string
  challengeFee: string
  profitTarget: number // percent points e.g. 8
  maxDrawdown: number
  minTradingDays: number
  tradingDaysCompleted: number
  currentPnL: string
  status: number // 0 Active, 1 Passed, 2 Failed, 3 Closed
  funded: boolean
}

// ─── Normalization (fixes dashboard NaN) ─────────────────────────────────────

/**
 * Read a field by name first, then by ABI index.
 * ethers v6 Result supports both; named access is preferred.
 */
function pick(
  c: ethers.Result | Record<string, unknown>,
  name: string,
  index: number
): unknown {
  const rec = c as Record<string, unknown>
  if (rec[name] !== undefined && rec[name] !== null) return rec[name]
  return (c as ethers.Result)[index]
}

/**
 * Map raw getChallenge() return → stable object for React.
 * USDC fields use 6 decimals; percents stay as plain integers.
 */
export function normalizeChallenge(
  id: bigint | string | number,
  c: ethers.Result | Record<string, unknown>
): NormalizedChallenge {
  const accountSizeRaw = asBigInt(pick(c, 'accountSize', 3))
  const feeRaw = asBigInt(pick(c, 'challengeFee', 4))
  // currentPnL is int256 — keep absolute for display string
  const pnlRaw = asBigInt(pick(c, 'currentPnL', 9))
  const pnlAbs = pnlRaw < BigInt(0) ? -pnlRaw : pnlRaw

  return {
    id: id.toString(),
    trader: String(pick(c, 'trader', 0) ?? ''),
    tier: asNumber(pick(c, 'tier', 1)),
    startTime: asNumber(pick(c, 'startTime', 2)),
    accountSize: formatUsdc(accountSizeRaw),
    accountSizeRaw: accountSizeRaw.toString(),
    challengeFee: formatUsdc(feeRaw),
    profitTarget: asNumber(pick(c, 'profitTarget', 5)),
    maxDrawdown: asNumber(pick(c, 'maxDrawdown', 6)),
    minTradingDays: asNumber(pick(c, 'minTradingDays', 7)),
    tradingDaysCompleted: asNumber(pick(c, 'tradingDaysCompleted', 8)),
    currentPnL: formatUsdc(pnlAbs),
    status: asNumber(pick(c, 'status', 10)),
    funded: Boolean(pick(c, 'funded', 11)),
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useGlofiChallenge() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  /**
   * Approve USDC (if needed) then registerChallenge(tierId) on Amoy.
   * Returns tx hash on success, null on failure (error state set).
   */
  async function registerChallenge(tierKey: string) {
    try {
      setLoading(true)
      setError(null)
      setTxHash(null)

      if (!(tierKey in CHALLENGE_TIERS)) {
        setError('Invalid challenge tier.')
        return null
      }

      // Force Amoy before any wallet signature (N7)
      await ensureAmoy()

      const tier = CHALLENGE_TIERS[tierKey as TierKey]
      const provider = new ethers.BrowserProvider(getEthereum())
      const signer = await provider.getSigner()

      const usdcContract = new ethers.Contract(
        USDC_ADDRESS,
        [
          'function approve(address spender, uint256 amount) returns (bool)',
          'function allowance(address owner, address spender) view returns (uint256)',
        ],
        signer
      )

      const challengeContract = new ethers.Contract(
        CONTRACTS.GlofiChallenge.address,
        CONTRACTS.GlofiChallenge.abi,
        signer
      )

      const fee = tier.feeRaw
      const owner = await signer.getAddress()

      // Skip approve tx if allowance already covers the fee
      const current: bigint = await usdcContract.allowance(
        owner,
        CONTRACTS.GlofiChallenge.address
      )
      if (current < BigInt(fee)) {
        const approveTx = await usdcContract.approve(
          CONTRACTS.GlofiChallenge.address,
          fee
        )
        await approveTx.wait()
      }

      const tx = await challengeContract.registerChallenge(tier.id)
      await tx.wait()

      setTxHash(tx.hash)
      return tx.hash
    } catch (err: unknown) {
      setError(errMsg(err))
      return null
    } finally {
      setLoading(false)
    }
  }

  /** Read-only: pool has free liquidity for this tier. */
  async function canOpenChallenge(tierKey: string): Promise<boolean> {
    try {
      if (!(tierKey in CHALLENGE_TIERS)) return false
      const provider = await getReadProvider()
      const challengeContract = new ethers.Contract(
        CONTRACTS.GlofiChallenge.address,
        CONTRACTS.GlofiChallenge.abi,
        provider
      )
      const tierId = CHALLENGE_TIERS[tierKey as TierKey].id
      return await challengeContract.canOpenChallenge(tierId)
    } catch {
      return false
    }
  }

  /**
   * Load all challenges for a trader and normalize fields for the dashboard.
   * On RPC/ABI failure returns [] and logs — never throws into React.
   */
  async function getTraderChallenges(
    walletAddress: string
  ): Promise<NormalizedChallenge[]> {
    try {
      const provider = await getReadProvider()
      const challengeContract = new ethers.Contract(
        CONTRACTS.GlofiChallenge.address,
        CONTRACTS.GlofiChallenge.abi,
        provider
      )
      const challengeIds: bigint[] =
        await challengeContract.getTraderChallenges(walletAddress)
      if (!challengeIds?.length) return []

      const challengeDetails = await Promise.all(
        challengeIds.map((id: bigint) => challengeContract.getChallenge(id))
      )

      return challengeIds.map((id: bigint, index: number) =>
        normalizeChallenge(id, challengeDetails[index] as ethers.Result)
      )
    } catch (err) {
      console.error('getTraderChallenges failed:', err)
      return []
    }
  }

  async function hasActive(walletAddress: string): Promise<boolean> {
    try {
      const provider = await getReadProvider()
      const challengeContract = new ethers.Contract(
        CONTRACTS.GlofiChallenge.address,
        CONTRACTS.GlofiChallenge.abi,
        provider
      )
      return await challengeContract.hasActiveChallenge(walletAddress)
    } catch {
      return false
    }
  }

  /** Claim pending USDC from GlofiPayout (must be on Amoy). */
  async function claimPayout() {
    try {
      setLoading(true)
      setError(null)
      await ensureAmoy()
      const provider = new ethers.BrowserProvider(getEthereum())
      const signer = await provider.getSigner()
      const payoutContract = new ethers.Contract(
        CONTRACTS.GlofiPayout.address,
        CONTRACTS.GlofiPayout.abi,
        signer
      )
      const tx = await payoutContract.claimPayout()
      await tx.wait()
      setTxHash(tx.hash)
      return tx.hash
    } catch (err: unknown) {
      setError(errMsg(err))
      return null
    } finally {
      setLoading(false)
    }
  }

  /** Pending payout in human USDC (6 decimals). */
  async function getPendingPayout(walletAddress: string): Promise<string> {
    try {
      const provider = await getReadProvider()
      const payoutContract = new ethers.Contract(
        CONTRACTS.GlofiPayout.address,
        CONTRACTS.GlofiPayout.abi,
        provider
      )
      const amount = await payoutContract.getPendingPayout(walletAddress)
      return ethers.formatUnits(amount, 6)
    } catch {
      return '0'
    }
  }

  return {
    registerChallenge,
    canOpenChallenge,
    getTraderChallenges,
    hasActive,
    claimPayout,
    getPendingPayout,
    loading,
    error,
    txHash,
    setError,
  }
}
