import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface UserState {
  // Authentication
  isAuthenticated: boolean;
  authToken: string | null;
  userProfile: UserProfile | null;
  
  // Balances
  balances: Record<string, number>; // token_mint -> available (withdrawable)
  lockedBalances?: Record<string, number>;
  totalBalance?: number;
  
  // UI State
  isLoading: boolean;
  
  // Actions
  setAuthentication: (token: string, profile: UserProfile) => void;
  clearAuthentication: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  setBalances: (balances: Record<string, number>) => void;
  setLockedBalances?: (balances: Record<string, number>) => void;
  setTotalBalance?: (total: number) => void;
  updateBalance: (tokenMint: string, balance: number) => void;
  setLoading: (loading: boolean) => void;
  refreshBalances: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // Initial state
      isAuthenticated: false,
      authToken: null,
      userProfile: null,
      balances: {
        'So11111111111111111111111111111111111111112': 0, // Default SOL balance
      },
      isLoading: false,

      // Actions
      setAuthentication: (token: string, profile: UserProfile) => {
        set({
          isAuthenticated: true,
          authToken: token,
          userProfile: profile,
        });
        // Automatically refresh balances after authentication
        setTimeout(async () => {
          try {
            const { walletAPI } = await import('@/lib/api');
            const response = await walletAPI.getBalances();
            if (response.success) {
              set((state) => ({ 
                ...state,
                balances: {
                  'So11111111111111111111111111111111111111112': 0, // Ensure SOL is always present
                  ...(response.balances || {}),
                },
                lockedBalances: response.lockedBalances || {},
                totalBalance: response.totalBalance ? Number(response.totalBalance) : undefined,
              }));
            }
          } catch (error) {
            console.error('Failed to refresh balances after authentication:', error);
          }
        }, 100);
      },

      clearAuthentication: () =>
        set({
          isAuthenticated: false,
          authToken: null,
          userProfile: null,
          balances: {
            'So11111111111111111111111111111111111111112': 0, // Reset to default SOL balance
          },
        }),

      updateProfile: (profileUpdates: Partial<UserProfile>) =>
        set((state) => ({
          userProfile: state.userProfile
            ? { ...state.userProfile, ...profileUpdates }
            : null,
        })),

      setBalances: (balances: Record<string, number>) =>
        set({ balances }),

      setLockedBalances: (balances: Record<string, number>) =>
        set({ lockedBalances: balances }),

      setTotalBalance: (total: number) =>
        set({ totalBalance: total }),

      updateBalance: (tokenMint: string, balance: number) =>
        set((state) => ({
          balances: {
            ...state.balances,
            [tokenMint]: balance,
          },
        })),

      setLoading: (loading: boolean) =>
        set({ isLoading: loading }),

      refreshBalances: async () => {
        try {
          const { walletAPI } = await import('@/lib/api');
          const response = await walletAPI.getBalances();
          if (response.success) {
            set((state) => ({ 
              ...state,
              balances: {
                'So11111111111111111111111111111111111111112': 0, // Ensure SOL is always present
                ...(response.balances || {}),
              },
              lockedBalances: response.lockedBalances || {},
              totalBalance: response.totalBalance ? Number(response.totalBalance) : undefined,
            }));
          }
        } catch (error) {
          console.error('Failed to refresh balances:', error);
        }
      },
    }),
    {
      name: 'meme-duels-user-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        authToken: state.authToken,
        userProfile: state.userProfile,
        balances: state.balances,
        lockedBalances: state.lockedBalances,
        totalBalance: state.totalBalance,
      }),
    }
  )
);
