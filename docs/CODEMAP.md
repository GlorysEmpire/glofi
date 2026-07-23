# Glofi CODEMAP

Quick map of the monorepo for humans and agents.

## Apps

### `apps/web` (`@glofi/web`)

| Path | Purpose |
|------|---------|
| `src/app/` | Next.js routes (`/`, `/trader`, `/investor`, `/dashboard`, `/governance`, `/about`, `/contracts-info`) |
| `src/components/layout/` | Navbar, Footer |
| `src/components/` | Cross-page UI (e.g. TestnetBanner) |
| `src/providers/` | WalletProvider, I18nProvider |
| `src/hooks/` | `useGlofiChallenge`, `useGlofiToken` |
| `src/lib/web3.ts` | `ensureAmoy`, `errMsg`, formatters |
| `src/i18n/` | i18next init (partial) |
| `public/` | Static assets |

## Packages

### `packages/sdk` (`@glofi/sdk`)

| Path | Purpose |
|------|---------|
| `src/addresses.ts` | Deployed addresses |
| `src/network.ts` | Amoy RPC / chain id / explorer |
| `src/tiers.ts` | Challenge tier UI + fee raw values |
| `src/contracts.ts` | Address + ABI map |
| `src/abis/*.json` | Contract ABIs |
| `src/types.ts` | Shared TS types / enums |
| `src/index.ts` | Public exports |

## Contracts

### `contracts` (`@glofi/contracts`)

| Path | Purpose |
|------|---------|
| `contracts/*.sol` | GlofiToken, Pool, Challenge, Payout, ProxyGovernance |
| `scripts/` | Ops scripts (set pool, evaluate, proposals) |
| `ignition/` | Deploy modules + Amoy deployment journal |
| `test/` | Hardhat tests (expand these) |
| `archive/flatten/` | Flattened sources for explorers/audits |
| `deployed-contracts.md` | Human address table |

## Docs

| Path | Purpose |
|------|---------|
| `CLIENT_BRIEF_AND_PLAN.md` | Product north star |
| `AUDIT_2026-07-18.md` | Prior audit |
| `CODEMAP.md` | This file |
| `REPO_HISTORY.md` | Old remote notes |

## Data flow (happy path)

```
Trader UI → useGlofiChallenge → ensureAmoy → USDC approve → GlofiChallenge.registerChallenge
Investor UI → useGlofiToken → ensureAmoy → USDC approve → GlofiPool.deposit / withdraw
Dashboard → getTraderChallenges (normalize) + balances + pending payout
Governance → ProxyGovernance.vote
```

All addresses/ABIs resolve through `@glofi/sdk`.
