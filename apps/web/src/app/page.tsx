'use client'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useGlofiToken } from '@/hooks/useGlofiToken'

export default function Home() {
    const { totalSupply, totalPoolValue, loading } = useGlofiToken()

    return (
        <main className="min-h-screen bg-black text-white">

            <Navbar />

            {/* Hero — pt-44 clears testnet banner + fixed navbar */}
            <div className="flex flex-col items-center justify-center px-6 pt-44 pb-20 text-center">

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-7xl md:text-8xl font-bold text-center mb-6 bg-clip-text text-transparent"
                    style={{ backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #a8c8e8 50%, #7eb3d4 100%)' }}
                >
                    The Future of Prop Trading
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-xl text-gray-200 text-center max-w-2xl mb-10"
                >
                    A fully on-chain proprietary trading firm. No trust required.
                    Every rule, every payout, every allocation — executed automatically
                    by smart contracts.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="flex gap-4"
                >
                    <Link href="/trader">
                        <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
                            Start Trading
                        </button>
                    </Link>
                    <Link href="/investor">
                        <button className="border border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition">
                            Invest in the Pool
                        </button>
                    </Link>
                </motion.div>

            </div>

            {/* How It Works Section */}
            <div className="px-6 pb-24 max-w-4xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="text-3xl font-bold text-center mb-16"
                >
                    How It Works
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center text-center"
                    >
                        <div className="text-5xl mb-6">🏆</div>
                        <h3 className="text-xl font-bold mb-3">Traders Compete</h3>
                        <p className="text-gray-400">
                            Pay a challenge fee, prove your trading skill.
                            Smart contracts evaluate your performance automatically —
                            no human bias, no manipulation.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center text-center"
                    >
                        <div className="text-5xl mb-6">💰</div>
                        <h3 className="text-xl font-bold mb-3">Investors Fund the Pool</h3>
                        <p className="text-gray-400">
                            Deposit USDC, receive governance tokens.
                            Your stake grows as profitable traders
                            generate returns for the pool.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center text-center"
                    >
                        <div className="text-5xl mb-6">⚡</div>
                        <h3 className="text-xl font-bold mb-3">Smart Contracts Execute</h3>
                        <p className="text-gray-400">
                            No company in the middle. No trust required.
                            Every payout, every allocation, every rule —
                            enforced automatically by code.
                        </p>
                    </motion.div>

                </div>
            </div>

            {/* Stats Section */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="border-t border-gray-800 px-6 py-16"
            >
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-4xl font-bold mb-2 text-blue-300">${loading ? '...' : Number(totalPoolValue).toLocaleString()}</p>
                        <p className="text-gray-400">Total Pool Size</p>
                        <p className="text-gray-600 text-xs mt-1">Grows with every deposit</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-4xl font-bold mb-2 text-blue-300">5</p>
                        <p className="text-gray-400">Smart Contracts</p>
                        <p className="text-gray-600 text-xs mt-1">Live on Polygon</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-4xl font-bold mb-2 text-blue-300">{loading ? '...' : (Number(totalSupply) >= 1_000_000 ? (Number(totalSupply) / 1_000_000).toFixed(2) + 'M' : Number(totalSupply).toLocaleString())}</p>
                        <p className="text-gray-400">GLOFI in Circulation</p>
                        <p className="text-gray-600 text-xs mt-1">Live from blockchain</p>
                    </motion.div>
                </div>
            </motion.div>

            <Footer />

        </main>
    )
}