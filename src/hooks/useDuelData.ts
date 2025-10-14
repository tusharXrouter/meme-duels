import { useEffect, useMemo, useRef, useState } from 'react';
import { duelsAPI } from '@/lib/api';
import { useWarStore } from '@/stores/war.store';
import { Bet, Duel, EpochData } from '@/types';
import { websocketService } from '@/services/websocket.service';
import { notifyBetPlacedFail, notifyBetPlacedSuccess, notifyBetOutcome, notifyEpochSettled, notifyNewEpoch } from '@/utils/notifications';

// Hook to fetch duel by ID
export function useDuelById(duelId: string) {
  const { currentDuel, setCurrentDuel, setLoadingDuel, setDuelError } = useWarStore();
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!duelId) return;
    let cancelled = false;
    setIsLoading(true);
    setLoadingDuel(true);
    setDuelError(null);

    // Immediate REST fetch for fast initial load
    const fetchDuelData = async () => {
      try {
        const response = await duelsAPI.getDuelById(duelId);
        if (cancelled) return;
        if (response?.success && response.duel) {
          setCurrentDuel(response.duel as Duel);
          setIsLoading(false);
          setLoadingDuel(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e);
          setDuelError(e instanceof Error ? e.message : 'Unknown error');
          setIsLoading(false);
          setLoadingDuel(false);
        }
      }
    };

    // Always fetch immediately for snappy UX, WebSocket will update if needed
    if (!currentDuel) {
      fetchDuelData();
    } else {
      setIsLoading(false);
      setLoadingDuel(false);
    }

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duelId]);

  // If WS sets duel quickly, stop loading immediately
  useEffect(() => {
    if (currentDuel) {
      setIsLoading(false);
      useWarStore.getState().setLoadingDuel(false);
    }
  }, [currentDuel]);

  const result = useMemo(() => ({
    data: (currentDuel || undefined) as Duel | undefined,
    isLoading,
    isError: !!error,
    error,
  }), [currentDuel, error, isLoading]);

  return result;
}

