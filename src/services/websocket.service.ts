import { io, Socket } from 'socket.io-client';
import { Bet, Duel } from '@/types';

// Simple primitive aliases to make payload shapes easy to scan
type IsoDateString = string; // e.g. 2025-09-22T11:40:59.045Z

export interface EpochStats {
  totalBets: number;
  totalVolume: number;
  tokenABets: number;
  tokenBBets: number;
  tokenAVolume: number;
  tokenBVolume: number;
}

export interface EpochData {
  id: string;
  duel_id?: string;
  epoch_number: number;
  status: 'betting' | 'settling' | 'settled';
  start_time: IsoDateString;
  betting_end_time: IsoDateString;
  settlement_end_time: IsoDateString;

  // Totals and counts
  token_a_total: number;
  token_b_total: number;
  total_bets_count: number;

  // Prices and performance (nullable during betting/settling)
  token_a_start_price?: number | null;
  token_b_start_price?: number | null;
  token_a_end_price?: number | null;
  token_b_end_price?: number | null;
  winner?: 'token_a' | 'token_b' | 'tie' | null;
  token_a_performance?: number | null;
  token_b_performance?: number | null;

  // Optional timestamps from backend
  created_at?: IsoDateString;
  updated_at?: IsoDateString;

  // Optional enriched stats
  stats?: EpochStats;

  // Realtime helpers included in some events
  timeRemaining?: number;
  serverTime?: string | number;
}

export type BetPlacedEvent =
  | { success: true; bet: Bet }
  | { success: false; error: string };

export interface EpochTransitionEvent {
  phase: 'betting' | 'settling' | 'settled';
  epoch: EpochData;
  timeRemaining?: number;
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
  timeRemaining?: number;
  serverTime?: string | number;
}

export interface PriceUpdateEvent {
  duelId: string;
  serverTime: number;
  tokenA: {
    mint: string;
    symbol: string;
    priceUsd: number;
    timestamp: number;
    quality: string;
  };
  tokenB: {
    mint: string;
    symbol: string;
    priceUsd: number;
    timestamp: number;
    quality: string;
  };
  updateTimestamp: number;
}

export type WebSocketEventHandlers = {
  // Connection events
  authenticated: (data: { success: boolean; userId?: string; error?: string }) => void;
  error: (data: { message: string }) => void;

  // Duel events
  duel_state: (data: { duel: Duel & { currentEpoch: EpochData } }) => void;
  epoch_update: (epoch: EpochData) => void;
  epoch_transition: (event: EpochTransitionEvent) => void;
  epoch_settled: (event: EpochSettledEvent) => void;
  new_epoch: (event: NewEpochEvent) => void;

  // Price events
  price_update: (event: PriceUpdateEvent) => void;

  // Bet and wallet events
  bet_placed: (event: BetPlacedEvent) => void;
  user_bets: (data: { bets: Bet[] }) => void;
  wallet_update: (data: {
    balances: Record<string, number>;
    lockedBalances?: Record<string, number>;
    totalBalance?: number;
    withdrawableBalance?: number;
  }) => void;
  live_bet: (data: { duelId: string; bet: Bet; serverTime?: string | number }) => void;
};

class WebSocketService {
  private socket: Socket | null = null;
  private priceSocket: Socket | null = null;
  private eventHandlers: Map<string, Set<(data: unknown) => void>> = new Map();
  private isConnected = false;
  private isAuthenticated = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private joinedDuels = new Set<string>();
  private lastToken: string | null = null;
  // Server clock sync: serverTime - clientTime
  private serverOffsetMs = 0;
  // Track price subscriptions per duel
  private priceSubscriptions = new Map<string, { tokenAMint: string; tokenASymbol: string; tokenBMint: string; tokenBSymbol: string }>();

  constructor() {
    this.connect();
    this.connectPrices();
  }

