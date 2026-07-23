'use client'

import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { motion } from 'framer-motion'

export default function NotFound() {
    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center px-6 pt-44 pb-20 text-center">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <p className="text-8xl font-bold text-gray-800 mb-6">404</p>
                    <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
                    <p className="text-gray-400 text-xl max-w-md mb-10">
                        This page doesn't exist on-chain or off-chain.
                        Let's get you back to somewhere real.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <Link href="/">
                            <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
                                Go Home
                            </button>
                        </Link>
                        <Link href="/trader">
                            <button className="border border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition">
                                Start Trading
                            </button>
                        </Link>
                    </div>
                </motion.div>

            </div>
        </main>
    )
}