// Hook to fetch current epoch for a duel
export function useCurrentEpoch(duelId: string) {
  const { currentEpoch, setCurrentEpoch, setLoadingEpoch, setEpochError, mergeEpochUpdate, applyEpochSettled, setUserBets, setBasePrices } = useWarStore();
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!duelId) return;
    let cancelled = false;
    setIsLoading(true);
    setLoadingEpoch(true);
    setEpochError(null);

    // Subscribe to WS events for this duelId
      // Initial join to receive duel_state and epoch updates (unauth allowed)
      websocketService.joinDuel(duelId);

    // duel_state contains duel and current epoch snapshot
    const offDuelState = websocketService.on('duel_state', (data: unknown) => {
      try {
        if (!data || typeof data !== 'object' || !('duel' in data)) return;
        const duelData = data as { duel: Duel };
        // Only process if this is for our current duel
        if (duelData.duel.id !== duelId) return;
        setCurrentDuelSafe(duelData.duel);
        if (duelData.duel.current_epoch) setCurrentEpoch(duelData.duel.current_epoch as EpochData);
        // Seed base prices from duel_state
        try {
          const a = duelData.duel.current_epoch?.token_a_start_price;
          const b = duelData.duel.current_epoch?.token_b_start_price;
          const epochNumber = duelData.duel.current_epoch?.epoch_number;
          if (typeof a === 'number' && typeof b === 'number' && typeof epochNumber === 'number') {
            setBasePrices({ tokenAStart: a, tokenBStart: b, epochNumber });
          }
        } catch {}
      } catch {}
    });

    const offEpochUpdate = websocketService.on('epoch_update', (epoch: unknown) => {
      if (!epoch || typeof epoch !== 'object') return;
      const epochData = epoch as EpochData;
      mergeEpochUpdate(epochData);
    });

    const offEpochTransition = websocketService.on('epoch_transition', (event: unknown) => {
      if (!event || typeof event !== 'object' || !('epoch' in event)) return;
      const epochEvent = event as { epoch: EpochData };
      setCurrentEpoch(epochEvent.epoch);
    });

    const offNewEpoch = websocketService.on('new_epoch', (event: unknown) => {
      if (!event || typeof event !== 'object' || !('epoch' in event)) return;
      const newEpochEvent = event as { epoch: EpochData };
      setCurrentEpoch(newEpochEvent.epoch);
      // Refresh bets snapshot for the new epoch
      websocketService.getUserBets(duelId);
      // Update base prices for percent-change charting
      try {
        const a = newEpochEvent.epoch?.token_a_start_price;
        const b = newEpochEvent.epoch?.token_b_start_price;
        const epochNumber = newEpochEvent.epoch?.epoch_number;
        if (typeof a === 'number' && typeof b === 'number' && typeof epochNumber === 'number') {
          setBasePrices({ tokenAStart: a, tokenBStart: b, epochNumber });
        }
      } catch {}
      try {
        const duelName = useWarStore.getState().currentDuel?.name;
        notifyNewEpoch({ duelName, epochNumber: newEpochEvent.epoch?.epoch_number });
      } catch {}
    });

    const offEpochSettled = websocketService.on('epoch_settled', (payload: unknown) => {
      try {
        if (!payload || typeof payload !== 'object') return;
        const settledPayload = payload as { 
          winner?: 'token_a' | 'token_b' | 'tie'; 
          epochNumber?: number;
          tokenAPerformance?: number;
          tokenBPerformance?: number;
          tokenAPrice?: { start: number; end: number };
          tokenBPrice?: { start: number; end: number };
          duelId?: string;
        };
        // Only process if this event belongs to our current duel
        if (settledPayload.duelId && settledPayload.duelId !== duelId) return;
        if (settledPayload.epochNumber && settledPayload.winner && 
            settledPayload.tokenAPerformance !== undefined && 
            settledPayload.tokenBPerformance !== undefined &&
            settledPayload.tokenAPrice && settledPayload.tokenBPrice) {
          applyEpochSettled({
            epochNumber: settledPayload.epochNumber,
            winner: settledPayload.winner,
            tokenAPerformance: settledPayload.tokenAPerformance,
            tokenBPerformance: settledPayload.tokenBPerformance,
            tokenAPrice: settledPayload.tokenAPrice,
            tokenBPrice: settledPayload.tokenBPrice
          });
        }
        const duelName = useWarStore.getState().currentDuel?.name;
        const winnerLabel = settledPayload?.winner === 'token_a'
          ? `$${useWarStore.getState().currentDuel?.token_a_symbol ?? 'A'}`
          : (settledPayload?.winner === 'token_b' ? `$${useWarStore.getState().currentDuel?.token_b_symbol ?? 'B'}` : 'Tie');
        notifyEpochSettled({ duelName, epochNumber: settledPayload?.epochNumber, winnerLabel });

        // Optional: infer simple bet outcome for the current user from store bets (epoch match only)
        const epochId = useWarStore.getState().currentEpoch?.id;
        const bets = useWarStore.getState().userBets || [];
        const myBets = bets.filter((b) => (b as UserBet).epoch_id === epochId);
        const totalA = myBets.filter(b => b.choice === 'token_a').reduce((s, b) => s + (b.amount || 0), 0);
        const totalB = myBets.filter(b => b.choice === 'token_b').reduce((s, b) => s + (b.amount || 0), 0);
        const sideLabel = settledPayload?.winner === 'token_a' ? `$${useWarStore.getState().currentDuel?.token_a_symbol ?? 'A'}` : `$${useWarStore.getState().currentDuel?.token_b_symbol ?? 'B'}`;
        if (settledPayload?.winner === 'token_a' || settledPayload?.winner === 'token_b') {
          const won = settledPayload.winner === 'token_a' ? totalA > 0 : totalB > 0;
          const amt = settledPayload.winner === 'token_a' ? totalA : totalB;
          if (amt > 0) notifyBetOutcome({ won, amount: amt, sideLabel });
        }
      } catch {}
    });

    const offUserBets = websocketService.on('user_bets', (payload: unknown) => {
      try { 
        if (payload && typeof payload === 'object' && 'bets' in payload) {
          const betsPayload = payload as { bets: Bet[]; duelId?: string };
          // Only process if this is for our current duel (if duelId is provided)
          if (betsPayload.duelId && betsPayload.duelId !== duelId) return;
          setUserBets(betsPayload.bets || []); 
        }
      } catch {}
    });

    // Bet placed ack notifications
    const offBetPlaced = websocketService.on('bet_placed', (event: unknown) => {
      try {
        if (!event || typeof event !== 'object') return;
        const betEvent = event as { success?: boolean; bet?: { choice?: string; amount?: number }; error?: string; duelId?: string };
        // Only process if this is for our current duel (if duelId is provided)
        if (betEvent.duelId && betEvent.duelId !== duelId) return;
        if (betEvent?.success) {
          const duel = useWarStore.getState().currentDuel;
          const sideLabel = betEvent?.bet?.choice === 'token_a' ? `$${duel?.token_a_symbol ?? 'A'}` : `$${duel?.token_b_symbol ?? 'B'}`;
          notifyBetPlacedSuccess({ sideLabel, amount: betEvent?.bet?.amount || 0 });
        } else {
          notifyBetPlacedFail({ error: betEvent?.error });
        }
      } catch {}
    });

    // Request initial user bets via WS (public)
    websocketService.getUserBets(duelId);

    // Cleanup on unmount or duelId change
    return () => {
      try { websocketService.leaveDuel(duelId); } catch {}
      offDuelState();
      offEpochUpdate();
      offEpochTransition();
      offNewEpoch();
      offEpochSettled();
      offUserBets();
      offBetPlaced();
    };

    // Immediate REST fetch for fast initial load - don't wait for WebSocket
    const immediateRestFetch = async () => {
      if (cancelled) return;
      try {
        const response = await duelsAPI.getCurrentEpoch(duelId);
        if (cancelled) return;
        if (response?.success && response.epoch) {
          setCurrentEpoch(response.epoch as EpochData);
          setIsLoading(false);
          setLoadingEpoch(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e);
          setEpochError(e instanceof Error ? e.message : 'Unknown error');
        }
      }
    };

    // Start immediate REST fetch for snappy UX
    if (!currentEpoch) {
      immediateRestFetch();
    }

    // Also keep a shorter fallback timer as backup
    const restFallbackTimer = setTimeout(async () => {
      if (cancelled || currentEpoch) return;
      try {
        const response = await duelsAPI.getCurrentEpoch(duelId);
        if (response?.success && response.epoch) {
          setCurrentEpoch(response.epoch as EpochData);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e);
          setEpochError(e instanceof Error ? e.message : 'Unknown error');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setLoadingEpoch(false);
        }
      }
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(restFallbackTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duelId]);

  // If WS sets epoch quickly, stop loading immediately
  useEffect(() => {
    if (currentEpoch) {
      setIsLoading(false);
      useWarStore.getState().setLoadingEpoch(false);
    }
  }, [currentEpoch]);

  // Helper to set duel without importing store action here again
  const setCurrentDuelSafe = (duel: Duel) => {
    const { setCurrentDuel } = useWarStore.getState();
    setCurrentDuel(duel);
  };

  const result = useMemo(() => ({
    data: currentEpoch as EpochData | undefined,
    isLoading,
    isError: !!error,
    error,
  }), [currentEpoch, error, isLoading]);

  return result;
}

