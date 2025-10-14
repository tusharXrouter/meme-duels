# Duels Frontend - Complete Development Guide

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Development Commands](#development-commands)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [WebSocket Integration](#websocket-integration)
- [State Management](#state-management)
- [Components](#components)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)

---

## 🎯 Project Overview

**Meme Duels Frontend** is a Next.js 15 React application that provides real-time cryptocurrency dueling experience with Web3 integration.

### **Key Features**
- ⚡ **Real-time dueling** with WebSocket connections
- 🔐 **Web3 Authentication** via Privy
- 💰 **Solana Wallet Integration** for deposits/withdrawals
- 📊 **Live price tracking** and betting
- 🎨 **Modern UI** with Tailwind CSS and Framer Motion
- 📱 **Responsive design** for all devices

---

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App   │◄───┤   API Layer      │◄───┤   Backend API   │
│   (Frontend)    │    │  (Axios Client)  │    │   (NestJS)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                       │
         ▼                        ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  State Stores   │    │   WebSocket      │    │  Price Stream   │
│   (Zustand)     │    │  (Socket.IO)     │    │  (TimescaleDB)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                       │
         ▼                        ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Privy Auth    │    │   Solana Web3    │    │   Components    │
│   (Web3 Login)  │    │   (Wallets)      │    │   (UI Layer)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

---

## 🛠️ Tech Stack

### **Framework & Core**
- **Next.js 15** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript 5** - Type safety and developer experience

### **Styling & UI**
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Radix UI** - Headless UI components
- **Sonner** - Toast notifications

### **State Management**
- **Zustand** - Lightweight state management
- **TanStack Query** - Server state management
- **React Query DevTools** - Development tools

### **Web3 & Blockchain**
- **Privy** - Web3 authentication and wallet management
- **Solana Web3.js** - Solana blockchain interaction
- **Solana SPL Token** - Token handling

### **Communication**
- **Axios** - HTTP client for REST APIs
- **Socket.IO Client** - Real-time WebSocket communication

### **Development**
- **ESLint** - Code linting
- **Turbopack** - Fast bundler for development

---

## 🚀 Setup & Installation

### **Prerequisites**
```bash
# Required software
node --version        # 20+
npm --version         # 10+
```

### **Installation**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

### **Environment Setup**
```bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables
# NEXT_PUBLIC_API_URL=http://localhost:6000/api
# NEXT_PUBLIC_WS_URL=wss://duels.pumpwars.xyz/duels
```

---

## 📝 Development Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Debugging
npm run dev -- --inspect    # Start with Node.js inspector
npm run build -- --debug    # Build with debug information
```

---

## 📁 Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Home page
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   ├── CreateDuelModal.tsx # Duel creation modal
│   ├── DepositModal.tsx   # Deposit modal
│   ├── Header.tsx         # Navigation header
│   ├── MemeBattleCard.tsx # Main battle card component
│   └── ...               # Other components
├── hooks/                 # Custom React hooks
│   ├── index.ts          # Hook exports
│   ├── use-api.ts        # API hooks with TanStack Query
│   └── useDuelData.ts    # Duel-specific data hooks
├── lib/                  # Library configurations
│   ├── api.ts            # Axios client and API functions
│   ├── api-client.ts     # API client export
│   ├── query-client.ts   # TanStack Query configuration
│   └── utils.ts          # Utility functions
├── services/             # Service layers
│   └── websocket.service.ts # WebSocket service
├── stores/               # Zustand state stores
│   ├── transaction.store.ts # Transaction state
│   ├── user.store.ts        # User authentication state
│   └── war.store.ts         # Duel/war state
├── types/                # TypeScript type definitions
│   ├── api.ts            # API response types
│   ├── duel.ts           # Duel-related types
│   └── index.ts          # Type exports
└── utils/                # Utility functions
    └── api.ts            # API utility functions
```

---

## 🔌 API Integration

### **API Client Configuration**
```typescript
// src/lib/api.ts
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### **Available APIs**

#### **Authentication API**
```typescript
// Login with Privy token
authAPI.verifyToken(token, username)

// Get user profile
authAPI.getProfile()

// Get user statistics
authAPI.getUserStats()
```

#### **Duels API**
```typescript
// Get active duels
duelsAPI.getActiveDuels()

// Get featured duel
duelsAPI.getFeaturedDuel()

// Get specific duel
duelsAPI.getDuelById(duelId)

// Get current epoch
duelsAPI.getCurrentEpoch(duelId)

// Place a bet
duelsAPI.placeBet(duelId, bet)

// Create new duel
duelsAPI.createDuel(duelData)
```

#### **Wallet API**
```typescript
// Deposit funds
walletAPI.deposit(depositRequest)

// Withdraw funds
walletAPI.withdraw(withdrawalRequest)

// Get balances
walletAPI.getBalances()
```

#### **Tokens API**
```typescript
// Get supported tokens
tokensAPI.getSupportedTokens()

// Search tokens
tokensAPI.searchTokens(query)

// Get token info
tokensAPI.getTokenInfo(mint)

// Get token price
tokensAPI.getTokenPrice(mint)
```

### **Using API Hooks**
```typescript
import { useApiQuery, useApiMutation } from '@/hooks/use-api';

// GET request hook
const { data, isLoading, error } = useApiQuery(
  ['duels'],
  () => duelsAPI.getActiveDuels()
);

// POST request hook
const createDuelMutation = useApiMutation(
  duelsAPI.createDuel,
  {
    onSuccess: (data) => {
      console.log('Duel created:', data);
    }
  }
);
```

---

## 🔗 WebSocket Integration

### **WebSocket Service**
The frontend uses Socket.IO for real-time communication:

```typescript
// src/services/websocket.service.ts
import { websocketService } from '@/services/websocket.service';

// Authenticate WebSocket
websocketService.authenticate(authToken);

// Join duel room
websocketService.joinDuel(duelId);

// Listen for events
websocketService.on('epoch_update', (epoch) => {
  console.log('Epoch updated:', epoch);
});

// Place bet via WebSocket
websocketService.placeBet(duelId, 'token_a', amount);
```

### **WebSocket Events**

#### **Connection Events**
- `authenticated` - WebSocket authentication status
- `error` - Connection or protocol errors

#### **Duel Events**
- `duel_state` - Complete duel state updates
- `epoch_update` - Epoch data changes
- `epoch_transition` - Phase transitions (betting → settling → settled)
- `epoch_settled` - Epoch results with winner
- `new_epoch` - New epoch started

#### **Bet Events**
- `bet_placed` - Bet confirmation/failure
- `user_bets` - User's bet history
- `live_bet` - Real-time bet from other users
- `wallet_update` - Balance updates after transactions

### **Using WebSocket in Components**
```typescript
import { useWebSocket } from '@/services/websocket.service';
import { useEffect } from 'react';

export default function DuelComponent({ duelId }) {
  const ws = useWebSocket();

  useEffect(() => {
    // Join duel room
    ws.joinDuel(duelId);

    // Listen for epoch updates
    const unsubscribe = ws.on('epoch_update', (epoch) => {
      // Update local state
    });

    return () => {
      unsubscribe();
      ws.leaveDuel(duelId);
    };
  }, [duelId]);
}
```

---

## 🗄️ State Management

### **Store Structure**

#### **User Store** (`user.store.ts`)
```typescript
interface UserState {
  // Authentication
  isAuthenticated: boolean;
  authToken: string | null;
  user: UserProfile | null;
  
  // Wallet
  balances: Record<string, number>;
  
  // Actions
  setAuthentication: (token: string, user: UserProfile) => void;
  clearAuthentication: () => void;
  setBalances: (balances: Record<string, number>) => void;
}
```

#### **War Store** (`war.store.ts`)
```typescript
interface WarState {
  // Current duel
  currentDuel: Duel | null;
  currentEpoch: EpochData | null;
  
  // UI state
  isPlacingBet: boolean;
  lastBetResult: BetResult | null;
  
  // Actions
  setCurrentDuel: (duel: Duel) => void;
  setCurrentEpoch: (epoch: EpochData) => void;
}
```

#### **Transaction Store** (`transaction.store.ts`)
```typescript
interface TransactionState {
  // Transaction history
  pendingTransactions: Transaction[];
  completedTransactions: Transaction[];
  
  // Actions
  addPendingTransaction: (tx: Transaction) => void;
  completeTransaction: (txId: string) => void;
}
```

### **Using Stores**
```typescript
import { useUserStore } from '@/stores/user.store';

export default function UserProfile() {
  const { user, balances, isAuthenticated } = useUserStore();
  const setBalances = useUserStore(state => state.setBalances);

  return (
    <div>
      {isAuthenticated && (
        <div>
          <p>User: {user?.username}</p>
          <p>SOL Balance: {balances.SOL || 0}</p>
        </div>
      )}
    </div>
  );
}
```

---

## 🧩 Components

### **Key Components**

#### **MemeBattleCard** - Main battle interface
```typescript
// src/components/MemeBattleCard.tsx
- Real-time epoch display
- Token price charts
- Betting interface
- Live bet feed
```

#### **Header** - Navigation and user info
```typescript
// src/components/Header.tsx
- Wallet connection
- User profile
- Balance display
- Navigation menu
```

#### **Modals**
```typescript
// src/components/CreateDuelModal.tsx - Create new duels
// src/components/DepositModal.tsx - Deposit funds
// src/components/WithdrawModal.tsx - Withdraw funds
// src/components/UsernameModal.tsx - Set username
```

### **Component Development Patterns**
```typescript
// Typical component structure
import { useEffect } from 'react';
import { useUserStore } from '@/stores/user.store';
import { useWebSocket } from '@/services/websocket.service';

export default function MyComponent() {
  const { user } = useUserStore();
  const ws = useWebSocket();

  useEffect(() => {
    // Component mount logic
    return () => {
      // Cleanup
    };
  }, []);

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

---

## 🌍 Environment Configuration

### **Environment Variables**
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:6000/api

# WebSocket Configuration  
NEXT_PUBLIC_WS_URL=wss://duels.pumpwars.xyz/duels

# Development vs Production
NODE_ENV=development
```

### **Configuration Files**

#### **next.config.ts**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add configuration options here
  experimental: {
    turbopack: true, // Enable Turbopack for faster builds
  },
};

export default nextConfig;
```

#### **tailwind.config.js**
```javascript
// Tailwind CSS configuration with custom theme
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
  plugins: [],
};
```

---

## 📡 Real-Time Price Streaming

### **Backend Price Streaming Setup**

#### **Start Complete Backend Stack**
```bash
# Navigate to backend directory
cd /path/to/duels-backend

# Start all services (Redis, TimescaleDB, Price Streamer, Backend)
docker-compose up -d

# Verify services are running
docker-compose ps

# Check health endpoints
curl http://localhost:3000/health     # Backend
curl http://localhost:6001/health     # Price Streamer
```

#### **Monitor Price Streaming**
```bash
# View real-time price data flow
./scripts/quick-monitor.sh

# Watch live price updates
./scripts/db-viewer.sh stream

# Check price streamer logs
docker-compose logs -f price-streamer

# Monitor Redis price cache
docker-compose exec redis redis-cli KEYS "duels:price:*"
```

#### **WebSocket Event Contract**
```typescript
// Price update event sent to frontend
interface PriceUpdateEvent {
  duelId: string;
  serverTime: number;
  tokenA: {
    mint: string;
    symbol: string;
    priceUsd: number;
    timestamp: number;
    quality: 'live' | 'fallback' | 'stale';
  };
  tokenB: {
    mint: string;
    symbol: string;
    priceUsd: number;
    timestamp: number;
    quality: 'live' | 'fallback' | 'stale';
  };
  updateTimestamp: number;
}
```

#### **Frontend Price Integration**
```bash
# Start frontend with price store enabled
npm run dev

# Check browser console for price_update events
# Green dots indicate live price quality
# Yellow dots indicate stale/fallback prices
```

---

## 🔧 Troubleshooting

### **Price Streaming Issues**

#### **No Price Updates in Frontend**
```bash
# 1. Check backend price-streamer is running
curl http://localhost:6001/health

# 2. Verify WebSocket connection in browser DevTools
# Look for "price_update" events in Network tab

# 3. Check if backend is forwarding price updates
docker-compose logs backend | grep "price-update"

# 4. Verify duel is joined in WebSocket
# Browser console should show "Joined duel" message
```

#### **Stale Price Quality**
```bash
# Check Birdeye WebSocket connection
docker-compose logs price-streamer | grep "WebSocket"

# Verify API key is valid
curl -H "x-api-key: YOUR_API_KEY" "https://public-api.birdeye.so/defi/price?address=So11111111111111111111111111111111111111112"

# Force reconnection
docker-compose restart price-streamer
```

### **Common Issues**

#### **API Connection Issues**
```bash
# Check backend is running
curl http://localhost:6000/health

# Check API URL in environment
echo $NEXT_PUBLIC_API_URL

# Check network tab in browser DevTools
```

#### **WebSocket Connection Issues**
```bash
# Check WebSocket URL
echo $NEXT_PUBLIC_WS_URL

# Check browser console for WebSocket errors
# Look for "WebSocket connected" message

# Verify price_update events are received
# Should see "Event: price_update for duel {duelId}" in console
```

#### **Authentication Issues**
```javascript
// Check auth token in browser
localStorage.getItem('privy:token')

// Check user store state
console.log(useUserStore.getState())

// Verify Privy configuration
```

#### **Build Issues**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run lint
```

### **Debug Commands**
```bash
# Enable debug logging
DEBUG=* npm run dev

# Check bundle analyzer
npm run build -- --analyze

# Check environment variables
npm run dev -- --debug
```

---

## 🚀 Deployment

### **Production Build**
```bash
# Build for production
npm run build

# Test production build locally
npm run start

# Check build output
ls -la .next/
```

### **Environment Setup**
```bash
# Production environment variables
NEXT_PUBLIC_API_URL=https://duels.pumpwars.xyz/api
NEXT_PUBLIC_WS_URL=wss://duels.pumpwars.xyz/duels
NODE_ENV=production
```

### **Deployment Checklist**
- ✅ Environment variables configured
- ✅ API endpoints accessible
- ✅ WebSocket connection working
- ✅ Privy authentication configured
- ✅ Solana network settings correct
- ✅ Build completes without errors
- ✅ All features tested in production environment

---

## 📊 Performance & Monitoring

### **Key Metrics to Monitor**
- **API Response Times**: < 500ms for critical endpoints
- **WebSocket Latency**: < 100ms for real-time updates
- **Bundle Size**: Monitor with Next.js bundle analyzer
- **Core Web Vitals**: LCP, FID, CLS scores

### **Performance Commands**
```bash
# Bundle analysis
npm run build -- --analyze

# Lighthouse audit
lighthouse http://localhost:3000

# Performance profiling in DevTools
```

---

## 🔗 Integration Points

### **Backend Integration**
- **API Endpoints**: REST API communication
- **WebSocket Events**: Real-time duel updates
- **Authentication**: Token-based auth with backend validation

### **Blockchain Integration**
- **Privy**: Web3 authentication and wallet connection
- **Solana**: Blockchain transactions and token operations
- **Price Data**: Real-time price feeds from backend price-streamer

---

*Last updated: 2025-01-17*
*Version: 1.0.0*
