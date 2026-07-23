'use client'

/**
 * Live on-chain governance — proposals and votes from ProxyGovernance.
 */
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { useWallet } from '@/providers/WalletProvider'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { CONTRACTS, NETWORK } from '@glofi/sdk'
import { ensureAmoy, errMsg, getEthereum, getReadProvider } from '@/lib/web3'

export default function GovernancePage() {
    const { connected, walletAddress, connectWallet } = useWallet()
    const [proposals, setProposals] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [votingId, setVotingId] = useState<number | null>(null)
    const [txHash, setTxHash] = useState<string | null>(null)
    const [votedProposals, setVotedProposals] = useState<{ [key: number]: 'for' | 'against' }>({})
    const [votingPower, setVotingPower] = useState<string>('0')
    const [voteError, setVoteError] = useState<string | null>(null)
    const [loadError, setLoadError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchVotingPower() {
            if (!walletAddress) return
            try {
                const provider = await getReadProvider()
                const token = new ethers.Contract(
                    CONTRACTS.GlofiToken.address,
                    CONTRACTS.GlofiToken.abi,
                    provider
                )
                const balance = await token.balanceOf(walletAddress)
                const formatted = ethers.formatEther(balance)
                const n = Number(formatted)
                if (n >= 1_000_000) setVotingPower((n / 1_000_000).toFixed(2) + 'M')
                else if (n >= 1_000) setVotingPower((n / 1_000).toFixed(2) + 'K')
                else setVotingPower(n.toLocaleString())
            } catch {
                setVotingPower('0')
            }
        }
        fetchVotingPower()
    }, [walletAddress])

    useEffect(() => {
        loadProposals()
    }, [])

    async function loadProposals() {
        try {
            setLoadError(null)
            const provider = await getReadProvider()
            const gov = new ethers.Contract(
                CONTRACTS.ProxyGovernance.address,
                CONTRACTS.ProxyGovernance.abi,
                provider
            )
            const count = await gov.proposalCount()
            const loaded = []
            // Proposals are 1-indexed (++proposalCount in contract)
            for (let i = 1; i <= Number(count); i++) {
                const p = await gov.getProposal(i)
                const active = await gov.isProposalActive(i)
                loaded.push({
                    id: i,
                    title: p[1],
                    description: p[2],
                    forVotes: p[3],
                    againstVotes: p[4],
                    startTime: p[5],
                    endTime: p[6],
                    executed: p[7],
                    passed: p[8],
                    active
                })
            }
            setProposals(loaded)
        } catch (err) {
            console.error('Failed to load proposals:', err)
            setLoadError(errMsg(err))
        }
    }

    async function castVote(proposalId: number, support: boolean) {
        if (!connected) return
        try {
            setVotingId(proposalId)
            setVoteError(null)
            await ensureAmoy()
            const provider = new ethers.BrowserProvider(getEthereum())
            const signer = await provider.getSigner()
            const gov = new ethers.Contract(
                CONTRACTS.ProxyGovernance.address,
                CONTRACTS.ProxyGovernance.abi,
                signer
            )
            const tx = await gov.vote(proposalId, support)
            await tx.wait()
            setTxHash(tx.hash)
            setVotedProposals(prev => ({ ...prev, [proposalId]: support ? 'for' : 'against' }))
            await loadProposals()
        } catch (err: unknown) {
            console.error('Vote failed:', err)
            setVoteError(errMsg(err))
        } finally {
            setVotingId(null)
        }
    }

    function formatVotes(votes: any): string {
        if (!votes && votes !== BigInt(0)) return '0'
        const n = Number(ethers.formatEther(BigInt(votes.toString())))
        if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M'
        if (n >= 1_000) return (n / 1_000).toFixed(2) + 'K'
        return n.toLocaleString()
    }

    function getPercentage(forVotes: bigint, againstVotes: bigint): number {
        const total = Number(forVotes) + Number(againstVotes)
        if (total === 0) return 50
        return Math.round((Number(forVotes) / total) * 100)
    }

    function timeRemaining(endTime: bigint): string {
        const now = Math.floor(Date.now() / 1000)
        const end = Number(endTime)
        const diff = end - now
        if (diff <= 0) return 'Ended'
        const days = Math.floor(diff / 86400)
        const hours = Math.floor((diff % 86400) / 3600)
        if (days > 0) return `${days}d ${hours}h remaining`
        return `${hours}h remaining`
    }

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
                    <p className="text-gray-400 font-semibold mb-4">On-Chain Democracy</p>
                    <h1 className="text-5xl font-bold mb-6">Governance</h1>
                    <p className="text-xl text-gray-300 leading-relaxed">
                        Every major decision at Glofi is voted on by token holders.
                        Your GLOFI tokens are your voice. No exceptions.
                    </p>
                    {loadError && (
                        <p className="text-red-400 text-sm mt-4">Failed to load proposals: {loadError}</p>
                    )}
                    {voteError && (
                        <p className="text-red-400 text-sm mt-2">{voteError}</p>
                    )}
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
                >
                    <div className="border border-gray-800 rounded-2xl p-6 text-center">
                        <p className="text-gray-400 text-sm mb-2">Total Proposals</p>
                        <p className="text-4xl font-bold">{proposals.length}</p>
                    </div>
                    <div className="border border-gray-800 rounded-2xl p-6 text-center">
                        <p className="text-gray-400 text-sm mb-2">Active Proposals</p>
                        <p className="text-4xl font-bold">{proposals.filter(p => p.active).length}</p>
                    </div>
                    <div className="border border-gray-800 rounded-2xl p-6 text-center">
                        <p className="text-gray-400 text-sm mb-2">Your Voting Power</p>
                        <p className="text-4xl font-bold">{connected ? votingPower + ' GLOFI' : '---'}</p>
                    </div>
                </motion.div>

                {/* Proposals */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-2xl font-bold mb-8">
                        {proposals.length === 0 ? 'No proposals yet' : 'Proposals'}
                    </h2>

                    {proposals.length === 0 ? (
                        <div className="border border-gray-800 rounded-2xl p-10 text-center">
                            <p className="text-5xl mb-4">🗳️</p>
                            <p className="text-gray-400 mb-2">No proposals have been created yet.</p>
                            <p className="text-gray-400 text-sm">Hold 1,000 GLOFI tokens to create a proposal.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {proposals.map((proposal) => {
                                const pct = getPercentage(proposal.forVotes, proposal.againstVotes)
                                const voted = votedProposals[proposal.id]
                                return (
                                    <div key={proposal.id} className="border border-gray-800 rounded-2xl p-8">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${proposal.active ? 'bg-white text-black' : 'bg-gray-700 text-gray-300'}`}>
                                                    {proposal.active ? 'ACTIVE' : 'ENDED'}
                                                </span>
                                                <h3 className="text-lg font-bold mt-3">{proposal.title}</h3>
                                            </div>
                                            <p className="text-gray-400 text-sm whitespace-nowrap ml-4">
                                                {timeRemaining(proposal.endTime)}
                                            </p>
                                        </div>
                                        <p className="text-gray-400 text-sm mb-6">{proposal.description}</p>
                                        <div className="mb-6">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-400">For — {formatVotes(proposal.forVotes)} GLOFI ({pct}%)</span>
                                                <span className="text-gray-500">Against — {formatVotes(proposal.againstVotes)} GLOFI ({100 - pct}%)</span>
                                            </div>
                                            <div className="w-full bg-gray-800 rounded-full h-2">
                                                <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                                            </div>
                                        </div>
                                        {!connected ? (
                                            <button
                                                onClick={connectWallet}
                                                className="w-full border border-gray-700 text-gray-400 py-3 rounded-full font-semibold hover:border-white hover:text-white transition"
                                            >
                                                Connect Wallet to Vote
                                            </button>
                                        ) : voted ? (
                                            <div className="bg-gray-900 rounded-xl p-4 text-center">
                                                <p className="text-white font-semibold">
                                                    You voted {voted === 'for' ? 'For' : 'Against'} this proposal
                                                </p>
                                                {txHash && (
                                                    <a
                                                        href={`${NETWORK.explorer}/tx/${txHash}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-gray-400 hover:text-white mt-2 block"
                                                    >
                                                        View transaction
                                                    </a>
                                                )}
                                            </div>
                                        ) : proposal.active ? (
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => castVote(proposal.id, true)}
                                                    disabled={votingId === proposal.id}
                                                    className="flex-1 bg-gray-600 text-white py-3 rounded-full font-semibold hover:bg-white hover:text-black transition disabled:opacity-50"
                                                >
                                                    {votingId === proposal.id ? 'Voting...' : 'Vote For'}
                                                </button>
                                                <button
                                                    onClick={() => castVote(proposal.id, false)}
                                                    disabled={votingId === proposal.id}
                                                    className="flex-1 border border-gray-600 text-gray-400 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition disabled:opacity-50"
                                                >
                                                    {votingId === proposal.id ? 'Voting...' : 'Vote Against'}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="bg-gray-900 rounded-xl p-4 text-center">
                                                <p className="text-gray-400">Voting has ended</p>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </motion.div>

                {/* How Proxy Governance Works */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="border border-gray-800 rounded-2xl p-8 mt-16"
                >
                    <h2 className="text-2xl font-bold mb-4">Proxy Governance</h2>
                    <p className="text-gray-400 leading-relaxed mb-4">
                        Traditional investors without Web3 wallets can still participate in governance.
                        Through Glofi&apos;s proxy system, a verified agent votes on their behalf with the
                        same token weight — fully recorded on-chain.
                    </p>
                    <p className="text-gray-400 leading-relaxed">
                        The investor nominates an agent. Glofi verifies the relationship. The agent votes.
                        The investor can revoke access at any time. No trust required beyond the initial verification.
                    </p>
                </motion.div>

            </div>

            <Footer />
        </main>
    )
}