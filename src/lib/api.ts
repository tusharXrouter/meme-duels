import axios from 'axios';
import { useUserStore } from '@/stores/user.store';
import type { 
  APIResponse, 
  UserProfile, 
  Duel, 
  EpochData, 
  BetRequest, 
  Bet, 
  DepositRequest, 
  WithdrawalRequest, 
  TokenInfo,
  AuthAPI,
  DuelsAPI,
  WalletAPI,
  TokensAPI
} from '@/types';

// Create axios instance
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().authToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API error:', error);
    
    // Handle network errors gracefully
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      console.warn('Network error - API may not be available');
      // Return a mock response structure for development
      return {
        data: {
          success: false,
          error: 'Network error - API not available'
        }
      };
    }
    
    // Handle 401 Unauthorized - clear auth state
    if (error.response?.status === 401) {
      useUserStore.getState().clearAuthentication();
    }
    
    return Promise.reject(error);
  }
);

// API functions
export const authAPI: AuthAPI = {
  verifyToken: async (token: string, username?: string): Promise<APIResponse<{ user: UserProfile }>> => {
    try {
      const response = await apiClient.post('/auth/verify', { token, username });
      console.log('Raw API response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Auth API error:', error);
      throw error;
    }
  },
  
  getProfile: async (): Promise<APIResponse<UserProfile>> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
  
  getUserStats: async (): Promise<APIResponse<{ totalVolume: number; totalWins: number; totalLosses: number }>> => {
    const response = await apiClient.get('/auth/stats');
    return response.data;
  },
};

export const duelsAPI: DuelsAPI = {
  getActiveDuels: async (): Promise<APIResponse<{ duels: Duel[] }>> => {
    const response = await apiClient.get('/duels');
    return response.data;
  },
  getFeaturedDuel: async (): Promise<APIResponse<{ duel: Duel }>> => {
    const response = await apiClient.get('/duels/featured');
    return response.data;
  },
  
  getDuelById: async (duelId: string): Promise<{ success: boolean; duel?: Duel; error?: string }> => {
    const response = await apiClient.get(`/duels/${duelId}`);
    return response.data;
  },
  
  getCurrentEpoch: async (duelId: string): Promise<{ success: boolean; epoch?: EpochData; error?: string }> => {
    const response = await apiClient.get(`/duels/${duelId}/current-epoch`);
    return response.data;
  },
  
  getEpochDetails: async (
    duelId: string,
    epochNumber: number
  ): Promise<{ success: boolean; epoch?: EpochData & { bets?: Bet[] }; error?: string }> => {
    const response = await apiClient.get(`/duels/${duelId}/epochs/${epochNumber}`);
    return response.data;
  },
  
  placeBet: async (duelId: string, bet: BetRequest): Promise<APIResponse<{ bet: Bet }>> => {
    const response = await apiClient.post(`/duels/${duelId}/bet`, bet);
    return response.data;
  },
  
createDuel: async (duel: {
    name: string;
    token_a_mint?: string | null;
    token_b_mint?: string | null;
    token_a_name: string;
    token_b_name: string;
    token_a_symbol: string;
    token_b_symbol: string;
  }): Promise<APIResponse<{ duel: Duel }>> => {
    // Backend expects /duels/create with camelCase body
    const response = await apiClient.post('/duels/create', {
      name: duel.name,
      tokenAMint: duel.token_a_mint,
      tokenBMint: duel.token_b_mint,
      tokenAName: duel.token_a_name,
      tokenBName: duel.token_b_name,
      tokenASymbol: duel.token_a_symbol,
      tokenBSymbol: duel.token_b_symbol,
    });
    return response.data;
  },
};

export const walletAPI: WalletAPI = {
  deposit: async (deposit: DepositRequest): Promise<APIResponse<{ transaction: string; signature: string }>> => {
    const response = await apiClient.post('/wallet/deposit', deposit);
    return response.data;
  },
  
  withdraw: async (withdrawal: WithdrawalRequest): Promise<APIResponse<{ transaction: string; signature: string }>> => {
    const response = await apiClient.post('/wallet/withdraw', withdrawal);
    return response.data;
  },
  
  getBalances: async (): Promise<{ success: boolean; balances: Record<string, number>; lockedBalances?: Record<string, number>; totalBalance?: string; withdrawableBalance?: number; error?: string }> => {
    const response = await apiClient.get('/wallet/balance');
    return response.data;
  },
};

export const tokensAPI: TokensAPI = {
  getSupportedTokens: async (): Promise<{ success: boolean; tokens: TokenInfo[] }> => {
    const response = await apiClient.get('/tokens');
    return response.data;
  },
  
  searchTokens: async (query: string): Promise<APIResponse<{ tokens: TokenInfo[] }>> => {
    const response = await apiClient.get(`/tokens/search?q=${query}`);
    return response.data;
  },
  getTokenInfo: async (mint: string): Promise<APIResponse<{ token: TokenInfo }>> => {
    const response = await apiClient.get(`/tokens/info?mint=${mint}`);
    return response.data;
  },
  
  getTokenPrice: async (mint: string): Promise<APIResponse<{ price: number }>> => {
    const response = await apiClient.get(`/tokens/${mint}/price`);
    return response.data;
  },
};
