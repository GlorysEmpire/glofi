'use client'

/**
 * Wallet dashboard — challenges, GLOFI holdings, pending payout.
 * No fake governance votes here; real proposals live on /governance.
 */
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { useWallet } from '@/providers/WalletProvider'
import { useGlofiToken } from '@/hooks/useGlofiToken'
import {
  useGlofiChallenge,
  type NormalizedChallenge,
} from '@/hooks/useGlofiChallenge'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatCompact } from '@/lib/web3'

export default function DashboardPage() {
  const { connected, walletAddress } = useWallet()
  const {
    tokenBalance,
    totalSupply,
    usdcDeposited,
    totalPoolValue,
    loading: tokenLoading,
  } = useGlofiToken(walletAddress)
  const {
    getTraderChallenges,
    claimPayout,
    getPendingPayout,
    loading: claimLoading,
    error: claimError,
  } = useGlofiChallenge()

  const [challenges, setChallenges] = useState<NormalizedChallenge[]>([])
  const [pendingPayout, setPendingPayout] = useState<string>('0')
  const [challengesLoading, setChallengesLoading] = useState(false)
  const [claimMsg, setClaimMsg] = useState<string | null>(null)
  const router = useRouter()

  // ─── Helpers ─────────────────────────────────────────────────────────────

  function shortAddress(addr: string) {
    return addr.slice(0, 6) + '...' + addr.slice(-4)
  }

  /** Compact K/M/B so card numbers never overflow the grid */
  function formatTokenAmount(amount: string | number): string {
    return formatCompact(amount)
  }

  /** Share of pool by USDC deposited vs total pool value (testnet estimate). */
  function sharePercent(): string {
    const dep = Number(usdcDeposited)
    const pool = Number(totalPoolValue)
    if (!Number.isFinite(dep) || !Number.isFinite(pool) || pool <= 0) return '0'
    return ((dep / pool) * 100).toFixed(2)
  }

  // ─── Auth gate ───────────────────────────────────────────────────────────

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!connected) router.push('/')
    }, 1000)
    return () => clearTimeout(timer)
  }, [connected, router])

  // Clear list when wallet disconnects
  useEffect(() => {
    if (!connected) {
      const t = setTimeout(() => {
        setChallenges([])
        setPendingPayout('0')
      }, 0)
      return () => clearTimeout(t)
    }
  }, [connected])

  // ─── Load on-chain data for this wallet ──────────────────────────────────

  useEffect(() => {
    async function loadData() {
      if (!walletAddress) return
      setChallengesLoading(true)
      const [data, payout] = await Promise.all([
        getTraderChallenges(walletAddress),
        getPendingPayout(walletAddress),
      ])
      setChallenges(data)
      setPendingPayout(payout)
      setChallengesLoading(false)
    }
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hook fns are unstable; walletAddress is the trigger
  }, [walletAddress])

  if (!connected) return null

  // ─── Display maps ────────────────────────────────────────────────────────

  const statusMap: { [key: number]: string } = {
    0: 'Active',
    1: 'Passed',
    2: 'Failed',
    3: 'Closed',
  }
  const tierMap: { [key: number]: string } = {
    0: 'Tier 1',
    1: 'Tier 2',
    2: 'Tier 3',
  }
  const statusColors: { [key: string]: string } = {
    Active: 'text-green-400',
    Passed: 'text-blue-300',
    Failed: 'text-red-400',
    Closed: 'text-gray-400',
  }

  const hasInvestment =
    Number(tokenBalance) > 0 || Number(usdcDeposited) > 0

  return (
    <main className="min-h-screen text-white">
      <Navbar />

      {/* pt accounts for fixed navbar + testnet banner */}
      <div className="max-w-4xl mx-auto px-6 pt-44 pb-20">
        {/* ── Welcome ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="text-gray-400 mb-2">Welcome back</p>
          <h1 className="text-4xl font-bold text-blue-300">
            {shortAddress(walletAddress)}
          </h1>
        </motion.div>

        {/* ── Overview cards ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          <div className="border border-gray-800 rounded-2xl p-4 sm:p-6 min-w-0 overflow-hidden">
            <p className="text-gray-400 text-sm mb-2">Active Challenges</p>
            <p className="text-2xl sm:text-3xl font-bold mb-1 tabular-nums truncate">
              {challenges.filter((c) => c.status === 0).length}
            </p>
            <p className="text-gray-400 text-sm">
              {challenges.length === 0
                ? 'No challenges yet'
                : `${challenges.length} total`}
            </p>
          </div>

          <div className="border border-gray-800 rounded-2xl p-4 sm:p-6 min-w-0 overflow-hidden">
            <p className="text-gray-400 text-sm mb-2">GLOFI balance</p>
            <p
              className="text-2xl sm:text-3xl font-bold mb-1 tabular-nums truncate"
              title={tokenLoading ? undefined : tokenBalance}
            >
              {tokenLoading ? '...' : formatTokenAmount(tokenBalance)}
            </p>
            <p className="text-gray-500 text-xs mt-2 truncate">
              Hover for full amount
            </p>
          </div>

          <div className="border border-gray-800 rounded-2xl p-4 sm:p-6 min-w-0 overflow-hidden">
            <p className="text-gray-400 text-sm mb-2">USDC Deposited</p>
            <p
              className="text-2xl sm:text-3xl font-bold mb-1 tabular-nums truncate"
              title={tokenLoading ? undefined : usdcDeposited}
            >
              ${tokenLoading ? '...' : formatTokenAmount(usdcDeposited)}
            </p>
            <div className="flex justify-between items-center gap-2 mt-2 min-w-0">
              <p className="text-gray-400 text-sm shrink-0">Your share</p>
              <p className="text-white text-sm font-semibold truncate">
                {tokenLoading ? '...' : `${sharePercent()}%`}
              </p>
            </div>
            <div className="flex justify-between items-center gap-2 mt-1 min-w-0">
              <p className="text-gray-400 text-sm shrink-0">Pool size</p>
              <p className="text-white text-sm font-semibold truncate">
                $
                {tokenLoading
                  ? '...'
                  : formatTokenAmount(totalPoolValue)}
              </p>
            </div>
          </div>

          <div className="border border-gray-800 rounded-2xl p-4 sm:p-6 min-w-0 overflow-hidden">
            <p className="text-gray-400 text-sm mb-2">Pending Payout</p>
            <p className="text-2xl sm:text-3xl font-bold mb-1 tabular-nums truncate">
              ${formatTokenAmount(pendingPayout)}
            </p>
            {Number(pendingPayout) > 0 && (
              <button
                onClick={async () => {
                  setClaimMsg(null)
                  const hash = await claimPayout()
                  if (hash) {
                    setPendingPayout('0')
                    setClaimMsg(`Claimed — ${hash.slice(0, 10)}…`)
                  }
                }}
                disabled={claimLoading}
                className="mt-3 w-full bg-green-500 text-white py-2 rounded-full text-sm font-semibold hover:bg-green-600 transition disabled:opacity-50"
              >
                {claimLoading ? 'Claiming…' : 'Claim Payout'}
              </button>
            )}
            {Number(pendingPayout) === 0 && (
              <p className="text-gray-400 text-sm">No pending payouts</p>
            )}
            {(claimError || claimMsg) && (
              <p
                className={`text-xs mt-2 ${claimError ? 'text-red-400' : 'text-green-400'}`}
              >
                {claimError || claimMsg}
              </p>
            )}
          </div>
        </motion.div>

        {/* ── Challenges ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-16"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Challenges</h2>
            <Link href="/trader">
              <button className="border border-gray-700 text-gray-400 px-5 py-2 rounded-full text-sm font-semibold hover:border-white hover:text-white transition">
                + New Challenge
              </button>
            </Link>
          </div>

          {challengesLoading ? (
            <div className="border border-gray-800 rounded-2xl p-10 text-center">
              <p className="text-gray-400">Loading challenges...</p>
            </div>
          ) : challenges.length > 0 ? (
            <div className="flex flex-col gap-4">
              {challenges.map((challenge) => {
                const status =
                  statusMap[challenge.status] || 'Unknown'
                const tier = tierMap[challenge.tier] || 'Unknown'
                // accountSize already human USDC from normalizeChallenge
                const accountDisplay = Number(challenge.accountSize)
                const accountLabel = Number.isFinite(accountDisplay)
                  ? accountDisplay.toLocaleString()
                  : '0'

                return (
                  <div
                    key={challenge.id}
                    className="border border-gray-800 rounded-2xl p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">
                          Challenge #{challenge.id}
                        </p>
                        <h3 className="text-xl font-bold">{tier}</h3>
                      </div>
                      <span
                        className={`font-semibold ${statusColors[status] || 'text-gray-400'}`}
                      >
                        {status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-900 rounded-xl p-4 text-center">
                        <p className="text-gray-400 text-xs mb-1">
                          Account Size
                        </p>
                        <p className="font-bold">${accountLabel}</p>
                      </div>
                      <div className="bg-gray-900 rounded-xl p-4 text-center">
                        <p className="text-gray-400 text-xs mb-1">
                          Trading Days
                        </p>
                        <p className="font-bold">
                          {challenge.tradingDaysCompleted} /{' '}
                          {challenge.minTradingDays}
                        </p>
                      </div>
                      <div className="bg-gray-900 rounded-xl p-4 text-center">
                        <p className="text-gray-400 text-xs mb-1">
                          Profit Target
                        </p>
                        <p className="font-bold">
                          {challenge.profitTarget}%
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="border border-gray-800 rounded-2xl p-10 text-center">
              <p className="text-5xl mb-4">🏆</p>
              <p className="text-gray-400 mb-6">No active challenges yet.</p>
              <Link href="/trader">
                <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
                  Start a Challenge
                </button>
              </Link>
            </div>
          )}
        </motion.div>

        {/* ── Investment (live data, not always empty) ────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-16"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Investment</h2>
            <Link href="/investor">
              <button className="border border-gray-700 text-gray-400 px-5 py-2 rounded-full text-sm font-semibold hover:border-white hover:text-white transition">
                + Deposit USDC
              </button>
            </Link>
          </div>

          {hasInvestment ? (
            <div className="border border-gray-800 rounded-2xl p-8 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="min-w-0">
                  <p className="text-gray-400 text-sm mb-1">GLOFI balance</p>
                  <p
                    className="text-2xl font-bold tabular-nums truncate"
                    title={tokenBalance}
                  >
                    {formatTokenAmount(tokenBalance)}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-gray-400 text-sm mb-1">USDC deposited</p>
                  <p
                    className="text-2xl font-bold tabular-nums truncate"
                    title={usdcDeposited}
                  >
                    ${formatTokenAmount(usdcDeposited)}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-gray-400 text-sm mb-1">Est. pool share</p>
                  <p className="text-2xl font-bold tabular-nums truncate">
                    {sharePercent()}%
                  </p>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-4 break-words">
                Circulating supply (incl. founding allocation):{' '}
                {formatTokenAmount(totalSupply)} GLOFI
              </p>
              <Link href="/investor">
                <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition">
                  Manage on Investor page
                </button>
              </Link>
            </div>
          ) : (
            <div className="border border-gray-800 rounded-2xl p-10 text-center">
              <p className="text-5xl mb-4">💰</p>
              <p className="text-gray-400 mb-6">
                No investments yet. Deposit USDC to start earning.
              </p>
              <Link href="/investor">
                <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
                  Invest in the Pool
                </button>
              </Link>
            </div>
          )}
        </motion.div>

        {/* ── Governance CTA (no fake local votes) ────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Governance</h2>
            <Link href="/governance">
              <button className="border border-gray-700 text-gray-400 px-5 py-2 rounded-full text-sm font-semibold hover:border-white hover:text-white transition">
                View All
              </button>
            </Link>
          </div>

          <div className="border border-gray-800 rounded-2xl p-8 text-center">
            <p className="text-gray-400 mb-4">
              Vote on live on-chain proposals with your GLOFI balance.
              Dashboard no longer shows mock proposals.
            </p>
            <Link href="/governance">
              <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
                Open Governance
              </button>
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  )
}
