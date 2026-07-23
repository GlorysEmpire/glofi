/**
 * Shared Web3 helpers for the Glofi frontend.
 * Keep wallet, network, and error logic here so pages/hooks stay thin and consistent.
 */
import { ethers } from 'ethers'
import { NETWORK } from '@glofi/sdk'

// ─── Wallet provider ─────────────────────────────────────────────────────────

/** MetaMask / injected EIP-1193 provider (browser only). */
export function getEthereum(): ethers.Eip1193Provider {
  if (typeof window === 'undefined') {
    throw new Error('Wallet is only available in the browser')
  }
  const eth = (window as unknown as { ethereum?: ethers.Eip1193Provider }).ethereum
  if (!eth) {
    throw new Error('Please install MetaMask (or another Web3 wallet) to continue.')
  }
  return eth
}

// ─── Read-only RPC (with fallbacks) ──────────────────────────────────────────

/**
 * Cache the first RPC that answers eth_chainId this session.
 * Avoids hammering dead endpoints (e.g. official Amoy DNS outages).
 */
let cachedReadProvider: ethers.JsonRpcProvider | null = null
let cachedReadUrl: string | null = null

/**
 * Build a JsonRpcProvider against the first healthy Amoy endpoint.
 * Tries NETWORK.rpcUrls in order; throws only if every endpoint fails.
 */
export async function getReadProvider(): Promise<ethers.JsonRpcProvider> {
  if (cachedReadProvider && cachedReadUrl) {
    return cachedReadProvider
  }

  const urls = [...NETWORK.rpcUrls]
  const errors: string[] = []

  for (const url of urls) {
    try {
      const provider = new ethers.JsonRpcProvider(url, NETWORK.chainIdDecimal, {
        staticNetwork: true,
      })
      // Short probe — if this throws (DNS / CORS / timeout), try next URL
      const network = await Promise.race([
        provider.getNetwork(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('RPC timeout')), 8_000)
        ),
      ])
      if (Number(network.chainId) !== NETWORK.chainIdDecimal) {
        errors.push(`${url}: wrong chain ${network.chainId}`)
        continue
      }
      cachedReadProvider = provider
      cachedReadUrl = url
      return provider
    } catch (err) {
      errors.push(`${url}: ${errMsg(err)}`)
    }
  }

  throw new Error(
    `Could not reach Polygon Amoy RPC. Tried ${urls.length} endpoints. ${errors[0] ?? ''}`.trim()
  )
}

/** Forget cached RPC (e.g. after user reports stale data). */
export function resetReadProvider(): void {
  cachedReadProvider = null
  cachedReadUrl = null
}

// ─── Error messages (user-facing) ────────────────────────────────────────────

/**
 * Turn ethers / MetaMask errors into short messages the user can act on.
 * Avoid dumping full stack traces into the UI.
 */
export function errMsg(err: unknown): string {
  if (err == null) return 'Unknown error'
  if (typeof err === 'string') return err

  const e = err as {
    code?: number | string
    shortMessage?: string
    reason?: string
    message?: string
    data?: { message?: string }
    error?: { message?: string }
    info?: { error?: { message?: string } }
  }

  // User clicked "Reject" in the wallet
  if (e.code === 4001 || e.code === 'ACTION_REJECTED') {
    return 'Transaction rejected in wallet.'
  }

  // Chain not present in wallet
  if (e.code === 4902) {
    return 'Network not found in wallet. Please add Polygon Amoy Testnet.'
  }

  const raw =
    e.shortMessage ||
    e.reason ||
    e.info?.error?.message ||
    e.data?.message ||
    e.error?.message ||
    e.message ||
    'Transaction failed'

  // Browser fetch / CORS / DNS failures (common with public RPCs)
  if (/failed to fetch|networkerror|load failed|fetch failed/i.test(raw)) {
    return 'Could not reach the blockchain RPC. Check your internet or try again in a moment.'
  }

  // Map common contract reverts to plain English
  if (/insufficient pool liquidity/i.test(raw)) {
    return 'Pool does not have enough free liquidity for this tier.'
  }
  if (/Already has active challenge/i.test(raw)) {
    return 'You already have an active challenge.'
  }
  if (/user rejected|denied/i.test(raw)) {
    return 'Transaction rejected in wallet.'
  }
  if (/insufficient funds|insufficient balance/i.test(raw)) {
    return 'Insufficient balance for this transaction.'
  }
  if (/network|chain/i.test(raw) && /wrong|unsupported|mismatch/i.test(raw)) {
    return `Please switch to ${NETWORK.name} (chain ${NETWORK.chainIdDecimal}).`
  }

  return raw.replace(/^execution reverted:\s*/i, '').slice(0, 200)
}

// ─── Network enforcement (N7) ────────────────────────────────────────────────

/**
 * Ensure the connected wallet is on Polygon Amoy before any write tx.
 * Switches chain, or adds Amoy if the wallet does not know it yet.
 */
