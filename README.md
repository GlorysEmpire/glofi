# Glofi

**On-chain proprietary trading firm** — traders prove skill, investors fund the pool, rules and payouts settle on Polygon.

| | |
|---|---|
| **Stage** | Testnet MVP (Polygon Amoy) |
| **Live** | [chain-firm.vercel.app](https://chain-firm.vercel.app) |
| **Brand** | Glofi (repo may still say “chain-firm”) |

---

## Monorepo layout

```
Glofi/
├── apps/
│   └── web/              # Next.js dapp (primary product UI)
├── packages/
│   └── sdk/              # @glofi/sdk — addresses, ABIs, tiers, types
├── contracts/            # Hardhat + Solidity
├── docs/                 # Product brief, audit notes
├── package.json          # npm workspaces root
└── .env.example
```

### Why this shape

| Package | Role | Future |
|---------|------|--------|
| `apps/web` | Marketing + wallet dapp | Stay the public web surface |
| `packages/sdk` | Shared chain config | Import from **Expo / React Native**, bots, scripts |
| `contracts` | On-chain system of record | Audit, mainnet deploy |
| `apps/mobile` (not yet) | Native app | Add when ready — reuse `@glofi/sdk` |

Nothing chain-specific is hardcoded only inside a page. **One SDK, many clients.**

---

## Prerequisites

- **Node.js 20+**
- MetaMask (or another injected wallet) for Amoy
- Amoy MATIC + test USDC for writes

---

## Quick start

```bash
# from monorepo root
cd ~/Glofi
npm install

# web app
npm run dev
# → http://localhost:3000
```

### Useful scripts (root)

| Command | What it does |
|---------|----------------|
| `npm run dev` | Start Next.js web |
| `npm run build` | Production build of web |
| `npm run lint` | ESLint web |
| `npm run typecheck` | `tsc --noEmit` for web |
| `npm run contracts:compile` | Hardhat compile |
| `npm run contracts:test` | Hardhat tests |

Workspace-scoped:

```bash
npm run dev -w @glofi/web
npm run compile -w @glofi/contracts
```

---

## Shared SDK (`@glofi/sdk`)

```ts
import {
  CONTRACTS,
  NETWORK,
  CHALLENGE_TIERS,
  USDC_ADDRESS,
  ADDRESSES,
} from '@glofi/sdk'
```

Use this package from:

- Next pages / hooks
- Future mobile app
- Ops scripts / admin tools

When you redeploy a contract, update **`packages/sdk/src/addresses.ts`** (and ABIs under `packages/sdk/src/abis/` if the interface changes).

---

## Contracts

```bash
cd contracts
# or: npm run compile -w @glofi/contracts
npx hardhat compile
```

- Solidity: `contracts/contracts/`
- Deploy notes: `contracts/deployed-contracts.md`
- Ops scripts: `contracts/scripts/`
- Flattened audit copies: `contracts/archive/flatten/`

Secrets: copy root `.env.example` → `contracts/.env` (never commit).

---

## Working with others

1. Read `docs/CLIENT_BRIEF_AND_PLAN.md` (product north star).
2. Read `CONTRIBUTING.md` (branches, PRs, conventions).
3. Prefer PRs into `main`; keep commits small and focused.
4. Do not commit `.env`, private keys, or mainnet secrets.
5. AI / agent notes: root `AGENTS.md` + `docs/CODEMAP.md`.

Suggested remote (single monorepo):

```bash
# once, from Glofi root
git init
git remote add origin git@github.com:GlorysEmpire/glofi.git   # or your org
```

> Nested `chain-firm` / contracts remotes were removed so collab is **one repo**. History notes: `docs/REPO_HISTORY.md`.

---

## Scaling to a mobile app

When you are ready:

```
apps/
  web/          # existing
  mobile/       # Expo or RN — npm workspace
packages/
  sdk/          # already shared
  ui/           # optional design system later
```

Mobile should import `@glofi/sdk` for addresses/ABIs and a wallet adapter (e.g. WalletConnect). No need to fork contract config.

---

## Docs

| Doc | Purpose |
|-----|---------|
| `docs/CLIENT_BRIEF_AND_PLAN.md` | Product, rules, roadmap |
| `docs/AUDIT_2026-07-18.md` | Code audit snapshot |
| `docs/CODEMAP.md` | Where code lives |
| `CONTRIBUTING.md` | Team workflow |

---

## License

Private / MIT workspace packages — confirm before open-sourcing.
