'use client'

/**
 * Sitewide testnet disclaimer (N5).
 * Always visible (not dismissible) so every visitor sees this is Amoy, not mainnet.
 * Navbar is offset with top-10 to sit under this bar.
 */
import { NETWORK } from '@glofi/sdk'

export default function TestnetBanner() {
  return (
    <div
      role="status"
      className="fixed top-0 left-0 right-0 z-[60] bg-amber-500 text-black text-sm md:text-base"
    >
      <div className="max-w-6xl mx-auto px-4 py-2 text-center">
        <p className="font-medium leading-snug">
          <span className="font-bold">Testnet only</span>
          {' — '}
          Glofi is live on {NETWORK.name}. Not real money. Do not send mainnet
          funds. Contracts and evaluation are experimental.
        </p>
      </div>
    </div>
  )
}
