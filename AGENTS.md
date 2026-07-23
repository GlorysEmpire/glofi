# AGENTS.md — guidance for AI coding agents

## Project

Glofi is an on-chain prop trading firm monorepo (Polygon Amoy testnet MVP).

## Structure (do not invent parallel trees)

- `apps/web` — Next.js 16 App Router (`src/app`, `src/components`, `src/hooks`, `src/providers`, `src/lib`)
- `packages/sdk` — `@glofi/sdk` shared addresses/ABIs/tiers/types
- `contracts` — Hardhat + Solidity
- `docs` — brief + audit + codemap

## Rules

1. **Single source of truth for chain config:** only edit `packages/sdk` for addresses/ABIs/tiers.
2. **Imports:** web uses `@/` for local src and `@glofi/sdk` for shared config.
3. **Comments:** section headers explaining intent; match existing style.
4. **No nested apps** like a second copy of the frontend.
5. **Do not remove testnet banner** while on Amoy.
6. Prefer fixing errors with user-visible messages (`errMsg`, `ensureAmoy`).
7. Do not commit secrets or run mainnet deploys without explicit human instruction.
8. Product priorities: `docs/CLIENT_BRIEF_AND_PLAN.md`.

## Common tasks

| Task | Start here |
|------|------------|
| UI bug | `apps/web/src/app` or `components` |
| Wallet / tx | `apps/web/src/hooks`, `src/lib/web3.ts` |
| New tier fee display | `packages/sdk/src/tiers.ts` + trader page |
| Contract change | `contracts/contracts` then refresh ABIs into `packages/sdk/src/abis` |
