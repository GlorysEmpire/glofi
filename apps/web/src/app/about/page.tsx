'use client'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AboutPage() {
    return (
        <main className="min-h-screen text-white">

            <Navbar />

            <div className="max-w-4xl mx-auto px-6 pt-44 pb-20">

                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="mb-20"
                >
                    <p className="text-green-400 font-semibold mb-4">About Glofi</p>
                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        The first fully on-chain proprietary trading firm.
                    </h1>
                    <p className="text-xl text-gray-300 leading-relaxed">
                        Glofi was built on a simple but powerful observation — the prop firm industry is broken by trust. Traders pay to prove their skill, pass rigorous evaluations, and then depend entirely on a company's word that they'll be paid. The company controls the rules, the funds, and the database. Glofi is here to change that permanently.
                    </p>
                </motion.div>

                {/* The Problem */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <h2 className="text-3xl font-bold mb-2">The Problem</h2>
                    <p className="text-gray-400 mb-8">The prop firm industry is built on a foundation of trust, and trust is a liability. </p>

                    <div className="flex flex-col gap-6">
                        <div className="border border-gray-800 rounded-2xl p-8">
                            <h3 className="text-xl font-bold mb-3 text-red-400">The Trust Problem</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Traders pay challenge fees, pass evaluations, earn the right to a funded account, then rely entirely on a company's word that they will be paid. The company controls the rules, controls the funds, controls the database. They can change the terms, delay payouts, or simply go bankrupt. And there is nothing the trader can do about it. <span className="text-white font-semibold">We've seen it happen — repeatedly.</span>
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* The Shift */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <h2 className="text-3xl font-bold mb-2">The Shift</h2>
                    <p className="text-gray-400 mb-8">The problem isn't the prop firm model — the model works. The problem is centralisation.</p>

                    <div className="border border-gray-800 rounded-2xl p-8">
                        <p className="text-gray-300 leading-relaxed text-lg">
                            When one company holds all the data, all the funds, and all the rules,
                            you've created a single point of failure. What we asked is:
                            <span className="text-white font-semibold"> what if the rules didn't live in a company?
                                What if they lived in a system — one that no single person, company,
                                or government has sovereignty over? A system governed entirely by
                                mathematics, visible to everyone, owned by no one.</span>
                        </p>
                        <p className="text-green-400 font-bold text-xl mt-6">
                            That system exists. It is called a blockchain.
                        </p>
                    </div>
                </motion.div>

                {/* The Solution */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <h2 className="text-3xl font-bold mb-2">The Solution</h2>
                    <p className="text-gray-400 mb-8">In Glofi trust is replaced with verification.</p>

                    <div className="flex flex-col gap-6">
                        <div className="border border-gray-800 rounded-2xl p-8">
                            <h3 className="text-xl font-bold mb-3 text-green-400">Smart contracts execute everything</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Every rule, every payout, every allocation is executed automatically
                                by smart contracts — programs that live on the blockchain, immutable
                                by default. They cannot be altered, bribed, or pressured. They execute
                                exactly as written, every time, for every trader,
                                <span className="text-white font-semibold"> regardless of who they are
                                    or how much they are owed.</span> The code is public.
                                Anyone can read it and verify it does exactly what we say.
                            </p>
                        </div>

                        <div className="border border-gray-800 rounded-2xl p-8">
                            <h3 className="text-xl font-bold mb-3 text-green-400">Investors own the system</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Investors deposit USDC into the liquidity pool and receive GLOFI
                                governance tokens — <span className="text-white font-semibold">a direct, verifiable stake in the platform's
                                    performance.</span> As a governance token holder, you are not a passive
                                investor hoping a company performs. You are a co-owner of the system
                                itself. Your token represents a real stake in the pool. Your vote
                                shapes how the platform evolves. And your returns are not dependent
                                on our goodwill — <span className="text-white font-semibold">they are enforced by mathematics.</span>
                            </p>
                        </div>

                        <div className="border border-gray-800 rounded-2xl p-8">
                            <h3 className="text-xl font-bold mb-3 text-green-400">The platform can evolve — but not unilaterally</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Any change to the system requires a vote from governance token holders.
                                The investors themselves decide how the platform grows. This is not
                                a company making promises about the future. This is a system where
                                the future is determined collectively, transparently, on-chain.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* How It Works */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <h2 className="text-3xl font-bold mb-8">How It Works</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="border border-gray-800 rounded-2xl p-8">
                            <p className="text-5xl mb-4">🏆</p>
                            <h3 className="text-xl font-bold mb-3">For Traders</h3>
                            <p className="text-gray-400 leading-relaxed mb-4">
                                Pay a challenge fee. Trade under defined rules. Pass — evaluated
                                automatically by smart contract — and receive a funded account
                                allocation. Profitable traders earn an 80% profit split,
                                paid automatically on-chain.
                            </p>
                            <Link href="/trader">
                                <button className="border border-gray-700 text-gray-400 px-5 py-2 rounded-full text-sm font-semibold hover:border-white hover:text-white transition">
                                    View Challenges →
                                </button>
                            </Link>
                        </div>
                        <div className="border border-gray-800 rounded-2xl p-8">
                            <p className="text-5xl mb-4">💰</p>
                            <h3 className="text-xl font-bold mb-3">For Investors</h3>
                            <p className="text-gray-400 leading-relaxed mb-4">
                                Deposit USDC, receive GLOFI tokens. Your stake grows as the Pool grows. Vote on platform decisions.
                                Withdraw at any time — your funds are never locked.
                            </p>
                            <Link href="/investor">
                                <button className="border border-gray-700 text-gray-400 px-5 py-2 rounded-full text-sm font-semibold hover:border-white hover:text-white transition">
                                    Invest in Pool →
                                </button>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Liquidity Protection */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <h2 className="text-3xl font-bold mb-2">Liquidity Protection</h2>
                    <p className="text-gray-400 mb-8">Built for everyone — traders and investors equally.</p>

                    <div className="flex flex-col gap-6">
                        <div className="border border-gray-800 rounded-2xl p-8">
                            <h3 className="text-xl font-bold mb-3 text-green-400">The pool only funds what it can pay</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Before any challenge opens, the smart contract automatically
                                verifies the pool has sufficient free liquidity to cover the
                                potential payout. This keeps the pool healthy and ensures every
                                trader who passes is guaranteed their reward — not by our promise,
                                but by the code.
                            </p>
                        </div>

                        <div className="border border-gray-800 rounded-2xl p-8">
                            <h3 className="text-xl font-bold mb-3 text-green-400">Your investment is always accounted for</h3>
                            <p className="text-gray-300 leading-relaxed">
                                When a trader is funded, their allocation is reserved inside the
                                pool contract. This means the pool's numbers are always accurate
                                and transparent — investors always know exactly how much liquidity
                                is free, reserved, and actively generating returns.
                            </p>
                        </div>

                        <div className="border border-gray-800 rounded-2xl p-8">
                            <h3 className="text-xl font-bold mb-3 text-green-400">Two ways to exit, always on your terms</h3>
                            <p className="text-gray-300 leading-relaxed">
                                GLOFI token holders can sell their tokens on the open market at
                                any time for instant liquidity. Direct pool withdrawal is available
                                whenever reserved allocations are clear. Two exit paths, zero
                                lock-in — your investment is always accessible.
                            </p>
                        </div>

                        <div className="border border-gray-800 rounded-2xl p-8 text-center">
                            <p className="text-white font-semibold text-lg">
                                A platform where traders are always paid, investors are always
                                protected, and the numbers are always honest.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Smart Contracts */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <h2 className="text-3xl font-bold mb-6">Smart Contract Architecture</h2>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        Glofi is powered by five smart contracts deployed on the Polygon
                        blockchain. Each contract handles a specific function and cannot
                        be altered without governance approval.
                    </p>
                    <div className="flex flex-col gap-4">
                        {[
                            { num: '01', title: 'Governance Token (GLOFI)', desc: 'ERC-20 token representing investor ownership. Minted on deposit, burned on withdrawal. Carries voting rights proportional to holdings.' },
                            { num: '02', title: 'Liquidity Pool', desc: 'Holds all investor USDC. Manages shares, tracks allocations to funded traders, receives profit distributions.' },
                            { num: '03', title: 'Challenge Contract', desc: 'Manages challenge registration, fee collection, rule enforcement, drawdown monitoring and automatic pass/fail evaluation.' },
                            { num: '04', title: 'Payout Contract', desc: 'Handles profit splits for funded traders. Distributes 80% to trader, 15% to pool, 5% to platform treasury. Manages clawbacks on rule violations.' },
                            { num: '05', title: 'Proxy Governance Contract', desc: 'Enables traditional investors without Web3 wallets to participate in governance through a designated agent system with oracle verification.' },
                        ].map((contract) => (
                            <div key={contract.num} className="border border-gray-800 rounded-xl p-6 flex gap-6 items-start">
                                <div className="bg-gray-900 rounded-lg px-3 py-1 text-sm font-mono text-green-400 whitespace-nowrap">{contract.num}</div>
                                <div>
                                    <h3 className="font-bold mb-1">{contract.title}</h3>
                                    <p className="text-gray-400 text-sm">{contract.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Roadmap */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <h2 className="text-3xl font-bold mb-2">Roadmap</h2>
                    <p className="text-gray-400 mb-8">Where we are and where we are going.</p>

                    <div className="flex flex-col gap-4">
                        {[
                            { phase: 'Phase 1', title: 'Testnet Launch', status: 'complete', desc: 'All 5 smart contracts deployed and verified on Polygon Amoy. Full platform live — traders, investors, governance, payouts.' },
                            { phase: 'Phase 2', title: 'Evaluation Integration', status: 'building', desc: 'MetaTrader integration via oracle bridge. Automated evaluation server reads trading performance and submits results to smart contract. No human in the loop.' },
                            { phase: 'Phase 3', title: 'Mainnet Launch', status: 'upcoming', desc: 'Full security audit completed. Contracts deployed to Polygon mainnet. Real USDC, real traders, real payouts.' },
                            { phase: 'Phase 4', title: 'Funded Phase On-Chain', status: 'upcoming', desc: 'Funded trader execution fully on-chain via decentralised exchange integration. Complete trustless trading lifecycle.' },
                            { phase: 'Phase 5', title: 'Proprietary Trading Platform', status: 'upcoming', desc: 'Custom-built trading interface designed specifically for the Glofi architecture. Full vertical integration from execution to payout.' },
                        ].map((item) => (
                            <div key={item.phase} className="border border-gray-800 rounded-xl p-6 flex gap-6 items-start">
                                <div className="flex flex-col items-center gap-2 min-w-fit">
                                    <div className={`text-xs font-bold px-3 py-1 rounded-full ${
                                        item.status === 'complete' ? 'bg-green-500 text-white' :
                                        item.status === 'building' ? 'bg-blue-500 text-white' :
                                        'bg-gray-700 text-gray-300'
                                    }`}>
                                        {item.status === 'complete' ? 'COMPLETE' : item.status === 'building' ? 'BUILDING' : 'UPCOMING'}
                                    </div>
                                    <p className="text-gray-500 text-xs font-mono">{item.phase}</p>
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">{item.title}</h3>
                                    <p className="text-gray-400 text-sm">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* The Close */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="border border-gray-800 rounded-2xl p-10 text-center mb-20"
                >
                    <h2 className="text-3xl font-bold mb-6">Why Glofi?</h2>
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">
                        If you are a trader who has been burned before and you ask —
                        <span className="text-white font-semibold"> "why should I trust your platform?"</span> —
                        our answer is this:
                    </p>
                    <p className="text-2xl font-bold text-white mb-2">
                        You don't need to trust us.
                    </p>
                    <p className="text-2xl font-bold text-white mb-2">
                        You don't need to trust anyone.
                    </p>
                    <p className="text-2xl font-bold text-green-400 mb-8">
                        You only need to trust the system.
                    </p>
                    <p className="text-gray-400 mb-10">
                        A system determined by mathematics. A system no one has sovereignty over.
                        A system that is fully transparent. That is what we built.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/trader">
                            <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
                                Start Trading
                            </button>
                        </Link>
                        <Link href="/investor">
                            <button className="border border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition">
                                Invest in Pool
                            </button>
                        </Link>
                    </div>
                </motion.div>

            </div>

            <Footer />

        </main>
    )
}