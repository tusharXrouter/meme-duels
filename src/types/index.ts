// API Response Types
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

// User Types
export interface UserProfile {
  id: string;
  username: string;
  wallet_address: string;
  server_wallet_address: string;
  total_volume: number;
  total_wins: number;
  total_losses: number;
  created_at: string;
}

// Transaction Types
export interface Transaction {
  id: string;
  signature: string;
  status: 'confirming' | 'confirmed' | 'failed';
  type: 'deposit' | 'withdrawal' | 'bet';
  timestamp: number;
}

// Duel Types
export interface Duel {
  id: string;
  name: string;
  token_a_mint: string;
  token_b_mint: string;
  token_a_start_price: number;
  token_b_start_price: number;
  token_a_symbol: string;
  token_b_symbol: string;
  token_a_name: string;
  token_b_name: string;
  total_volume: number;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive' | 'completed';
  current_epoch: EpochData;
  featured?: boolean;
  total_epochs: number;
}

// Epoch Types
export interface EpochData {
  id: string;
  epoch_number: number;
  status: 'betting' | 'settling' | 'settled';
  start_time: string;
  betting_end_time: string;
  settlement_end_time: string;
  token_a_total: number;
  token_b_total: number;
  total_bets_count: number;
  winner?: 'token_a' | 'token_b' | 'tie';
  token_a_performance?: number;
  token_b_performance?: number;
  stats?: EpochStats;
  timeRemaining: number;
  serverTime?: string;
  token_a_start_price: number;
  token_b_start_price: number;
}

export interface EpochStats {
  totalBets: number;
  totalVolume: number;
  tokenABets: number;
  tokenBBets: number;
  tokenAVolume: number;
  tokenBVolume: number;
}

// Bet Types
export interface Bet {
  id: string;
  duel_id: string;
  epoch_id: string;
  user_id: string;
  choice: 'token_a' | 'token_b';
  amount: number;
  payout?: number;
  status: 'pending' | 'won' | 'lost' | 'refunded';
  created_at: string;
  settled_at?: string;
}

export interface BetRequest {
  choice: 'token_a' | 'token_b';
  amount: number;
  idempotencyKey?: string;
}

// Token Types
export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  logoURI?: string;
  decimals?: number;
  price?: number;
  market_cap?: number;
  volume_24h?: number;
}

// Wallet Types
export interface WalletBalance {
  token_mint: string;
  balance: number;
  locked_balance?: number;
  total_balance?: number;
}

export interface DepositRequest {
  tx_signature: string;
  amount: number;
  token_mint: string;
}

export interface WithdrawalRequest {
  amount: number;
  token_mint: string;
  to_address: string;
}

// Transaction Types
export interface Transaction {
  id: string;
  signature: string;
  status: 'confirming' | 'confirmed' | 'failed';
  type: 'deposit' | 'withdrawal' | 'bet';
  timestamp: number;
}

// WebSocket Event Types
export interface BetPlacedEvent {
  success: boolean;
  bet?: Bet;
  error?: string;
}

export interface EpochTransitionEvent {
  phase: 'betting' | 'settling' | 'settled';
  epoch: EpochData;
  timeRemaining: number;
  serverTime?: string | number;
}

export interface EpochSettledEvent {
  epochNumber: number;
  winner: 'token_a' | 'token_b' | 'tie';
  tokenAPerformance: number;
  tokenBPerformance: number;
  tokenAPrice: { start: number; end: number };
  tokenBPrice: { start: number; end: number };
}

export interface NewEpochEvent {
  epoch: EpochData;
  timeRemaining: number;
  serverTime?: string | number;
}

export interface WalletUpdateEvent {
  balances: Record<string, number>;
  lockedBalances?: Record<string, number>;
  totalBalance?: number;
  withdrawableBalance?: number;
}

// Live bet stream event
export interface LiveBetEvent {
  duelId: string;
  bet: {
    id: string;
    duel_id: string;
    epoch_id: string;
    user_id: string;
    choice: 'token_a' | 'token_b';
    amount: number;
    token_mint?: string;
    bet_timestamp?: string;
  };
  serverTime?: string | number;
}

// API Function Types
export interface AuthAPI {
  verifyToken: (token: string, username?: string) => Promise<APIResponse<{ user: UserProfile }>>;
  getProfile: () => Promise<APIResponse<UserProfile>>;
  getUserStats: () => Promise<APIResponse<{ totalVolume: number; totalWins: number; totalLosses: number }>>;
}

export interface DuelsAPI {
  getActiveDuels: () => Promise<APIResponse<{ duels: Duel[] }>>;
  getFeaturedDuel: () => Promise<APIResponse<{ duel: Duel }>>;
  getDuelById: (duelId: string) => Promise<{ success: boolean; duel?: Duel; error?: string }>;
  getCurrentEpoch: (duelId: string) => Promise<{ success: boolean; epoch?: EpochData; error?: string }>;
  getEpochDetails: (
    duelId: string,
    epochNumber: number
  ) => Promise<{ success: boolean; epoch?: EpochData & { bets?: Bet[] }; error?: string }>;
  placeBet: (duelId: string, bet: BetRequest) => Promise<APIResponse<{ bet: Bet }>>;
  createDuel: (duel: {
    name: string;
    token_a_mint: string;
    token_b_mint: string;
    token_a_name: string;
    token_b_name: string;
    token_a_symbol: string;
    token_b_symbol: string;
    token_a_start_price: number;
    token_b_start_price: number;
  }) => Promise<APIResponse<{ duel: Duel }>>;
}

export interface WalletAPI {
  deposit: (deposit: DepositRequest) => Promise<APIResponse<{ transaction: string; signature: string }>>;
  withdraw: (withdrawal: WithdrawalRequest) => Promise<APIResponse<{ transaction: string; signature: string }>>;
  getBalances: () => Promise<{ success: boolean; balances: Record<string, number>; lockedBalances?: Record<string, number>; totalBalance?: string; withdrawableBalance?: number; error?: string }>;
}

export interface TokensAPI {
  getSupportedTokens: () => Promise<APIResponse<{ success: boolean }> & { tokens: TokenInfo[] }>;
  searchTokens: (query: string) => Promise<APIResponse<{ tokens: TokenInfo[] }>>;
  getTokenInfo: (mint: string) => Promise<APIResponse<{ token: TokenInfo }>>;
  getTokenPrice: (mint: string) => Promise<APIResponse<{ price: number }>>;
}
