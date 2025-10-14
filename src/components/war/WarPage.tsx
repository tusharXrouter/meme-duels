/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BettingPanel from "@/components/war/BettingPanel";
import ProViewAnalytics, { LiveBet as UILiveBet } from "@/components/war/ProViewAnalytics";
import { duelsAPI } from "@/lib/api";
import { websocketService } from "@/services/websocket.service";
import { apiClient } from "@/lib/api-client";
import { usePrivy } from '@privy-io/react-auth';
import { useDuelData } from "@/hooks/useDuelData";
import { useWarStore } from "@/stores/war.store";
import { usePriceStore, selectDuelPrices } from "@/stores/price.store";
import { TransactionBanner } from "@/components/TransactionBanner";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import RealtimeTokenChart from '@/components/war/RealtimeTokenChart';

interface WarPageProps {
  duelId: string;
  showTransactionBanner?: boolean;
  className?: string;
}

export default function WarPage({ duelId, showTransactionBanner = true, className = "" }: WarPageProps) {
  const [isProViewOpen, setIsProViewOpen] = React.useState(false);
  const { ready, authenticated, getAccessToken } = usePrivy();
  const [liveBets, setLiveBets] = React.useState<UILiveBet[]>([]);
  // Refs to always have latest symbols inside WS handlers without resubscribing
  const tokenASymbolRef = useRef<string>('A');
  const tokenBSymbolRef = useRef<string>('B');
  // Track seen bet IDs for dedupe between preload and live stream
  const seenBetIdsRef = useRef<Set<string>>(new Set());
  const lastEpochNumberRef = useRef<number | undefined>(undefined);
  const MAX_LIVE_ROWS = 200;
  
  // Performance tracking
  const componentMountTime = useRef<number>(Date.now());
  const firstDataTime = useRef<number | null>(null);

  // Full precision formatting without scientific notation
  const formatAmountFull = (num: number): string => {
    if (!Number.isFinite(num)) return String(num);
    // Use toLocaleString to control fraction digits while avoiding grouping
    return num.toLocaleString('en-US', { useGrouping: false, maximumFractionDigits: 20 });
  };

  // War store for data management
  const { clearWarData, userBets } = useWarStore();
  
  // Price store for real-time prices
  const priceSelector = selectDuelPrices(duelId);
  const duelPrices = usePriceStore(priceSelector);

  // Fetch duel data using TanStack Query
  const { duel, epoch } = useDuelData(duelId);

  // Ensure we join the WebSocket room for this specific duel immediately
  useEffect(() => {
    if (duelId) {
      // Join WebSocket room immediately for real-time updates
      websocketService.joinDuel(duelId);
      
      // Also immediately try to get any cached duel_state if available
      const handleImmediateDuelState = () => {
        // This will be handled by the useDuelData hook's WebSocket listeners
      };
      
      handleImmediateDuelState();
    }
  }, [duelId]);

  // Keep token symbols up-to-date for use inside WS event handlers
  useEffect(() => {
    const a = duel.data?.token_a_symbol;
    const b = duel.data?.token_b_symbol;
    if (a && a.length > 0) tokenASymbolRef.current = a;
    if (b && b.length > 0) tokenBSymbolRef.current = b;
  }, [duel.data?.token_a_symbol, duel.data?.token_b_symbol]);

  // Subscribe to price updates for this duel's token mints as soon as we have the data
  useEffect(() => {
    const aMint = duel.data?.token_a_mint;
    const bMint = duel.data?.token_b_mint;
    const aSym = duel.data?.token_a_symbol;
    const bSym = duel.data?.token_b_symbol;
    
    if (!duelId || !aMint || !bMint || !aSym || !bSym) return;
    
    // Subscribe immediately for real-time price updates
    websocketService.subscribeDuelPrices(duelId, aMint, aSym, bMint, bSym);
    
    console.log(`Subscribed to price updates for ${aSym}/${bSym} in duel ${duelId}`);
  }, [duelId, duel.data?.token_a_mint, duel.data?.token_b_mint, duel.data?.token_a_symbol, duel.data?.token_b_symbol]);

  // Clear live tape when epoch changes (show only current epoch)
  useEffect(() => {
    const epochNumber = epoch.data?.epoch_number;
    if (epochNumber === undefined) return;
    if (lastEpochNumberRef.current !== undefined && lastEpochNumberRef.current !== epochNumber) {
      seenBetIdsRef.current.clear();
      setLiveBets([]);
    }
    lastEpochNumberRef.current = epochNumber;
  }, [epoch.data?.epoch_number]);

  // Initialize WebSocket authentication and real-time updates
  useEffect(() => {
    if (ready && authenticated) {
      const authenticateWS = async () => {
        try {
          const token = await getAccessToken();
          if (token) {
            websocketService.authenticate(token);
          }
        } catch {
          console.error('Failed to authenticate WebSocket');
        }
      };

      authenticateWS();
    }
  }, [ready, authenticated, getAccessToken]);

  // WebSocket live bet feed (UI-only) and epoch tape clearing
  useEffect(() => {
    if (!duelId) return;

    // Live bet events for Pro View feed
    const unsubscribeLive = websocketService.on('live_bet', (evt) => {
      if (!evt || evt.duelId !== duelId) return;
      if (evt.bet?.id && seenBetIdsRef.current.has(evt.bet.id)) return; // Dedupe
      if (evt.bet?.id) seenBetIdsRef.current.add(evt.bet.id);
      const ts = typeof evt.serverTime === 'string' ? new Date(evt.serverTime) : (evt.serverTime ? new Date(Number(evt.serverTime)) : new Date());
      const hh = String(ts.getHours()).padStart(2, '0');
      const mm = String(ts.getMinutes()).padStart(2, '0');
      const ss = String(ts.getSeconds()).padStart(2, '0');
      const time = `${hh}:${mm}:${ss}`;
      const amount = `${formatAmountFull(evt.bet.amount)} SOL`;
      const isA = evt.bet.choice === 'token_a';
      // Use refs so we don't depend on stale closure of duel.data
      const sideLabel = isA ? `$${tokenASymbolRef.current}` : `$${tokenBSymbolRef.current}`;
      const sideAccent: UILiveBet['sideAccent'] = isA ? 'emerald' : 'fuchsia';
      setLiveBets((prev) => [{ time, amount, sideLabel, sideAccent }, ...prev].slice(0, MAX_LIVE_ROWS));
    });

    // Cleanup on unmount
    return () => {
      unsubscribeLive();
    };
  }, [duelId]);

  // Cleanup war data when component unmounts
  useEffect(() => {
    return () => {
      clearWarData();
    };
  }, [clearWarData]);

  const handleProViewToggle = (isOpen: boolean) => {
    setIsProViewOpen(isOpen);
  };

  // Betting handlers with WebSocket integration
  const handleBet = async (choice: 'token_a' | 'token_b', amount: number) => {
    try {
      if (!ready || !authenticated) {
        console.warn('User not authenticated');
        return;
      }
      if (!duelId) {
        console.warn('Missing duel id');
        return;
      }
      if (!amount || amount <= 0 || Number.isNaN(amount)) {
        console.warn('Invalid bet amount');
        return;
      }

      const token = await getAccessToken();
      if (!token) {
        console.warn('Missing access token');
        return;
      }

      // Set auth header for this session
      apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;

      console.log('Placing bet', { duelId, choice, amount });

      // Generate an idempotency key per user click (allowing many per second)
      const idempotencyKey = (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
        ? (crypto as any).randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      // Try WebSocket first if available
      if (websocketService.connected && websocketService.authenticated) {
        console.log('Using WebSocket for bet placement');
        websocketService.placeBet(duelId, choice, amount, idempotencyKey);
      } else {
        console.log('WebSocket not ready, using REST API');
        const res = await duelsAPI.placeBet(duelId, { choice, amount, idempotencyKey });
        console.log('placeBet response:', res);

        if (res?.success) {
          // Dispatch global event for any listeners; epoch_update will follow via WS
          window.dispatchEvent(new CustomEvent('bet-placed', { detail: { duelId, choice, amount } }));
        } else {
          console.warn('Bet failed:', res?.error || 'Unknown error');
        }
      }
    } catch (err) {
      console.error('Error placing bet:', err);
    }
  };

  // Preload existing bets for the current epoch when Pro View opens
  useEffect(() => {
    const loadHistory = async () => {
      try {
        if (!isProViewOpen || !duelId || !epoch.data?.epoch_number) return;
        const res = await duelsAPI.getEpochDetails(duelId, epoch.data.epoch_number);
        if (!res?.success || !res.epoch) return;
        const bets = (res.epoch as any).bets as Array<{ id: string; choice: 'token_a' | 'token_b'; amount: number; created_at?: string } | undefined> | undefined;
        if (!bets || bets.length === 0) return;
        // Sort newest first
        const sorted = bets
          .filter(Boolean)
          .sort((a: any, b: any) => new Date(b?.created_at || 0).getTime() - new Date(a?.created_at || 0).getTime());
        // Map to UI rows and dedupe
        const rows: UILiveBet[] = [];
        for (const b of sorted as any[]) {
          if (!b?.id) continue;
          if (seenBetIdsRef.current.has(b.id)) continue;
          seenBetIdsRef.current.add(b.id);
          const dt = b.created_at ? new Date(b.created_at) : new Date();
          const hh = String(dt.getHours()).padStart(2, '0');
          const mm = String(dt.getMinutes()).padStart(2, '0');
          const ss = String(dt.getSeconds()).padStart(2, '0');
          const time = `${hh}:${mm}:${ss}`;
          const isA = b.choice === 'token_a';
          rows.push({
            time,
            amount: `${formatAmountFull(b.amount)} SOL`,
            sideLabel: isA ? `$${tokenASymbolRef.current}` : `$${tokenBSymbolRef.current}`,
            sideAccent: isA ? 'emerald' : 'fuchsia',
          });
        }
        setLiveBets((prev) => [...prev, ...rows].slice(0, MAX_LIVE_ROWS));
      } catch (e) {
        console.warn('Failed to load live bet history', e);
      }
    };
    loadHistory();
  }, [isProViewOpen, duelId, epoch.data?.epoch_number]);

  // Show UI immediately with partial data, only show loading for missing critical data
  const hasMinimalData = duel.data?.token_a_name && duel.data?.token_b_name;
  const showFullUI = hasMinimalData; // Show UI as soon as we have token names
  
  // Performance logging for optimization tracking
  React.useEffect(() => {
    if (hasMinimalData && !firstDataTime.current) {
      firstDataTime.current = Date.now();
      const loadTime = firstDataTime.current - componentMountTime.current;
      console.log(`✅ WarPage: UI rendered with minimal data in ${loadTime}ms - FAST!`);
    }
  }, [hasMinimalData]);
  
  return (
    <main className={`min-h-screen w-full bg-[#0A0A0A] text-white ${className}`}>
      {showTransactionBanner && <TransactionBanner />}
      {!showFullUI ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner text="Loading battle data..." />
        </div>
      ) : (
        <div className="mx-auto max-w-[1440px] px-6 py-8">
          <div className="hidden md:flex items-center justify-center gap-2 text-base sm:text-lg lg:text-2xl font-extrabold">
            <span className="text-emerald-400">
            {duel.data?.token_a_name} ({duel.data?.token_a_symbol})
            </span>
            <span className="text-white/60 mx-1 sm:mx-2">VS</span>
            <span className="text-fuchsia-400">
              {duel.data?.token_b_name} ({duel.data?.token_b_symbol})
            </span>
          </div>

          {/* Battle Section */}
          <div className="my-12">
            {duel.data?.token_a_symbol && duel.data?.token_b_symbol ? (
              <RealtimeTokenChart
                duelId={duelId}
                tokenAName={duel.data.token_a_name}
                tokenBName={duel.data.token_b_name}
                tokenASymbol={duel.data.token_a_symbol}
                tokenBSymbol={duel.data.token_b_symbol}
              />
            ) : (
              <div className="flex justify-center items-center h-[400px] bg-black/20 rounded-lg border border-white/10">
                <LoadingSpinner text="Loading chart data..." />
              </div>
            )}
          </div>

          {/* Betting Panel with Pro View Dropdown */}
          <div className="relative my-8">
            {(() => {
              const epochId = epoch.data?.id;
              const myBets = (userBets || []).filter((b) => b.epoch_id === epochId);
              const stakeA = myBets.filter((b) => b.choice === 'token_a').reduce((sum, b) => sum + (Number(b.amount) || 0), 0).toPrecision(2);
              const stakeB = myBets.filter((b) => b.choice === 'token_b').reduce((sum, b) => sum + (Number(b.amount) || 0), 0).toPrecision(2);
              
              return (
                <BettingPanel
                  tokenA={{ 
                    name: duel.data?.token_a_name || 'Loading...', 
                    badgeColor: "#22c55e", 
                    poolSize: epoch.data?.token_a_total?.toString() || '0', 
                    price: epoch.data?.token_a_start_price || 0, 
                    userBalance: Number(stakeA),
                    livePrice: duelPrices?.tokenA?.price,
                    priceQuality: duelPrices?.tokenA?.quality
                  }}
                  tokenB={{ 
                    name: duel.data?.token_b_name || 'Loading...', 
                    badgeColor: "#d946ef", 
                    poolSize: epoch.data?.token_b_total?.toString() || '0', 
                    price: epoch.data?.token_b_start_price || 0, 
                    userBalance: Number(stakeB),
                    livePrice: duelPrices?.tokenB?.price,
                    priceQuality: duelPrices?.tokenB?.quality
                  }}
                  epoch={epoch.data || {
                    id: 'loading',
                    epoch_number: 0,
                    status: 'betting' as const,
                    start_time: new Date().toISOString(),
                    betting_end_time: new Date().toISOString(),
                    settlement_end_time: new Date().toISOString(),
                    token_a_total: 0,
                    token_b_total: 0,
                    total_bets_count: 0,
                    token_a_start_price: 0,
                    token_b_start_price: 0,
                    timeRemaining: 0
                  }}
                  onBetA={(amount) => handleBet('token_a', amount)}
                  onBetB={(amount) => handleBet('token_b', amount)}
                  onProViewToggle={handleProViewToggle}
                  isProViewOpen={isProViewOpen}
                />
              );
            })()}

            {/* Pro View Analytics - Dropdown Animation */}
            <AnimatePresence>
              {isProViewOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0, y: -10 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -10 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                    height: { duration: 0.3, ease: "easeInOut" }
                  }}
                  className="mt-4 overflow-hidden"
                >
                  {/* Connecting line indicator */}
                  <div className="w-px h-4 bg-gradient-to-b from-emerald-500/50 to-transparent mx-auto mb-2" />

                  <ProViewAnalytics
                    live={liveBets}
                    tokenA={{ name: `$${duel.data?.token_a_symbol || 'A'}`, volatilityLabel: "High 🔥", momentumLabel: "Strong Bullish ↗", accent: "emerald" }}
                    tokenB={{ name: `$${duel.data?.token_b_symbol || 'B'}`, volatilityLabel: "Medium", momentumLabel: "Fading Bearish ↘", accent: "fuchsia" }}
                    narrativeA={{ name: `$${duel.data?.token_a_symbol || 'A'}`, attentionScore: 88.5, status: "⚡ Sentiment Spike!", alert: true, accent: "emerald" }}
                    narrativeB={{ name: `$${duel.data?.token_b_symbol || 'B'}`, attentionScore: 65.2, status: "Stable narrative", alert: false, accent: "fuchsia" }}
                    lastUpdate={liveBets[0]?.time || "--:--:--"}
                    latencyMs={12}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </main>
  );
}
