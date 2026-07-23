# `@glofi/sdk`

Shared configuration and types for **all** Glofi clients (web today, mobile and bots later).

## Install (workspace)

Already linked via npm workspaces from the monorepo root:

```json
"dependencies": {
  "@glofi/sdk": "*"
}
```

## Usage

```ts
import {
  CONTRACTS,
  NETWORK,
  CHALLENGE_TIERS,
  USDC_ADDRESS,
  ADDRESSES,
  ChallengeStatus,
} from '@glofi/sdk'

const challenge = new Contract(
  CONTRACTS.GlofiChallenge.address,
  CONTRACTS.GlofiChallenge.abi,
  signer
)
```

## When to edit

| File | Edit when… |
|------|------------|
| `src/addresses.ts` | Contract redeployed |
| `src/abis/*.json` | ABI / interface changed |
| `src/tiers.ts` | On-chain tier fees/sizes change |
| `src/network.ts` | Chain / RPC / mainnet cutover |
| `src/types.ts` | Shared domain types |

After Solidity changes: recompile Hardhat, copy new ABIs into `src/abis/`, bump addresses if needed.
