/**
 * Network constants for Glofi deployments.
 * Import from @glofi/sdk so web, mobile, and scripts share one truth.
 *
 * NOTE: Official `rpc-amoy.polygon.technology` often fails DNS / rate-limits.
 * Prefer PublicNode / dRPC (and fall back in getReadProvider).
 */

/** Ordered list of Amoy JSON-RPC endpoints (first = preferred). */
export const AMOY_RPC_URLS = [
  'https://polygon-amoy-bor-rpc.publicnode.com',
  'https://polygon-amoy.drpc.org',
  'https://rpc-amoy.polygon.technology',
] as const

/** Polygon Amoy testnet — current public MVP network */
export const NETWORK = {
  chainId: '0x13882',
  chainIdDecimal: 80002,
  name: 'Polygon Amoy Testnet',
  /** Primary read/write RPC (must be reachable from browsers) */
  rpcUrl: AMOY_RPC_URLS[0],
  /** All known endpoints for wallet_addEthereumChain + provider fallbacks */
  rpcUrls: AMOY_RPC_URLS,
  explorer: 'https://amoy.polygonscan.com',
  /** True until mainnet launch — UI should always surface this */
  isTestnet: true,
} as const

export type NetworkConfig = typeof NETWORK

/** Circle USDC on Polygon Amoy */
export const USDC_ADDRESS = '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582' as const
