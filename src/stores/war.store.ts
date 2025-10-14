import { create } from 'zustand';
import { Duel, EpochData, Bet } from '@/types';

interface WarState {
  // Current duel data
  currentDuel: Duel | null;
  currentEpoch: EpochData | null;
  userBets: Bet[];
  // Base prices for percent-change charting
  basePrices: {
    tokenAStart: number;
    tokenBStart: number;
    epochNumber: number;
  } | null;
  lastEpochSettled?: {
    epochNumber: number;
    winner: 'token_a' | 'token_b' | 'tie';
    tokenAPerformance: number;
    tokenBPerformance: number;
    tokenAPrice: { start: number; end: number };
    tokenBPrice: { start: number; end: number };
  } | null;
  
  // Loading states
  isLoadingDuel: boolean;
  isLoadingEpoch: boolean;
  isLoadingBets: boolean;
  
  // Error states
  duelError: string | null;
  epochError: string | null;
  betsError: string | null;
  
  // Actions
  setCurrentDuel: (duel: Duel | null) => void;
  setCurrentEpoch: (epoch: EpochData | null) => void;
  setUserBets: (bets: Bet[]) => void;
  mergeEpochUpdate: (partial: Partial<EpochData>) => void;
  applyEpochSettled: (payload: {
    epochNumber: number;
    winner: 'token_a' | 'token_b' | 'tie';
    tokenAPerformance: number;
    tokenBPerformance: number;
    tokenAPrice: { start: number; end: number };
    tokenBPrice: { start: number; end: number };
  }) => void;
  // Base price actions
  setBasePrices: (payload: { tokenAStart?: number | null; tokenBStart?: number | null; epochNumber?: number | null }) => void;
  
  setLoadingDuel: (loading: boolean) => void;
  setLoadingEpoch: (loading: boolean) => void;
  setLoadingBets: (loading: boolean) => void;
  
  setDuelError: (error: string | null) => void;
  setEpochError: (error: string | null) => void;
  setBetsError: (error: string | null) => void;
  
  // Clear all data
  clearWarData: () => void;
  
  // Log data for debugging
  logWarData: () => void;
}

export const useWarStore = create<WarState>((set, get) => ({
  // Initial state
  currentDuel: null,
  currentEpoch: null,
  userBets: [],
  lastEpochSettled: null,
  basePrices: null,
  
  isLoadingDuel: false,
  isLoadingEpoch: false,
  isLoadingBets: false,
  
  duelError: null,
  epochError: null,
  betsError: null,
  
  // Actions
  setCurrentDuel: (duel) => {
    set({ currentDuel: duel });
    console.log('War Store - Current Duel Updated:', duel);
  },
  
  setCurrentEpoch: (epoch) => {
    set({ currentEpoch: epoch });
    console.log('War Store - Current Epoch Updated:', epoch);
  },
  
  setUserBets: (bets) => {
    set({ userBets: bets });
    console.log('War Store - User Bets Updated:', bets);
  },

  mergeEpochUpdate: (partial) => {
    const existing = get().currentEpoch;
    if (!existing) return;
    const merged: EpochData = { ...existing, ...partial } as EpochData;
    set({ currentEpoch: merged });
    console.log('War Store - Epoch Merged Update:', partial);
  },

  applyEpochSettled: (payload) => {
    const existing = get().currentEpoch;
    if (!existing) return;
    const merged: EpochData = {
      ...existing,
      status: 'settled',
      winner: payload.winner,
      token_a_end_price: payload.tokenAPrice.end,
      token_b_end_price: payload.tokenBPrice.end,
      token_a_performance: payload.tokenAPerformance,
      token_b_performance: payload.tokenBPerformance,
    } as EpochData;
    set({ currentEpoch: merged, lastEpochSettled: { ...payload } });
    console.log('War Store - Epoch Settled Applied:', payload);
  },

  setBasePrices: (payload) => {
    const prev = get().basePrices;
    const next = {
      tokenAStart: payload.tokenAStart ?? prev?.tokenAStart ?? 0,
      tokenBStart: payload.tokenBStart ?? prev?.tokenBStart ?? 0,
      epochNumber: payload.epochNumber ?? prev?.epochNumber ?? 0,
    };
    set({ basePrices: next });
    console.log('War Store - Base Prices Updated:', next);
  },
  
  setLoadingDuel: (loading) => set({ isLoadingDuel: loading }),
  setLoadingEpoch: (loading) => set({ isLoadingEpoch: loading }),
  setLoadingBets: (loading) => set({ isLoadingBets: loading }),
  
  setDuelError: (error) => {
    set({ duelError: error });
    if (error) console.error('War Store - Duel Error:', error);
  },
  
  setEpochError: (error) => {
    set({ epochError: error });
    if (error) console.error('War Store - Epoch Error:', error);
  },
  
  setBetsError: (error) => {
    set({ betsError: error });
    if (error) console.error('War Store - Bets Error:', error);
  },
  
  clearWarData: () => {
    set({
      currentDuel: null,
      currentEpoch: null,
      userBets: [],
      isLoadingDuel: false,
      isLoadingEpoch: false,
      isLoadingBets: false,
      duelError: null,
      epochError: null,
      betsError: null,
    });
    console.log('War Store - All data cleared');
  },
  
  logWarData: () => {
    const state = get();
    console.log('=== WAR STORE DATA ===');
    console.log('Current Duel:', state.currentDuel);
    console.log('Current Epoch:', state.currentEpoch);
    console.log('User Bets:', state.userBets);
    console.log('Loading States:', {
      duel: state.isLoadingDuel,
      epoch: state.isLoadingEpoch,
      bets: state.isLoadingBets,
    });
    console.log('Error States:', {
      duel: state.duelError,
      epoch: state.epochError,
      bets: state.betsError,
    });
    console.log('=====================');
  },
}));
