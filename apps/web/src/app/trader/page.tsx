'use client'

/**
 * Trader challenge flow — tier select → rules → wallet → Amoy → pay → success.
 * Fees/funded sizes come from CHALLENGE_TIERS (testnet on-chain values).
 */
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { useWallet } from '@/providers/WalletProvider'
import { useGlofiChallenge } from '@/hooks/useGlofiChallenge'
import { CHALLENGE_TIERS, type TierKey } from '@glofi/sdk'
import { ensureAmoy, errMsg, explorerTx } from '@/lib/web3'

export default function TraderPage() {
  const { walletAddress, connectWallet: connectWalletGlobal, connected } =
    useWallet()
  // Default Tier 1 — cheapest test tier with liquidity most likely available
  const [selected, setSelected] = useState<TierKey>('tier1')
  const [step, setStep] = useState(0)
  const [payError, setPayError] = useState<string | null>(null)
  const {
    registerChallenge,
    loading: challengeLoading,
    error: challengeError,
    txHash,
    setError: setChallengeError,
  } = useGlofiChallenge()

  // Reset flow if wallet disconnects mid-wizard
  const prevConnected = useRef(connected)
  useEffect(() => {
    const wasConnected = prevConnected.current
    prevConnected.current = connected
    if (!connected && wasConnected) {
      setStep(0)
    }
  }, [connected])

  const tier = CHALLENGE_TIERS[selected]

  async function connectWallet() {
    await connectWalletGlobal()
    // If already connected, skip straight to network step
    if (connected) setStep(3)
  }

  /** Step 3 — switch/add Polygon Amoy via shared helper. */
  async function switchToPolygon() {
    try {
      await ensureAmoy()
      setStep(4)
    } catch (e: unknown) {
      alert(errMsg(e))
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 pt-44 pb-20">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl font-bold text-center mb-4"
        >
          Start Your Challenge
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-gray-400 text-center mb-4"
        >
          Select your tier, follow the steps, and begin.
        </motion.p>

        {/* Explicit testnet notice under hero */}
        <p className="text-center text-amber-400/90 text-sm mb-12">
          Testnet parameters — fees and account sizes match live Amoy contracts
          (Tier 1: {CHALLENGE_TIERS.tier1.feeLabel} fee /{' '}
          {CHALLENGE_TIERS.tier1.fundedLabel} account).
        </p>

        {/* ── Tier selector ───────────────────────────────────────────── */}
        <div className="flex gap-4 justify-center mb-12 flex-wrap">
          {(Object.keys(CHALLENGE_TIERS) as TierKey[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setSelected(t)
                setStep(0)
                setPayError(null)
                setChallengeError(null)
              }}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                selected === t
                  ? 'bg-white text-black'
                  : 'border border-gray-700 text-gray-400 hover:border-white hover:text-white'
              }`}
            >
              {CHALLENGE_TIERS[t].name}
            </button>
          ))}
        </div>

        {/* ── Step 0 — Challenge details ──────────────────────────────── */}
        {step === 0 && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border border-gray-800 rounded-2xl p-10"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-3xl font-bold">{tier.name} Challenge</h2>
                  {tier.testnet && (
                    <span className="text-xs font-bold bg-amber-500 text-black px-2 py-0.5 rounded-full">
                      TESTNET
                    </span>
                  )}
                </div>
                <p className="text-gray-400">Funded account upon passing</p>
              </div>
              <div className="text-right">
                <p className="text-5xl font-bold">{tier.feeLabel}</p>
                <p className="text-gray-400">one time fee (USDC)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-10">
              <div className="bg-gray-900 rounded-xl p-6 text-center">
                <p className="text-gray-400 text-sm mb-2">Funded Account</p>
                <p className="text-2xl font-bold">{tier.fundedLabel}</p>
              </div>
              <div className="bg-gray-900 rounded-xl p-6 text-center">
                <p className="text-gray-400 text-sm mb-2">Max Drawdown</p>
                <p className="text-2xl font-bold">{tier.drawdown}</p>
              </div>
              <div className="bg-gray-900 rounded-xl p-6 text-center">
                <p className="text-gray-400 text-sm mb-2">Profit Target</p>
                <p className="text-2xl font-bold">{tier.target}</p>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8">
              <h3 className="font-semibold mb-4">Challenge Rules</h3>
              <ul className="flex flex-col gap-3 text-gray-400 mb-8">
                <li>✓ Minimum {tier.days} trading days</li>
                <li>✓ Maximum drawdown {tier.drawdown}</li>
                <li>✓ Reach {tier.target} profit target to pass</li>
                <li>
                  ✓ Results submitted by the platform evaluator (on-chain
                  settlement)
                </li>
                <li>✓ No time limit — trade at your own pace</li>
              </ul>

              <button
                onClick={() => setStep(1)}
                className="w-full bg-white text-black py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition"
              >
                Begin Challenge
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Step 1 — Review rules ───────────────────────────────────── */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border border-gray-800 rounded-2xl p-10"
          >
            <h2 className="text-2xl font-bold mb-2">Step 1 — Review Rules</h2>
            <p className="text-gray-400 mb-8">
              Please read and confirm you understand the challenge rules before
              proceeding.
            </p>

            <ul className="flex flex-col gap-4 mb-10">
              <li className="flex gap-4 items-start border border-gray-800 rounded-xl p-4">
                <span className="text-green-400 text-xl">✓</span>
                <div>
                  <p className="font-semibold">Profit Target</p>
                  <p className="text-gray-400 text-sm">
                    You must reach a {tier.target} profit target to pass and
                    receive your funded account ({tier.fundedLabel} on testnet).
                  </p>
                </div>
              </li>
              <li className="flex gap-4 items-start border border-gray-800 rounded-xl p-4">
                <span className="text-green-400 text-xl">✓</span>
                <div>
                  <p className="font-semibold">Maximum Drawdown</p>
                  <p className="text-gray-400 text-sm">
                    Your account will be closed if losses exceed {tier.drawdown}.
                    Enforced on-chain after evaluation is submitted.
                  </p>
                </div>
              </li>
              <li className="flex gap-4 items-start border border-gray-800 rounded-xl p-4">
                <span className="text-green-400 text-xl">✓</span>
                <div>
                  <p className="font-semibold">Minimum Trading Days</p>
                  <p className="text-gray-400 text-sm">
                    You must trade for a minimum of {tier.days} days. Hitting
                    the target early does not pass without minimum days.
                  </p>
                </div>
              </li>
              <li className="flex gap-4 items-start border border-gray-800 rounded-xl p-4">
                <span className="text-green-400 text-xl">✓</span>
                <div>
                  <p className="font-semibold">On-chain settlement</p>
                  <p className="text-gray-400 text-sm">
                    Pass/fail is written by the authorized evaluator wallet.
                    Payouts and allocations then follow contract rules — no
                    discretionary override of splits once submitted.
                  </p>
                </div>
              </li>
            </ul>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(0)}
                className="flex-1 border border-gray-700 text-gray-400 py-4 rounded-full font-bold hover:border-white hover:text-white transition"
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (connected) setStep(3)
                  else setStep(2)
                }}
                className="flex-1 bg-white text-black py-4 rounded-full font-bold hover:bg-gray-200 transition"
              >
                I Understand — Continue
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Step 2 — Connect wallet ─────────────────────────────────── */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border border-gray-800 rounded-2xl p-10 text-center"
          >
            <h2 className="text-2xl font-bold mb-2">Step 2 — Connect Wallet</h2>
            <p className="text-gray-400 mb-10">
              Connect your Web3 wallet to proceed with your challenge
              registration.
            </p>

            <div className="text-8xl mb-8">🦊</div>

            <button
              onClick={connectWallet}
              className="w-full bg-white text-black py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition mb-4"
            >
              Connect MetaMask
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full border border-gray-700 text-gray-400 py-4 rounded-full font-bold hover:border-white hover:text-white transition"
            >
              Back
            </button>
          </motion.div>
        )}

        {/* ── Step 3 — Network check ──────────────────────────────────── */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border border-gray-800 rounded-2xl p-10 text-center"
          >
            <h2 className="text-2xl font-bold mb-2">
              Step 3 — Switch to Amoy Testnet
            </h2>
            <p className="text-gray-400 mb-10">
              Glofi runs on Polygon Amoy Testnet. Please switch your wallet to
              continue.
            </p>

            <div className="text-8xl mb-8">🔷</div>

            {walletAddress && (
              <div className="bg-gray-900 rounded-xl p-4 mb-6 text-left">
                <p className="text-gray-400 text-sm mb-1">Connected Wallet</p>
                <p className="font-semibold text-green-400">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)} ✓
                </p>
              </div>
            )}

            <div className="bg-gray-900 rounded-xl p-6 mb-8 text-left">
              <div className="flex justify-between mb-3">
                <p className="text-gray-400">Network</p>
                <p className="font-bold">Polygon Amoy Testnet</p>
              </div>
              <div className="flex justify-between mb-3">
                <p className="text-gray-400">Chain ID</p>
                <p className="font-bold">80002</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-400">Currency</p>
                <p className="font-bold">MATIC</p>
              </div>
            </div>

            <button
              onClick={switchToPolygon}
              className="w-full bg-white text-black py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition mb-4"
            >
              Switch to Amoy Testnet
            </button>

            <button
              onClick={() => setStep(connected ? 1 : 2)}
              className="w-full border border-gray-700 text-gray-400 py-4 rounded-full font-bold hover:border-white hover:text-white transition"
            >
              Back
            </button>
          </motion.div>
        )}

        {/* ── Step 4 — Payment ────────────────────────────────────────── */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border border-gray-800 rounded-2xl p-10"
          >
            <h2 className="text-2xl font-bold mb-2">Step 4 — Payment</h2>
            <p className="text-gray-400 mb-8">
              Review your order and confirm payment to begin your challenge.
            </p>

            <div className="bg-gray-900 rounded-xl p-6 mb-8">
              <div className="flex justify-between mb-4">
                <p className="text-gray-400">Challenge Tier</p>
                <p className="font-semibold">{tier.name}</p>
              </div>
              <div className="flex justify-between mb-4">
                <p className="text-gray-400">Funded Account</p>
                <p className="font-semibold">{tier.fundedLabel}</p>
              </div>
              <div className="flex justify-between mb-4">
                <p className="text-gray-400">Profit Target</p>
                <p className="font-semibold">{tier.target}</p>
              </div>
              <div className="flex justify-between mb-4">
                <p className="text-gray-400">Max Drawdown</p>
                <p className="font-semibold">{tier.drawdown}</p>
              </div>
              <div className="border-t border-gray-700 pt-4 flex justify-between">
                <p className="font-bold">Total</p>
                <p className="font-bold text-xl">{tier.feeLabel} USDC</p>
              </div>
            </div>

            {walletAddress && (
              <div className="bg-gray-900 rounded-xl p-4 mb-6">
                <p className="text-gray-400 text-sm mb-1">Paying from</p>
                <p className="font-semibold text-green-400">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)} ✓
                </p>
              </div>
            )}

            {/* Surface approve/register failures (N6) */}
            {(payError || challengeError) && (
              <p className="text-red-400 text-sm mb-4">
                {payError || challengeError}
              </p>
            )}

            <div className="flex gap-4">
              <button
                onClick={async () => {
                  setPayError(null)
                  setChallengeError(null)
                  const hash = await registerChallenge(selected)
                  if (hash) setStep(5)
                  else if (!challengeError) {
                    setPayError('Registration failed. Check USDC balance and network.')
                  }
                }}
                disabled={challengeLoading}
                className="flex-1 bg-white text-black py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {challengeLoading
                  ? 'Processing...'
                  : `Confirm Payment — ${tier.feeLabel}`}
              </button>

              <button
                onClick={() => setStep(3)}
                className="flex-1 border border-gray-700 text-gray-400 py-4 rounded-full font-bold hover:border-white hover:text-white transition"
              >
                Back
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Step 5 — Success ────────────────────────────────────────── */}
        {step === 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="border border-green-500 rounded-2xl p-10 text-center"
          >
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold mb-4">Challenge Started!</h2>
            <p className="text-gray-400 mb-2">
              Your {tier.name} challenge is now active.
            </p>
            <p className="text-gray-400 mb-8">
              Funded size on pass: {tier.fundedLabel} (testnet). Trade well.
            </p>

            <div className="bg-gray-900 rounded-xl p-6 text-left mb-8">
              <div className="flex justify-between mb-3">
                <p className="text-gray-400">Status</p>
                <p className="text-green-400 font-semibold">Active</p>
              </div>
              <div className="flex justify-between mb-3">
                <p className="text-gray-400">Funded Account</p>
                <p className="font-semibold">{tier.fundedLabel}</p>
              </div>
              <div className="flex justify-between mb-3">
                <p className="text-gray-400">Target</p>
                <p className="font-semibold">{tier.target} profit</p>
              </div>
              {walletAddress && (
                <div className="flex justify-between">
                  <p className="text-gray-400">Wallet</p>
                  <p className="font-semibold text-green-400">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </p>
                </div>
              )}
            </div>

            {txHash && (
              <div className="bg-gray-900 rounded-xl p-4 mb-6 text-left">
                <p className="text-gray-400 text-sm mb-1">Transaction Hash</p>
                <a
                  href={explorerTx(txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-green-400 break-all hover:text-green-300"
                >
                  {txHash}
                </a>
              </div>
            )}

            <button
              onClick={() => {
                setStep(0)
                setSelected('tier1')
              }}
              className="w-full border border-gray-700 text-gray-400 py-4 rounded-full font-bold hover:border-white hover:text-white transition"
            >
              Back to Challenges
            </button>
          </motion.div>
        )}
      </div>

      <Footer />
    </main>
  )
}
