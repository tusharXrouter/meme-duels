# Meme Duels – Developer Guide (Cursor)

This document orients contributors in Cursor. It explains what the app does, how it’s structured, the design system, and how to work with the code.

## Overview
- **App**: Next.js 15 (App Router) + React 19 + TypeScript
- **State**: TanStack Query (server state) + Zustand stores (client/session state)
- **Auth/Wallet**: Privy with Solana wallets
- **Realtime**: socket.io client via a WebSocket service singleton
- **UI**: Tailwind CSS v4, custom components, Radix primitives

Main user journey: connect wallet → view active duels → open a duel → place bets → see live updates and analytics.

## Key Features
- Wallet authentication via Privy; session and balances tracked in `useUserStore`.
- Duels list (`/war`) and duel detail (`/war/[slug]`), with epoch mechanics and betting.
- Realtime updates for epoch state, bets, wallet balance via WebSocket.
- Pro View analytics and live bet tape.

## App Structure
- `src/app/layout.tsx`: Root providers (`PrivyProvider`, `QueryProvider`), global styles, top `Header`, `Toaster`.
- `src/app/page.tsx`: Landing page and CTA to `/war`.
- `src/app/war/page.tsx`: Active duels list, subscribes to WS auth event.
- `src/app/war/[slug]/page.tsx`: Duel detail page, fetches duel/epoch, manages live updates and betting.
- `src/app/api/health/route.ts`: Healthcheck endpoint for demo.

### Components
- `src/components/Header.tsx`: Wallet connect, balances, deposit/withdraw modals, username setup, create duel modal hook-up.
- `src/components/war/*`: Battle UI (charts, betting panel, live analytics, timers, stats, etc.).
- `src/components/ui/*`: Reusable UI primitives (button, card, dialog, input, tooltip, masked-component, trading-view-widget, trade-button).
- Modals: `CreateDuelModal`, `DepositModal`, `WithdrawModal`, `UsernameModal`.

### Providers
- `providers/query-provider.tsx`: Configures QueryClient defaults and devtools.
- `providers/privy-provider.tsx`: Configures Privy (login methods, Solana connectors, clusters).

### State Management
- `stores/user.store.ts` (Zustand + persist):
  - Auth state: `authToken`, `userProfile`, `isAuthenticated`.
  - Balances: `balances`, optional `lockedBalances`, `totalBalance`.
  - Actions: `setAuthentication`, `clearAuthentication`, `refreshBalances()`, etc.
- `stores/war.store.ts` (Zustand):
  - Current duel/epoch, user bets, loading/error states.
  - Actions to set/clear/log.

### Data Layer
- `lib/api-client.ts`: Axios instance with baseURL from `NEXT_PUBLIC_API_URL`, token injection from `useUserStore`, error handling.
- `lib/api.ts`: High-level APIs
  - `authAPI`: `verifyToken`, `getProfile`, `getUserStats`.
  - `duelsAPI`: `getActiveDuels`, `getDuelById`, `getCurrentEpoch`, `getEpochDetails`, `placeBet`, `createDuel`.
  - `walletAPI`: `deposit`, `withdraw`, `getBalances`.
  - `tokensAPI`: supported tokens, search, info, price.
- `hooks/useDuelData.ts`: Query hooks composed into `useDuelData(duelId)`; includes mock fallbacks when backend is unavailable.

### Realtime Layer
- `services/websocket.service.ts`:
  - `websocketService` singleton wrapping socket.io with auth, reconnect, room join (`joinDuel/leaveDuel`).
  - Emits/handles: `authenticated`, `duel_state`, `epoch_update`, `epoch_transition`, `epoch_settled`, `new_epoch`, `bet_placed`, `user_bets`, `wallet_update`, `live_bet`.
  - Applies `wallet_update` directly to `useUserStore`.
  - Provides time sync utilities and a `useWebSocket()` helper.

## Design System
- **Tailwind**: utility-first styling with custom neon theme accents used in headers/buttons.
- **Typography**: `Geist` font variables in `layout.tsx`. Landing hero uses Orbitron style inline.
- **Color/Accents**: emerald and fuchsia for sides A/B; neon green and blue accents in header/buttons.
- **Radix**: Dialog, Label, Slot used within `ui/` components.
- **Animation**: `framer-motion` for Pro View dropdown; `tw-animate-css` classes on hero.

## Runtime Flows

### Authentication & Balances
1. User clicks “Connect Wallet” in `Header` (Privy).
2. After Privy auth, `Header` obtains `accessToken` and calls `authAPI.verifyToken`.
3. On success, `useUserStore.setAuthentication` and `refreshBalances()` run; balances show in header.
4. If the server requires a username, it triggers `UsernameModal` with the pending token.

### Duels List (`/war`)
1. `duelsAPI.getActiveDuels()` populates the table.
2. On WS `authenticated`, the page refreshes duels.
3. Global events `duel-created`/`bet-placed` also trigger refresh.

### Duel Detail (`/war/[slug]`)
1. `useDuelData(slug)` fetches duel, current epoch, and user bets.
2. When ready+authenticated, WS `authenticate(token)` then `joinDuel(slug)`.
3. WS pushes epoch updates; the page updates React Query cache directly.
4. Placing a bet tries WS `place_bet`; if not ready, falls back to REST `duelsAPI.placeBet` and refetches epoch.
5. Live bet tape updates on `live_bet` with dedupe and epoch-based clearing.

## Environment
Create `.env.local` from `env.example` or `SETUP.md`:
- `NEXT_PUBLIC_PRIVY_APP_ID`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_WS_URL`
- `NEXT_PUBLIC_SOLANA_RPC_URL`

## How to Work on the Code

### Run
```bash
npm install
npm run dev
# open http://localhost:3000 and /war
```

### Add a new API call
- Add a function in `lib/api.ts`.
- Create/extend types in `src/types` as needed.
- Consume via React Query hooks or directly in components.

### Add a new duel UI element
- Build a component under `src/components/war/`.
- Source data from `useDuelData` and/or WS events.
- Keep state in React Query/Zustand; avoid local duplication.

### Handle realtime data
- Prefer pushing WS payloads into React Query cache with `queryClient.setQueryData` so UI stays consistent with REST queries.
- Use refs for values needed inside WS handlers to avoid stale closures.

## Notable Conventions
- Query keys: `['duel', duelId]`, `['epoch']`, `['userBets', duelId]`.
- A/B sides: emerald for token A, fuchsia for token B.
- Mock fallbacks present when backend is unavailable; remove or guard in production.

## Files to Explore First
- `src/app/war/[slug]/page.tsx`: end-to-end duel experience.
- `src/services/websocket.service.ts`: realtime contract.
- `src/lib/api.ts`: server API surface.
- `src/stores/user.store.ts`, `src/stores/war.store.ts`: client state.
- `src/components/war/BettingPanel.tsx`, `RealtimeTokenChart.tsx`, `ProViewAnalytics.tsx`: UI mechanics.

## Troubleshooting
- WS not authenticating: ensure Privy returns a token and `authenticate(token)` is called; verify WS URL.
- API 401s: token might be cleared by interceptor; re-login.
- No duels: backend may be down; mock paths in hooks populate minimal data.
- Styling off: Tailwind v4 classes; ensure globals loaded via `layout.tsx`.
