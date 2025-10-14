import { create } from 'zustand';
import type { PriceUpdateEvent } from '@/services/websocket.service';

export interface DuelPriceData {
  tokenA: {
    price: number;
    timestamp: number;
    quality: string;
  };
  tokenB: {
    price: number;
    timestamp: number;
    quality: string;
  };
  lastUpdate: number;
}

export interface PriceStore {
  updatePrices: (event: PriceUpdateEvent) => void;
  getDuelPrices: (duelId: string) => DuelPriceData | undefined;
  clearPrices: () => void;
  // Data properties
  [key: string]: DuelPriceData | ((event: PriceUpdateEvent) => void) | ((duelId: string) => DuelPriceData | undefined) | (() => void);
}

export const usePriceStore = create<PriceStore>((set, get) => ({
  updatePrices: (event: PriceUpdateEvent) => {
    const { duelId, tokenA, tokenB, serverTime } = event;
    
    set((state) => ({
      ...state,
      [duelId]: {
        tokenA: {
          price: tokenA.priceUsd,
          timestamp: tokenA.timestamp,
          quality: tokenA.quality,
        },
        tokenB: {
          price: tokenB.priceUsd,
          timestamp: tokenB.timestamp,
          quality: tokenB.quality,
        },
        lastUpdate: serverTime || Date.now(),
      },
    }));
  },
  
  getDuelPrices: (duelId: string) => {
    const state = get();
    return state[duelId] as DuelPriceData | undefined;
  },
  
  clearPrices: () => {
    set({});
  },
}));

// Export individual selectors for better performance
export const selectDuelPrices = (duelId: string) => (state: PriceStore): DuelPriceData | undefined => state[duelId] as DuelPriceData | undefined;
export const selectTokenAPrice = (duelId: string) => (state: PriceStore) => (state[duelId] as DuelPriceData)?.tokenA;
export const selectTokenBPrice = (duelId: string) => (state: PriceStore) => (state[duelId] as DuelPriceData)?.tokenB;
