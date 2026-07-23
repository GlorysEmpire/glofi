/**
 * Challenge tiers — must match on-chain GlofiChallenge constructor / test deploy.
 * Production mainnet fees ($49 / $5k …) live in docs until redeploy.
 */

export const CHALLENGE_TIERS = {
  tier1: {
    key: 'tier1' as const,
    id: 0,
    name: 'Tier 1',
    feeUsdc: 10,
    feeRaw: '10000000', // 10 * 1e6
    fundedUsdc: 100,
    fundedLabel: '$100',
    feeLabel: '$10',
    drawdown: '10%',
    target: '8%',
    days: '30',
    testnet: true,
  },
  tier2: {
    key: 'tier2' as const,
    id: 1,
    name: 'Tier 2',
    feeUsdc: 149,
    feeRaw: '149000000',
    fundedUsdc: 25_000,
    fundedLabel: '$25,000',
    feeLabel: '$149',
    drawdown: '10%',
    target: '8%',
    days: '30',
    testnet: true,
  },
  tier3: {
    key: 'tier3' as const,
    id: 2,
    name: 'Tier 3',
    feeUsdc: 399,
    feeRaw: '399000000',
    fundedUsdc: 100_000,
    fundedLabel: '$100,000',
    feeLabel: '$399',
    drawdown: '10%',
    target: '8%',
    days: '30',
    testnet: true,
  },
} as const

export type TierKey = keyof typeof CHALLENGE_TIERS
export type ChallengeTier = typeof CHALLENGE_TIERS
