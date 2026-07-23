# Glofi — CLIENT_BRIEF_AND_PLAN

**Source:** Owner brief (2026-07-18). North star for builds and investor conversations.  
**Public brand:** Glofi · **Repo name only:** chain-firm · **Live:** https://chain-firm.vercel.app  
**Stage:** Testnet MVP · **Network:** Polygon Amoy → Polygon Mainnet

---

### Product

**Positioning:** The first fully on-chain proprietary trading firm. No trust required.

**Elevator pitch:** Glofi is a decentralised prop trading firm where every rule, every payout, and every allocation is enforced automatically by smart contracts on the Polygon blockchain. Traders pay a challenge fee, prove their skill under defined rules, and receive a funded account. Investors deposit USDC into the liquidity pool and receive governance tokens representing their stake. No company controls the funds. No human can override the contracts. The system is the firm.

---

### Personas & Jobs-to-be-Done

| Persona | What they want | Success looks like |
|---|---|---|
| Retail trader | Prove skill, get funded without trusting a company | Pass challenge, receive funded allocation, get paid automatically |
| Investor / LP | Earn yield on USDC without active trading | Deposit USDC, receive GLOFI, watch value grow as traders profit |
| Token holder | Governance rights, platform ownership | Vote on proposals, earn from pool growth |
| Admin / ops | Platform running, traders paid, investors protected | All flows working, contracts secure, mainnet live |

---

### Current State (Honest)

**Working:**
- Wallet connect/disconnect via MetaMask
- Challenge registration (Tier 1 test contract) — full flow working on testnet
- USDC approval + on-chain challenge registration
- Investor deposit flow — USDC to pool, GLOFI minted
- Investor withdraw flow — GLOFI burned, USDC returned
- Governance page — live proposals, on-chain voting
- Dashboard — shows challenges, GLOFI balance, pending payout
- Contracts page — all 5 contracts with PolygonScan links
- About page — full investor narrative, roadmap
- Homepage — live blockchain stats

**Partial / broken:**
- Dashboard challenge display shows NaN (data mapping issue)
- Step 5 success screen — funded account still shows $5,000 instead of test $100
- Voting power on governance page shows but proposal count shows 0 sometimes
- Withdraw flow untested end-to-end
- Claim payout untested end-to-end

**Not built yet:**
- MetaTrader oracle bridge (evaluation phase)
- Funded phase on-chain execution
- Real liquidity provider integration
- KYC/AML layer for mainnet
- Proprietary trading platform
- Whitepaper
- Formal security audit

---

### Canonical Architecture

**Frontend routes:**

| Route | Purpose |
|---|---|
| `/` | Homepage — hero, how it works, live stats |
| `/trader` | Challenge registration — tier select, 5-step flow |
| `/investor` | Deposit/withdraw USDC, pool stats |
| `/governance` | Live proposals, on-chain voting |
| `/dashboard` | Wallet-specific data — challenges, tokens, payouts |
| `/about` | Investor narrative, roadmap, architecture |
| `/contracts-info` | All 5 contracts, PolygonScan links |

**Contracts (Amoy — see also `glofi-contracts/deployed-contracts.md`):**

| Contract | Address | Role |
|---|---|---|
| GlofiToken | `0x5B9dEE5d96BdF3F7E3aa4e4FD8A0ad29b4082a2C` | ERC-20 governance token, minted/burned by pool |
| GlofiPool | `0x43736a144cF4B9dcC2b9a2426C9D69F8Dd529803` | Holds USDC, manages shares, liquidity protection |
| GlofiChallenge | `0x5c87511BEF3CddD7e1cfdABfA7173F6DA7554784` (original) / test redeploy `0xdb2b417b754544e139B154331e058193C8F46F3B` | Challenge registration, pass/fail evaluation |
| GlofiPayout | `0x78A9401c255Af3Df3DA73fbE7Fd7bB423a2d5d6c` | Profit split, trader claims, clawbacks |
| ProxyGovernance | `0x30E07C200F18736665B69454796a486377d49EB2` | Proposals, voting, proxy agent system |

**Money flow:**
- Trader pays USDC fee → GlofiChallenge
- Challenge passes → GlofiPool reserves allocation
- Trader profits → Evaluator submits to GlofiPayout
- Split: **80% trader / 15% pool / 5% treasury** (canonical on-chain defaults)
- Trader `claimPayout()` → USDC
- Investor deposit USDC → pool mints GLOFI; withdraw burns GLOFI for free liquidity

---

### Business Rules (Canonical)

**Challenge tiers (production):**

| Tier | Fee | Funded Account | Profit Target | Max Drawdown | Min Days |
|---|---|---|---|---|---|
| Tier 1 | $49 | $5,000 | 8% | 10% | 30 |
| Tier 2 | $149 | $25,000 | 8% | 10% | 30 |
| Tier 3 | $399 | $100,000 | 8% | 10% | 30 |

**Test tier (current):** Tier 1 — $10 fee, $100 funded account

**Profit split:** 80% trader / 15% pool / 5% treasury (governance-adjustable; minimum 70% to trader)

**Pool / governance / evaluation:** as in owner brief (manual evaluator → MetaTrader oracle → funded on-chain TBD)

---

### Messaging & Legal

**Hero:** The Future of Prop Trading  
**Sub:** A fully on-chain proprietary trading firm. No trust required. Every rule, every payout, every allocation — executed automatically by smart contracts.  
**Closer:** You don't need to trust us. You don't need to trust anyone. You only need to trust the system.

**Disclaimers needed before mainnet:** risk of loss; past performance; GLOFI classification (legal review); geo-restrictions; **testnet banner on all current pages**.

---

### Necessary Upgrades (Before Real Users)

| ID | Item |
|----|------|
| N1 | Dashboard NaN fix — challenge field mapping |
| N2 | Production challenge contract / real tiers + pool funding strategy |
| N3 | Automated evaluator (not single-wallet manual) |
| N4 | Third-party security audit before mainnet |
| N5 | Testnet disclaimer banner sitewide |
| N6 | User-friendly tx error handling everywhere |
| N7 | Network enforcement (Amoy) on all write flows |
| N8 | Whitepaper (tokenomics, architecture, roadmap, risks) |
| N9 | Multisig owner (Gnosis Safe) before mainnet |
| N10 | KYC/AML as required by jurisdiction |

---

### Optional Upgrades (Post-Launch)

O1 Animated stats · O2 Trader leaderboard · O3 Dashboard analytics · O4 Notifications · O5 Mobile · O6 Staking challenge tier · O7 Multi-language · O8 DEX liquidity · O9 Proprietary trading platform · O10 Chainlink oracle

---

### Recommended Build Order

**Now:** N1 NaN · N6 errors · N5 disclaimer · E2E testnet flows · clean Vercel deploy  
**2 weeks:** whitepaper skeleton · evaluation server · production tiers · testnet USDC pool funding  
**1–2 months:** audit · multisig · legal · mainnet · domain · launch  
**Later:** prop platform · Chainlink · mobile · DEX

---

### Out of Scope

Full brokerage/exchange · Fiat on/off ramp (use MoonPay/Transak later) · Web2 custodial prop firm · NFTs · Cross-chain (Polygon only for now)

---

### Open Questions / TBD

Liquidity provider for funded phase · Funded execution architecture · Legal entity · Geo-restrictions · Token classification · Treasury control · Audit firm · Domain · Team · Seed raise · Scaling pool · Insurance
