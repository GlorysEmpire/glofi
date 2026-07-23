# `@glofi/mobile` (planned)

Native app shell (Expo / React Native) — **not scaffolded yet**.

When you start:

1. `npx create-expo-app@latest .` inside this folder (or add as workspace package).
2. Depend on `@glofi/sdk` for addresses, ABIs, and tiers.
3. Use WalletConnect / mobile wallet adapter instead of `window.ethereum`.
4. Reuse product flows from `apps/web` (trader, investor, dashboard) as UX reference.

Do not copy contract addresses into the mobile app — always import `@glofi/sdk`.