  private connect() {
    // Use environment variable for WebSocket URL, fallback to production
    const envWs = process.env.NEXT_PUBLIC_WS_URL;
    const defaultWs = (typeof window !== 'undefined')
      ? window.location.origin.replace(/^http/, 'ws')
      : 'http://localhost:6000';
    const wsUrl = envWs && envWs.length > 0 ? envWs : defaultWs;

    console.log('Connecting to WebSocket:', wsUrl, 'with namespace: /duels');

    // Connect to the duels namespace - this is the correct way for Socket.IO
    this.socket = io(`${wsUrl}/duels`, {
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
      timeout: 20000,
      forceNew: false,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;

      // Join any duel rooms immediately on connection (public data)
      this.joinedDuels.forEach(duelId => {
        this.socket?.emit('join_duel', { duelId });
        console.log(`Rejoined duel ${duelId} on connect`);
      });

      // Re-authenticate if we have a stored token
      if (this.lastToken) {
        this.authenticate(this.lastToken);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected');
      this.isConnected = false;
      this.isAuthenticated = false;
      
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect
        this.attemptReconnect();
      }
    });

    this.socket.on('connect_error', (err) => {
      const message = (err && (err as Error).message) || 'WebSocket connection error';
      console.error(message);
      this.emit('error', { message });
      this.attemptReconnect();
    });

    // Set up event forwarding
    this.socket.on('authenticated', (data) => {
      console.log(data.success ? 'WebSocket authenticated' : 'WebSocket authentication failed');
      this.isAuthenticated = data.success;
      
      // Note: Duel rooms are already joined on connection for public data
      // Authentication only enables private features like betting and user data
      
      this.emit('authenticated', data);
    });

    // Forward all events to registered handlers
    const events: (keyof WebSocketEventHandlers)[] = [
      'error', 'duel_state', 'epoch_update', 'epoch_transition', 
      'epoch_settled', 'new_epoch', 'price_update', 'bet_placed', 'user_bets', 'wallet_update', 'live_bet'
    ];

    events.forEach(event => {
      this.socket?.on(event, (data) => {
        // Update clock offset when serverTime provided
        const serverTime = (data && (data.serverTime || data?.epoch?.serverTime)) as string | number | undefined;
        if (serverTime) {
          this.updateClockOffset(serverTime);
        }
        // Enhanced logging for epoch events
        // Minimal event logging
        if (event.includes('epoch')) {
          console.log(`Event: ${event}`);
        } else if (event === 'price_update') {
          console.log(`Event: ${event} for duel ${data?.duelId}`);
        } else {
          console.log(`Event: ${event}`);
        }
        this.emit(event, data);
      });
    });

    // Auto-update price store when price updates are received
    this.socket.on('price_update', async (data) => {
      try {
        const { usePriceStore } = await import('@/stores/price.store');
        usePriceStore.getState().updatePrices(data);
      } catch (error) {
        console.warn('Failed to update price store:', error);
      }
    });

    // Apply wallet updates to the store automatically
    this.socket.on('wallet_update', async (payload) => {
      try {
        const { useUserStore } = await import('@/stores/user.store');
        if (payload?.balances) {
          useUserStore.getState().setBalances(payload.balances);
        }
        // Optionally stash locked/total for UI components
        if (payload?.lockedBalances || payload?.totalBalance !== undefined) {
          const store = useUserStore.getState();
          // Extend store on the fly if methods exist; otherwise components can read via event
          if ('setLockedBalances' in store && typeof store.setLockedBalances === 'function') {
            store.setLockedBalances(payload.lockedBalances || {});
          }
          if ('setTotalBalance' in store && typeof store.setTotalBalance === 'function') {
            store.setTotalBalance(payload.totalBalance || 0);
          }
        }
        } catch (error) {
          console.warn('Failed to apply wallet_update to store:', error);
        }
    });

    // Listen for generic error events
    this.socket.on('error', (data) => {
      const message = typeof data === 'string'
        ? data
        : (data && (data as { message?: string }).message) || 'WebSocket error';
      console.error('WebSocket error event:', message);
      this.emit('error', { message });
    });
  }

  // Prices namespace connection (/prices)
  private connectPrices() {
    const envWs = process.env.NEXT_PUBLIC_WS_URL;
    const defaultWs = (typeof window !== 'undefined')
      ? window.location.origin.replace(/^http/, 'ws')
      : 'http://localhost:6000';
    const wsUrl = envWs && envWs.length > 0 ? envWs : defaultWs;

    this.priceSocket = io(`${wsUrl}/prices`, {
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
      timeout: 20000,
      forceNew: false,
    });

    this.priceSocket.on('connect', () => {
      console.log('WebSocket connected (/prices)');
      // Resubscribe all known symbols when reconnected
      for (const sub of this.priceSubscriptions.values()) {
        this.subscribeSymbols([sub.tokenASymbol, sub.tokenBSymbol]);
      }
    });

    this.priceSocket.on('connect_error', (err) => {
      console.error('Prices WS connect_error:', (err as Error)?.message || err);
    });

    const handlePriceMap = async (prices: Record<string, number>) => {
      try {
        const { usePriceStore } = await import('@/stores/price.store');
        const state = usePriceStore.getState();
        const now = Date.now();

        for (const [duelId, sub] of this.priceSubscriptions.entries()) {
          const priceA = prices[sub.tokenASymbol?.toUpperCase()];
          const priceB = prices[sub.tokenBSymbol?.toUpperCase()];

          if (priceA === undefined && priceB === undefined) continue;

          // Use previous side value if one side missing in this tick
          const prev = state.getDuelPrices(duelId);
          const payload: PriceUpdateEvent = {
            duelId,
            serverTime: now,
            updateTimestamp: now,
            tokenA: {
              mint: sub.tokenAMint,
              symbol: sub.tokenASymbol,
              priceUsd: priceA !== undefined ? priceA : (prev?.tokenA.price ?? 0),
              timestamp: now,
              quality: 'live',
            },
            tokenB: {
              mint: sub.tokenBMint,
              symbol: sub.tokenBSymbol,
              priceUsd: priceB !== undefined ? priceB : (prev?.tokenB.price ?? 0),
              timestamp: now,
              quality: 'live',
            },
          };
          state.updatePrices(payload);
        }
      } catch (e) {
        console.warn('Failed to handle prices_update:', e);
      }
    };
    // Listen to the canonical event name
    this.priceSocket.on('price_update', handlePriceMap);
  }

