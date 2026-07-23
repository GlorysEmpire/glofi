'use client'

/**
 * GLOFI token + pool reads and deposit/withdraw writes.
 * Notes on decimals (testnet quirk):
 * - GlofiToken is ERC-20 with 18 decimals (founding mint uses full 18-dec scale).
 * - GlofiPool.mint uses raw USDC amount (6 decimals) as the mint quantity.
 * - LP personal balances are therefore displayed with 6 decimals (formatGlofiLp).
 * - Total supply still uses formatEther so founding 15M reads correctly.
 */
import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { CONTRACTS, USDC_ADDRESS } from '@glofi/sdk'
import {
  getEthereum,
  getReadProvider,
  errMsg,
  ensureAmoy,
  formatGlofiBalance,
  formatUsdc,
} from '@/lib/web3'

export function useGlofiToken(walletAddress?: string) {
  const [tokenBalance, setTokenBalance] = useState<string>('0')
  const [totalSupply, setTotalSupply] = useState<string>('0')
  const [usdcDeposited, setUsdcDeposited] = useState<string>('0')
  const [totalPoolValue, setTotalPoolValue] = useState<string>('0')
  const [reservedLiquidity, setReservedLiquidity] = useState<string>('0')
  const [freeLiquidity, setFreeLiquidity] = useState<string>('0')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [txLoading, setTxLoading] = useState(false)

  // ─── Read path ───────────────────────────────────────────────────────────

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Uses fallback RPC list (official Amoy host often fails DNS)
      const provider = await getReadProvider()

      const tokenContract = new ethers.Contract(
        CONTRACTS.GlofiToken.address,
        CONTRACTS.GlofiToken.abi,
        provider
      )

      const poolContract = new ethers.Contract(
        CONTRACTS.GlofiPool.address,
        CONTRACTS.GlofiPool.abi,
        provider
      )

      // Founding allocation is 18-decimal; formatEther shows ~15M correctly
      const supply = await tokenContract.getTotalSupply()
      setTotalSupply(ethers.formatEther(supply))

      // Pool stats are pure USDC (6 decimals)
      const poolStats = await poolContract.getPoolStats()
      setTotalPoolValue(formatUsdc(poolStats[0]))
      setReservedLiquidity(formatUsdc(poolStats[1]))
      setFreeLiquidity(formatUsdc(poolStats[2]))

      if (walletAddress) {
        const balance = await tokenContract.getBalance(walletAddress)
        // Smart scale: founding (18-dec) vs pool mint (6-dec) — see formatGlofiBalance
        setTokenBalance(formatGlofiBalance(balance))

        // Token contract tracks usdcDeposited as the same raw USDC units
        const deposited = await tokenContract.getUsdcDeposited(walletAddress)
        setUsdcDeposited(formatUsdc(deposited))
      } else {
        setTokenBalance('0')
        setUsdcDeposited('0')
      }
    } catch (err) {
      console.error('Error fetching token data:', err)
      setError(errMsg(err) || 'Failed to fetch token data')
    } finally {
      setLoading(false)
    }
  }, [walletAddress])

  useEffect(() => {
    refresh()
  }, [refresh])

  // ─── Write: deposit USDC → mint GLOFI ────────────────────────────────────

  /**
   * Returns { hash } on success or { error } on failure.
   * Error string is returned (not only state) so callers can show it immediately.
   */
  async function depositToPool(
    usdcAmount: string
  ): Promise<{ hash: string | null; error: string | null }> {
    try {
      setTxLoading(true)
      setError(null)
      await ensureAmoy()

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

      const poolContract = new ethers.Contract(
        CONTRACTS.GlofiPool.address,
        CONTRACTS.GlofiPool.abi,
        signer
      )

      const amount = ethers.parseUnits(usdcAmount, 6)
      const owner = await signer.getAddress()

      // Only approve when allowance is insufficient (saves a wallet popup)
      const allowance: bigint = await usdcContract.allowance(
        owner,
        CONTRACTS.GlofiPool.address
      )
      if (allowance < amount) {
        const approveTx = await usdcContract.approve(
          CONTRACTS.GlofiPool.address,
          amount
        )
        await approveTx.wait()
      }

      const depositTx = await poolContract.deposit(amount)
      await depositTx.wait()
      await refresh()
      return { hash: depositTx.hash, error: null }
    } catch (err: unknown) {
      console.error('Deposit failed:', err)
      const message = errMsg(err)
      setError(message)
      return { hash: null, error: message }
    } finally {
      setTxLoading(false)
    }
  }

  // ─── Write: burn GLOFI → withdraw USDC ───────────────────────────────────

  /**
   * @param tokenAmount Human amount matching LP display (6-dec scale), e.g. "50"
   */
  async function withdrawFromPool(
    tokenAmount: string
  ): Promise<{ hash: string | null; error: string | null }> {
    try {
      setTxLoading(true)
      setError(null)
      await ensureAmoy()

      const provider = new ethers.BrowserProvider(getEthereum())
      const signer = await provider.getSigner()

      const poolContract = new ethers.Contract(
        CONTRACTS.GlofiPool.address,
        CONTRACTS.GlofiPool.abi,
        signer
      )

      // Match mint scale: pool minted raw USDC units into the token
      const amount = ethers.parseUnits(tokenAmount, 6)
      const tx = await poolContract.withdraw(amount)
      await tx.wait()
      await refresh()
      return { hash: tx.hash, error: null }
    } catch (err: unknown) {
      console.error('Withdrawal failed:', err)
      const message = errMsg(err)
      setError(message)
      return { hash: null, error: message }
    } finally {
      setTxLoading(false)
    }
  }

  return {
    tokenBalance,
    totalSupply,
    usdcDeposited,
    totalPoolValue,
    reservedLiquidity,
    freeLiquidity,
    loading,
    txLoading,
    error,
    setError,
    depositToPool,
    withdrawFromPool,
    refresh,
  }
}
