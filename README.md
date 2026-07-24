# Glofi

Fully on-chain proprietary trading firm on Polygon.

Traders pay a challenge fee, prove skill under fixed rules, and get funded. Investors deposit USDC into a pool and receive governance tokens. Rules, allocations, and payouts are enforced by smart contracts — not by a company that can rewrite the outcome.

**Live (testnet):** [chain-firm.vercel.app](https://chain-firm.vercel.app)

---

## Problem

Traditional prop firms and DeFi trading desks still rely on trust:

- Traders hand fees to a firm that can change rules or delay payouts
- Investors cannot see how capital is allocated or enforced on-chain
- Challenge outcomes and profit splits often live off-chain, opaque, and reversible

Glofi puts the firm itself on-chain so challenge terms, pool shares, and payouts settle automatically.

---

## Stack

| Layer | Tools |
|-------|--------|
| Web app | Next.js, React, TypeScript, Tailwind CSS |
| Wallet / chain | ethers.js, MetaMask, Polygon (Amoy testnet → Mainnet) |
| Contracts | Solidity, Hardhat |
| Shared config | `@glofi/sdk` (addresses, ABIs, tiers) |
| Monorepo | npm workspaces |
| Deploy | Vercel (web), Polygon for contracts |

```
apps/web          # product UI
packages/sdk      # chain config shared by clients
contracts         # Solidity + Hardhat
```

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use a wallet on Polygon Amoy for on-chain actions.
