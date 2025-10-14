# Meme Duels - Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Privy Authentication
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# WebSocket Configuration
NEXT_PUBLIC_WS_URL=ws://localhost:3000/duels

# Solana RPC URL (for wallet operations)
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `env.example` to `.env.local`
   - Update the values with your actual configuration

3. **Get Privy App ID:**
   - Go to [Privy Console](https://console.privy.io/)
   - Create a new app or use an existing one
   - Copy the App ID and update `NEXT_PUBLIC_PRIVY_APP_ID`

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Navigate to `http://localhost:3000/war`
   - You should see the war page with the new Header component

## Features Added

### Header Component
- **Wallet Connection**: Connect/disconnect Solana wallets via Privy
- **User Authentication**: Automatic token verification and user profile management
- **Balance Display**: Show user's token balances (SOL, USDC, etc.)
- **Deposit/Withdraw**: Modal interfaces for managing funds
- **Create Duel**: Interface for creating new meme token duels
- **Navigation**: All Duels, Leaderboard, and Create Duel buttons

### Authentication Flow
- **Privy Integration**: Seamless wallet connection
- **JWT Token Management**: Secure authentication with backend
- **Username Setup**: First-time user username configuration
- **Persistent Sessions**: User state persistence across page reloads

### Real-time Features
- **WebSocket Service**: Real-time updates for duels and bets
- **Live Notifications**: Toast notifications for user actions
- **Transaction Tracking**: Monitor deposit/withdrawal status

### State Management
- **User Store**: Authentication, profile, and balance management
- **Transaction Store**: Transaction history and status tracking
- **WebSocket Store**: Real-time connection management

## API Integration

The application is set up to work with a backend API that provides:

- **Authentication**: `/auth/verify`, `/auth/me`, `/auth/stats`
- **Duels**: `/duels`, `/duels/featured`, `/duels/:id`, `/duels/create`
- **Wallet**: `/wallet/deposit`, `/wallet/withdraw`, `/wallet/balance`
- **Tokens**: `/tokens`, `/tokens/search`, `/tokens/info`, `/tokens/:mint/price`

## WebSocket Events

The WebSocket service handles real-time events:

- **Connection**: `authenticated`, `error`
- **Duels**: `duel_state`, `epoch_update`, `epoch_transition`, `epoch_settled`, `new_epoch`
- **Bets**: `bet_placed`, `user_bets`, `wallet_update`

## Notes

- The backend API endpoints are currently mocked - implement actual backend integration when ready
- WebSocket connection will attempt to connect to the configured URL
- All authentication is handled through Privy with JWT token verification
- The application is designed to work with Solana blockchain for token operations

## Troubleshooting

1. **Wallet not connecting**: Check your Privy App ID and ensure it's configured for Solana
2. **API errors**: Verify your backend API is running and accessible
3. **WebSocket issues**: Check the WebSocket URL configuration and network connectivity
4. **Styling issues**: Ensure all CSS classes are properly loaded and Tailwind is configured