// Hook to fetch user bets for a duel
interface UserBet extends Bet {
  epoch_id: string;
}

export function useUserBets(duelId: string) {
  const { userBets, setUserBets, setLoadingBets, setBetsError } = useWarStore();
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!duelId) return;
    let cancelled = false;
    setIsLoading(true);
    setLoadingBets(true);
    setBetsError(null);

    // Request snapshot via WS (public)
    websocketService.getUserBets(duelId);

    // REST fallback if still empty after delay (only if endpoint exists)
    const restFallbackTimer = setTimeout(async () => {
      if (cancelled) return;
      try {
        // Placeholder: keep empty array as we do not have REST yet
        const bets: Bet[] = [];
        setUserBets(bets);
      } catch (e) {
        if (!cancelled) {
          setError(e);
          setBetsError(e instanceof Error ? e.message : 'Unknown error');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setLoadingBets(false);
        }
      }
    }, 800);

    return () => {
      cancelled = true;
      clearTimeout(restFallbackTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duelId]);

  const result = useMemo(() => ({
    data: userBets as Bet[] | undefined,
    isLoading,
    isError: !!error,
    error,
  }), [userBets, error, isLoading]);

  return result;
}

// Combined hook to fetch all duel-related data
export function useDuelData(duelId: string) {
  const duelQuery = useDuelById(duelId);
  const epochQuery = useCurrentEpoch(duelId);
  const betsQuery = useUserBets(duelId);
  
  // Additional parallel fetch for instant loading
  useEffect(() => {
    if (!duelId) return;
    
    // Fetch both duel and epoch data in parallel for fastest possible load
    const parallelFetch = async () => {
      try {
        const [duelResponse, epochResponse] = await Promise.all([
          duelsAPI.getDuelById(duelId),
          duelsAPI.getCurrentEpoch(duelId)
        ]);
        
        // Update stores directly for immediate UI update
        const { setCurrentDuel, setCurrentEpoch } = useWarStore.getState();
        
        if (duelResponse?.success && duelResponse.duel) {
          setCurrentDuel(duelResponse.duel as Duel);
        }
        
        if (epochResponse?.success && epochResponse.epoch) {
          setCurrentEpoch(epochResponse.epoch as EpochData);
        }
      } catch (error) {
        console.warn('Parallel fetch failed, falling back to individual hooks:', error);
      }
    };
    
    // Only do parallel fetch if we don't have the data yet
    const { currentDuel, currentEpoch } = useWarStore.getState();
    if (!currentDuel || !currentEpoch) {
      parallelFetch();
    }
  }, [duelId]);
  
  return {
    duel: duelQuery,
    epoch: epochQuery,
    bets: betsQuery,
    isLoading: duelQuery.isLoading || epochQuery.isLoading || betsQuery.isLoading,
    isError: duelQuery.isError || epochQuery.isError || betsQuery.isError,
    error: duelQuery.error || epochQuery.error || betsQuery.error,
  };
}
