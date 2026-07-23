/**
 * @glofi/sdk — public surface for all Glofi clients.
 *
 * Web (Next), future mobile (Expo/RN), and tooling should import from here
 * instead of duplicating addresses or ABIs.
 */

export { NETWORK, AMOY_RPC_URLS, USDC_ADDRESS, type NetworkConfig } from './network'
export { ADDRESSES, type ContractName } from './addresses'
export { CHALLENGE_TIERS, type TierKey, type ChallengeTier } from './tiers'
export { CONTRACTS, type ContractsMap } from './contracts'
export {
  ChallengeStatus,
  CHALLENGE_STATUS_LABEL,
  TIER_LABEL,
  type ChallengeView,
} from './types'