  private subscribeSymbols(symbols: string[]) {
    if (!this.priceSocket || !this.priceSocket.connected) return;
    if (!symbols || symbols.length === 0) return;
    this.priceSocket.emit('subscribe_prices', { symbols: symbols.map(s => s.toUpperCase()) });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Attempting to reconnect (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.socket?.connect();
    }, delay);
  }

  // Public API
  authenticate(token: string): void {
    this.lastToken = token; // Store token for reconnection
    
    if (!this.isConnected || !this.socket) {
      console.warn('Cannot authenticate: not connected');
      return;
    }
    
    console.log('Authenticating WebSocket');
    this.socket.emit('authenticate', { token });
  }

  joinDuel(duelId: string): void {
    // Always remember desired rooms so we can join once connected
    this.joinedDuels.add(duelId);

    if (!this.isConnected || !this.socket) {
      console.warn('Queueing duel join until connected');
      return;
    }

    // Join duel room immediately - authentication not required for public data
    this.socket.emit('join_duel', { duelId });
    console.log(`Joined duel ${duelId} (auth: ${this.isAuthenticated})`);
  }

  // Subscribe to price updates for the given duel by token mints
  subscribeDuelPrices(
    duelId: string,
    tokenAMint: string,
    tokenASymbol: string,
    tokenBMint: string,
    tokenBSymbol: string,
  ): void {
    this.priceSubscriptions.set(duelId, { tokenAMint, tokenASymbol, tokenBMint, tokenBSymbol });
    this.subscribeSymbols([tokenASymbol, tokenBSymbol]);
  }

  leaveDuel(duelId: string): void {
    if (!this.socket) return;

    this.joinedDuels.delete(duelId);
    this.socket.emit('leave_duel', { duelId });
    console.log('Left duel');
  }

  placeBet(duelId: string, choice: 'token_a' | 'token_b', amount: number, idempotencyKey?: string): void {
    console.log('Attempting to place bet');

    if (!this.isConnected || !this.socket) {
      console.error('Cannot place bet: not connected');
      // Emit a fake bet_placed event to prevent timeout
      setTimeout(() => {
        this.emit('bet_placed', { success: false, error: 'Not connected to server' });
      }, 100);
      return;
    }

    if (!this.isAuthenticated) {
      console.error('Cannot place bet: not authenticated');
      // Emit a fake bet_placed event to prevent timeout
      setTimeout(() => {
        this.emit('bet_placed', { success: false, error: 'Not authenticated' });
      }, 100);
      return;
    }

    console.log('Emitting place_bet event via WebSocket');
    this.socket.emit('place_bet', { duelId, choice, amount, idempotencyKey });
  }

  getUserBets(duelId: string): void {
    if (!this.isConnected || !this.socket) {
      console.warn('Cannot get user bets: not connected');
      return;
    }

    if (!this.isAuthenticated) {
      console.warn('Cannot get user bets: not authenticated');
      return;
    }

    this.socket.emit('get_user_bets', { duelId });
  }

  // Event handling
  on<K extends keyof WebSocketEventHandlers>(
    event: K, 
    handler: WebSocketEventHandlers[K]
  ): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    
    const handlers = this.eventHandlers.get(event)!;
    handlers.add(handler as (data: unknown) => void);

    // Return unsubscribe function
    return () => {
      handlers.delete(handler as (data: unknown) => void);
      if (handlers.size === 0) {
        this.eventHandlers.delete(event);
      }
    };
  }

  private emit<K extends keyof WebSocketEventHandlers>(
    event: K, 
    data: Parameters<WebSocketEventHandlers[K]>[0]
  ): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          (handler as (data: unknown) => void)(data);
        } catch (error) {
          console.error('Error in event handler:', error);
        }
      });
    }
  }

  // Connection status
  get connected(): boolean {
    return this.isConnected;
  }

  get authenticated(): boolean {
    return this.isAuthenticated;
  }

  // Server time helpers
  private updateClockOffset(serverTime: string | number) {
    const serverMs = typeof serverTime === 'string' ? new Date(serverTime).getTime() : Number(serverTime);
    if (!isFinite(serverMs)) return;
    const clientMs = Date.now();
    const offset = serverMs - clientMs;
    // EMA smoothing to avoid jumps
    if (this.serverOffsetMs === 0) this.serverOffsetMs = offset;
    else this.serverOffsetMs = this.serverOffsetMs * 0.8 + offset * 0.2;
  }

  now(): number {
    return Date.now();
  }

  // Debug method to test connection
  testConnection(): void {
    console.log('WebSocket status check');
  }

  // Cleanup
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.isAuthenticated = false;
    this.lastToken = null;
    this.joinedDuels.clear();
    this.eventHandlers.clear();
  }
}

// Create singleton instance
export const websocketService = new WebSocketService();

// Add to window for debugging
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).websocketService = websocketService;
}

// Hook for React components
export function useWebSocket() {
  return websocketService;
}
