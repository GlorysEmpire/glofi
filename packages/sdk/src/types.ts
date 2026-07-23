/**
 * Shared domain types — safe to import from React Native / Next / Node.
 */

/** On-chain challenge status enum (GlofiChallenge.ChallengeStatus) */
export enum ChallengeStatus {
  Active = 0,
  Passed = 1,
  Failed = 2,
  Closed = 3,
}

/** UI-ready challenge after decoding chain data */
export type ChallengeView = {
  id: string
  trader: string
  tier: number
  startTime: number
  accountSize: string
  accountSizeRaw: string
  challengeFee: string
  profitTarget: number
  maxDrawdown: number
  minTradingDays: number
  tradingDaysCompleted: number
  currentPnL: string
  status: number
  funded: boolean
}

export const CHALLENGE_STATUS_LABEL: Record<number, string> = {
  [ChallengeStatus.Active]: 'Active',
  [ChallengeStatus.Passed]: 'Passed',
  [ChallengeStatus.Failed]: 'Failed',
  [ChallengeStatus.Closed]: 'Closed',
}

export const TIER_LABEL: Record<number, string> = {
  0: 'Tier 1',
  1: 'Tier 2',
  2: 'Tier 3',
}
