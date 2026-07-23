'use client'

import Link from 'next/link'
import { useWallet } from '@/providers/WalletProvider'
import { useState } from 'react'

export default function Navbar() {
    const { connected, walletAddress, connectWallet, disconnectWallet, loading } = useWallet()
    const [showDisconnectMessage, setShowDisconnectMessage] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    function shortAddress(addr: string) {
        return addr.slice(0, 6) + '...' + addr.slice(-4)
    }

    function handleDisconnect() {
        disconnectWallet()
        setShowDisconnectMessage(true)
        setMenuOpen(false)
        setTimeout(() => setShowDisconnectMessage(false), 8000)
    }

    return (
        <>
            {/* top-10 clears the fixed testnet banner; z-50 under banner z-[60] */}
            <nav className="fixed top-10 left-0 right-0 z-50 border-b border-gray-800 bg-black">

                {/* Main navbar row */}
                <div className="flex items-center justify-between px-6 py-4">

                    <Link
                        href="/"
                        className="font-bold text-xl hover:opacity-80 transition"
                        style={{ background: 'linear-gradient(135deg, #e2e8f0 0%, #7eb3d4 50%, #a8c8e8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                    >
                        Glofi
                    </Link>

                    {/* Desktop links */}
                    <div className="hidden md:flex gap-8">
                        <Link href="/" className="text-gray-400 hover:text-white transition">
                            Home
                        </Link>
                        <Link href="/trader" className="text-gray-400 hover:text-white transition">
                            Traders
                        </Link>
                        <Link href="/investor" className="text-gray-400 hover:text-white transition">
                            Investors
                        </Link>
                        <Link href="/governance" className="text-gray-400 hover:text-white transition">
                            Governance
                        </Link>
                        <Link href="/about" className="text-white hover:text-gray-300 transition">
                            About
                        </Link>
                        <Link href="/contracts-info" className="text-white hover:text-gray-300 transition">Contracts</Link>
                        {connected && (
                            <Link href="/dashboard" className="text-gray-400 hover:text-white transition font-semibold">
                                Dashboard
                            </Link>
                        )}
                    </div>

                    {/* Desktop wallet button */}
                    <div className="hidden md:flex items-center gap-3">
                        {connected ? (
                            <>
                                <Link href="/dashboard" className="text-blue-300 text-sm font-semibold hover:text-green-300 transition">
                                    {shortAddress(walletAddress)}
                                </Link>
                                <button
                                    onClick={handleDisconnect}
                                    className="border border-gray-700 text-gray-400 px-5 py-2 rounded-full text-sm font-semibold hover:border-red-500 hover:text-red-400 transition"
                                >
                                    Disconnect
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={connectWallet}
                                disabled={loading}
                                className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Connecting...' : 'Connect Wallet'}
                            </button>
                        )}
                    </div>

                    {/* Mobile right side */}
                    <div className="flex md:hidden items-center gap-3">
                        {connected && (
                            <Link href="/dashboard" className="text-blue-300 text-sm font-semibold hover:text-green-300 transition">
                                {shortAddress(walletAddress)}
                            </Link>
                        )}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-white p-2"
                        >
                            {menuOpen ? (
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 12h18M3 6h18M3 18h18" />
                                </svg>
                            )}
                        </button>
                    </div>

                </div>

                {/* Mobile menu dropdown */}
                {menuOpen && (
                    <div className="md:hidden border-t border-gray-800 px-6 py-4 flex flex-col gap-4">
                        <Link href="/" onClick={() => setMenuOpen(false)} className="text-gray-400 hover:text-white transition py-2">
                            Home
                        </Link>
                        <Link href="/trader" onClick={() => setMenuOpen(false)} className="text-gray-400 hover:text-white transition py-2">
                            Traders
                        </Link>
                        <Link href="/investor" onClick={() => setMenuOpen(false)} className="text-gray-400 hover:text-white transition py-2">
                            Investors
                        </Link>
                        <Link href="/governance" onClick={() => setMenuOpen(false)} className="text-gray-400 hover:text-white transition py-2">
                            Governance
                        </Link>
                        <Link href="/about" onClick={() => setMenuOpen(false)} className="text-white hover:text-gray-300 transition text-lg">About</Link>
                        <Link href="/contracts-info" onClick={() => setMenuOpen(false)} className="text-white hover:text-gray-300 transition text-lg">Contracts</Link>
                        {connected && (
                            <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-green-400 font-semibold hover:text-green-300 transition py-2">
                                Dashboard
                            </Link>
                        )}
                        <div className="border-t border-gray-800 pt-4">
                            {connected ? (
                                <button
                                    onClick={handleDisconnect}
                                    className="w-full border border-red-500 text-red-400 py-3 rounded-full font-semibold hover:bg-red-500 hover:text-white transition"
                                >
                                    Disconnect
                                </button>
                            ) : (
                                <button
                                    onClick={() => { connectWallet(); setMenuOpen(false) }}
                                    disabled={loading}
                                    className="w-full bg-white text-black py-3 rounded-full font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Connecting...' : 'Connect Wallet'}
                                </button>
                            )}
                        </div>
                    </div>
                )}

            </nav>

            {/* Disconnect Security Message */}
            {showDisconnectMessage && (
                <div className="fixed top-28 left-1/2 -translate-x-1/2 z-50 bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4 max-w-md w-full mx-4 shadow-xl">
                    <div className="flex gap-3 items-start">
                        <span className="text-yellow-400 text-xl">⚠️</span>
                        <div>
                            <p className="text-white font-semibold mb-1">Disconnected from Glofi</p>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                For complete security, open MetaMask → click the three dots →
                                Connected Sites → Remove Glofi. This ensures no site can access
                                your wallet without your permission.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowDisconnectMessage(false)}
                            className="text-gray-600 hover:text-white transition text-lg leading-none ml-2"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}