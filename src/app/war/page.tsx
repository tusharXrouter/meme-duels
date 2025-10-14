"use client";

import React, { useEffect, useState, useCallback } from "react";
import OngoingKnockouts from "@/components/war/OngoingKnockouts";
import { duelsAPI } from "@/lib/api";
import { websocketService } from "@/services/websocket.service";
import { usePrivy } from '@privy-io/react-auth';
import type { Duel } from "@/types";

export default function WarPage() {
  const [duels, setDuels] = useState<Duel[]>([]);
  const { ready, authenticated, getAccessToken } = usePrivy();

  const loadDuels = useCallback(async () => {
    try {
      const all = await duelsAPI.getActiveDuels() as { success: boolean; duels: Duel[] };
      if (all?.success) {
        setDuels(all.duels || []);
        // Join WS rooms for all listed duels so we receive price_update heartbeats
        (all.duels || []).forEach((d) => {
          if (d?.id) websocketService.joinDuel(d.id);
        });
        // Subscribe to prices for all visible duels
        (all.duels || []).forEach((d) => {
          if (!d?.id) return;
          if (d.token_a_mint && d.token_b_mint && d.token_a_symbol && d.token_b_symbol) {
            websocketService.subscribeDuelPrices(
              d.id,
              d.token_a_mint,
              d.token_a_symbol,
              d.token_b_mint,
              d.token_b_symbol,
            );
          }
        });
      }
    } catch {
      console.error('Failed to load duels');
    }
  }, []);

  // Initialize WebSocket authentication
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

  useEffect(() => {
    // Initial load
    loadDuels();
    
    // Set up real-time updates via WebSocket events
    const unsubscribeAuth = websocketService.on('authenticated', (data) => {
      if (data.success) {
        console.log('WebSocket authenticated, refreshing duels');
        loadDuels();
      }
    });

    // Listen for custom events from CreateDuelModal (fallback for duel creation)
    const handleRefresh = () => {
      console.log('Manual refresh triggered');
      loadDuels();
    };
    
    window.addEventListener('duel-created', handleRefresh);
    window.addEventListener('bet-placed', handleRefresh);
    
    return () => {
      unsubscribeAuth();
      // Optionally leave duel rooms when navigating away from list
      try {
        duels.forEach((d) => d?.id && websocketService.leaveDuel(d.id));
      } catch {}
      window.removeEventListener('duel-created', handleRefresh);
      window.removeEventListener('bet-placed', handleRefresh);
    };
  }, [loadDuels, duels]);


  return (
    <main className="min-h-screen w-full bg-[#0A0A0A] text-white">


        {/* Ongoing Knockouts Table */}
        <OngoingKnockouts
          duels={duels}
          onFightNow={(id) => {
            // navigate to duel page when available
            window.location.href = `/war/${id}`
          }}
        />

    </main>
  );
}
