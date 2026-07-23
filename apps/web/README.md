# `@glofi/web`

Next.js 16 App Router dapp for Glofi.

## Develop

From monorepo root (preferred):

```bash
npm run dev
```

Or:

```bash
npm run dev -w @glofi/web
```

## Layout

```
src/
  app/           # routes only
  components/    # UI
  providers/     # wallet, i18n
  hooks/         # chain interactions
  lib/           # web3 helpers
  i18n/          # translations
```

Shared addresses/ABIs: import from `@glofi/sdk` (not local copies).

See root `README.md` and `docs/CODEMAP.md`.