export async function ensureAmoy(): Promise<void> {
  const ethereum = getEthereum()
  const current = (await ethereum.request({ method: 'eth_chainId' })) as string
  if (current?.toLowerCase() === NETWORK.chainId.toLowerCase()) return

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: NETWORK.chainId }],
    })
  } catch (switchError: unknown) {
    const code = (switchError as { code?: number }).code
    // 4902 = chain unknown → add then user can retry
    if (code === 4902) {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: NETWORK.chainId,
            chainName: NETWORK.name,
            nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
            // Multiple RPCs so MetaMask can fall back if one is dead
            rpcUrls: [...NETWORK.rpcUrls],
            blockExplorerUrls: [NETWORK.explorer],
          },
        ],
      })
    } else {
      throw new Error(`Please switch your wallet to ${NETWORK.name}.`)
    }
  }
}

// ─── Safe casting from ethers Result ─────────────────────────────────────────

/** Coerce contract return values to bigint without throwing. */
export function asBigInt(val: unknown, fallback: bigint = BigInt(0)): bigint {
  if (val === undefined || val === null) return fallback
  if (typeof val === 'bigint') return val
  if (typeof val === 'number' && Number.isFinite(val)) return BigInt(Math.trunc(val))
  if (typeof val === 'string' && val !== '') {
    try {
      return BigInt(val)
    } catch {
      return fallback
    }
  }
  try {
    return BigInt(String(val))
  } catch {
    return fallback
  }
}

/** Coerce contract return values to a finite number (enums, day counts, %). */
export function asNumber(val: unknown, fallback = 0): number {
  if (val === undefined || val === null) return fallback
  if (typeof val === 'boolean') return val ? 1 : 0
  if (typeof val === 'number' && Number.isFinite(val)) return val
  if (typeof val === 'bigint') {
    const n = Number(val)
    return Number.isFinite(n) ? n : fallback
  }
  const n = Number(String(val))
  return Number.isFinite(n) ? n : fallback
}

// ─── Amount formatting ───────────────────────────────────────────────────────

/**
 * Pool mints GLOFI using raw USDC amounts (6 decimals) into an 18-decimal ERC20.
 * Founding allocation uses full 18-decimal mint (15M * 1e18).
 *
 * Heuristic for display:
 * - raw >= 1e12 → treat as 18-decimal ERC-20 (founder / large holdings)
 * - otherwise → treat as 6-decimal pool mint units (typical LP deposits)
 */
export function formatGlofiBalance(raw: bigint | string | number): string {
  try {
    const value = typeof raw === 'bigint' ? raw : BigInt(String(raw))
    const threshold = BigInt('1000000000000') // 1e12
    if (value >= threshold) {
      return ethers.formatEther(value)
    }
    return ethers.formatUnits(value, 6)
  } catch {
    return '0'
  }
}

/** @deprecated use formatGlofiBalance — kept for call sites during transition */
export function formatGlofiLp(amount: bigint | string | number): string {
  return formatGlofiBalance(amount)
}

/** USDC is always 6 decimals on Amoy Circle test token. */
export function formatUsdc(amount: bigint | string | number): string {
  try {
    return ethers.formatUnits(amount, 6)
  } catch {
    return '0'
  }
}

/**
 * Compact display for dashboard cards — never overflow with scientific monsters.
 * Examples: 15000000 → "15.00M", 1234.56 → "1.23K", 0.0042 → "0.0042"
 */
export function formatCompact(amount: string | number, maxFrac = 2): string {
  const n = typeof amount === 'number' ? amount : Number(amount)
  if (!Number.isFinite(n)) return '0'
  const sign = n < 0 ? '-' : ''
  const abs = Math.abs(n)

  if (abs >= 1e15) return sign + (abs / 1e15).toFixed(maxFrac) + 'Q'
  if (abs >= 1e12) return sign + (abs / 1e12).toFixed(maxFrac) + 'T'
  if (abs >= 1e9) return sign + (abs / 1e9).toFixed(maxFrac) + 'B'
  if (abs >= 1e6) return sign + (abs / 1e6).toFixed(maxFrac) + 'M'
  if (abs >= 1e3) return sign + (abs / 1e3).toFixed(maxFrac) + 'K'
  if (abs >= 1) {
    return (
      sign +
      abs.toLocaleString(undefined, {
        maximumFractionDigits: maxFrac,
        minimumFractionDigits: 0,
      })
    )
  }
  if (abs === 0) return '0'
  // Sub-1: keep short, avoid long dust strings
  return sign + abs.toFixed(Math.min(4, maxFrac + 2)).replace(/\.?0+$/, '')
}

// ─── Explorers ───────────────────────────────────────────────────────────────

export function explorerTx(hash: string): string {
  return `${NETWORK.explorer}/tx/${hash}`
}

export function explorerAddress(address: string): string {
  return `${NETWORK.explorer}/address/${address}`
}
