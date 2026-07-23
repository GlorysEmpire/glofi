/**
 * Deployed contract addresses (single source of truth).
 * Update here when redeploying — every app consumes @glofi/sdk.
 */

export const ADDRESSES = {
  GlofiToken: '0x5B9dEE5d96BdF3F7E3aa4e4FD8A0ad29b4082a2C',
  GlofiPool: '0x43736a144cF4B9dcC2b9a2426C9D69F8Dd529803',
  /**
   * Test challenge deploy — Tier 1: $10 fee / $100 funded account.
   * Original (prod-tier params): 0x5c87511BEF3CddD7e1cfdABfA7173F6DA7554784
   */
  GlofiChallenge: '0xdb2b417b754544e139B154331e058193C8F46F3B',
  GlofiPayout: '0x78A9401c255Af3Df3DA73fbE7Fd7bB423a2d5d6c',
  ProxyGovernance: '0x30E07C200F18736665B69454796a486377d49EB2',
} as const

export type ContractName = keyof typeof ADDRESSES
