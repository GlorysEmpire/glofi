# Contributing to Glofi

Thanks for helping build Glofi. This monorepo is set up so web, contracts, and future apps stay in sync.

## Setup

```bash
git clone <your-monorepo-url>
cd Glofi
npm install
npm run dev
```

Node **20+** required.

## Branch & PR workflow

1. Branch from `main`: `feat/...`, `fix/...`, `chore/...`, `docs/...`
2. Keep PRs focused (one concern when possible).
3. Run before opening a PR:
   ```bash
   npm run typecheck
   npm run lint
   npm run build
   ```
4. Contracts changes: also `npm run contracts:compile` and add/adjust tests under `contracts/test/`.
5. Describe **what** and **why** in the PR body. Link issues if any.

## Where to put code

| Change | Put it here |
|--------|-------------|
| New page / route | `apps/web/src/app/...` |
| Reusable UI | `apps/web/src/components/...` |
| Wallet / i18n providers | `apps/web/src/providers/...` |
| Chain read/write hooks | `apps/web/src/hooks/...` |
| Addresses, ABIs, tiers, shared types | `packages/sdk/src/...` |
| Solidity | `contracts/contracts/` |
| Deploy / admin scripts | `contracts/scripts/` |
| Product decisions | `docs/` |

**Rule:** if two apps would need the same constant, it belongs in `@glofi/sdk`, not copied into a page.

## Code style

- TypeScript strict; avoid `any` unless justified.
- Comment **sections** (what a block is for), not every line.
- Prefer small pure helpers in `lib/` over giant page files.
- User-facing errors via `errMsg()` / explicit UI — no silent `catch {}` for writes.
- Testnet honesty: never remove the testnet banner while on Amoy.

## Secrets

- Never commit `.env`, private keys, or seed phrases.
- Use `.env.example` as the template.
- Rotate any key that may have been exposed.

## Contracts safety

- No mainnet deploy without audit + multisig plan (see product brief).
- Prefer PR review for any change to `onlyOwner` / `onlyEvaluator` surfaces.

## Questions

Start with `docs/CLIENT_BRIEF_AND_PLAN.md` and `docs/CODEMAP.md`. Open an issue for product ambiguity.
