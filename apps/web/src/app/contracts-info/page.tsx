'use client'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { useGlofiToken } from '@/hooks/useGlofiToken'
import { CONTRACTS, NETWORK } from '@glofi/sdk'

export default function ContractsPage() {
  const { totalSupply, loading } = useGlofiToken()

  function formatNumber(num: number): string {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M'
    if (num >= 1_000) return (num / 1_000).toFixed(2) + 'K'
    return num.toLocaleString()
  }

  // Addresses always come from config so this page cannot drift from hooks
  const otherContracts = [
    { num: '02', title: 'Liquidity Pool', desc: 'Holds all investor USDC. Manages shares, tracks allocations to funded traders, enforces liquidity protection rules.', live: true, address: CONTRACTS.GlofiPool.address },
    { num: '03', title: 'Challenge Contract (testnet)', desc: 'Challenge registration and rules. Test deploy: Tier 1 is $10 fee / $100 funded account.', live: true, address: CONTRACTS.GlofiChallenge.address },
    { num: '04', title: 'Payout Contract', desc: 'Handles profit splits for funded traders. Distributes 80% to trader, 15% to pool, 5% to platform treasury.', live: true, address: CONTRACTS.GlofiPayout.address },
    { num: '05', title: 'Proxy Governance Contract', desc: 'Enables traditional investors without Web3 wallets to participate in governance through a designated agent system.', live: true, address: CONTRACTS.ProxyGovernance.address },
  ]

  return (
    <main className="min-h-screen text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 pt-44 pb-20">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="text-green-400 font-semibold mb-4">On-Chain Transparency</p>
          <h1 className="text-5xl font-bold mb-6">Smart Contracts</h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Every contract that powers Glofi is deployed on the blockchain and
            publicly verifiable. No hidden logic. No closed systems.
            Read the code yourself.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="border border-gray-800 rounded-2xl p-6 mb-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
        >
          <div>
            <p className="text-gray-400 text-sm mb-1">Network</p>
            <p className="font-bold text-lg">{NETWORK.name}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Chain ID</p>
            <p className="font-bold text-lg">80002</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Currency</p>
            <p className="font-bold text-lg">POL (MATIC)</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Status</p>
            <p className="font-bold text-lg text-green-400">Testnet Live</p>
          </div>

          <a href={NETWORK.explorer}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-700 text-gray-400 px-5 py-2 rounded-full text-sm font-semibold hover:border-white hover:text-white transition whitespace-nowrap"
          >
            View Explorer
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-8">Deployed Contracts</h2>

          <div className="flex flex-col gap-6">

            <div className="border border-gray-800 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">LIVE</span>
                    <span className="text-gray-400 text-sm">Contract 01</span>
                  </div>
                  <h3 className="text-2xl font-bold">Governance Token</h3>
                  <p className="text-green-400 font-semibold">GLOFI</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm mb-1">Total Supply</p>
                  <p className="text-2xl font-bold">
                    {loading ? '...' : formatNumber(Number(totalSupply))} GLOFI
                  </p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                ERC-20 token representing investor ownership in the Glofi liquidity pool.
                Minted when investors deposit USDC, burned on withdrawal.
                Carries voting rights proportional to holdings.
              </p>
              <div className="bg-gray-900 rounded-xl p-4 mb-6">
                <p className="text-gray-400 text-xs mb-2">Contract Address</p>
                <div className="flex items-center justify-between gap-4">
                  <p className="font-mono text-sm text-green-400 break-all">
                    {CONTRACTS.GlofiToken.address}
                  </p>
                  <button
                    onClick={() => navigator.clipboard.writeText(CONTRACTS.GlofiToken.address)}
                    className="text-gray-400 hover:text-white transition text-xs border border-gray-700 px-3 py-1 rounded-lg whitespace-nowrap"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-900 rounded-xl p-4 text-center">
                  <p className="text-gray-400 text-xs mb-1">Standard</p>
                  <p className="font-semibold text-sm">ERC-20</p>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 text-center">
                  <p className="text-gray-400 text-xs mb-1">Decimals</p>
                  <p className="font-semibold text-sm">18</p>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 text-center">
                  <p className="text-gray-400 text-xs mb-1">Mintable</p>
                  <p className="font-semibold text-sm">Pool Only</p>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 text-center">
                  <p className="text-gray-400 text-xs mb-1">Burnable</p>
                  <p className="font-semibold text-sm">Pool Only</p>
                </div>
              </div>

              <a href={`${NETWORK.explorer}/address/${CONTRACTS.GlofiToken.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-gray-700 text-gray-400 px-5 py-2 rounded-full text-sm font-semibold hover:border-white hover:text-white transition"
              >
                View on PolygonScan
              </a>
            </div>

            {otherContracts.map((contract) => (
              <div key={contract.num} className={`border border-gray-800 rounded-2xl p-8 ${!contract.live ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${contract.live ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
                    {contract.live ? 'LIVE' : 'COMING SOON'}
                  </span>
                  <span className="text-gray-400 text-sm">Contract {contract.num}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{contract.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{contract.desc}</p>
                {contract.live && contract.address && (

                  <a href={`${NETWORK.explorer}/address/${contract.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-gray-700 text-gray-400 px-5 py-2 rounded-full text-sm font-semibold hover:border-white hover:text-white transition"
                  >
                    View on PolygonScan
                  </a>
                )}
              </div>
            ))}

          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="border border-gray-800 rounded-2xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Open Source and Auditable</h2>
          <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto mb-6">
            All Glofi smart contracts are open source and publicly verifiable on PolygonScan.
            Before mainnet launch, all contracts will undergo a full third-party security audit.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">

            <a href={`${NETWORK.explorer}/address/${CONTRACTS.GlofiToken.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
            >
              View GLOFI Contract
            </a>

            <a href="https://github.com/GlorysEmpire/glofi-contracts"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition"
            >
              View on GitHub
            </a>
          </div>
        </motion.div>

      </div>

      <Footer />
    </main>
  )
}
