"use client";

import React, { useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import MemeBattleCard from "@/components/MemeBattleCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import WarPage from "@/components/war/WarPage";
import { duelsAPI } from "@/lib/api";
import { websocketService } from "@/services/websocket.service";
import { usePrivy } from '@privy-io/react-auth';
import type { Duel } from "@/types";
import { useRouter } from 'next/navigation';

// Helper to compute avatar URL from token mint (fallback to local logo)
const getAvatarSrc = (mint?: string) => {
  if (mint && mint.length > 0) {
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/assets/${mint}/logo.png`;
  }
  return "/logo.png";
};

export default function Home() {
  const { ready, authenticated, getAccessToken } = usePrivy();
  const router = useRouter();

  // Simplified data fetching with TanStack Query
  const { data: duelsData, isLoading, error } = useQuery({
    queryKey: ['active-duels'],
    queryFn: async () => {
      const response = await duelsAPI.getActiveDuels() as { success: boolean; duels: Duel[] };
      if (response?.success && response.duels) {
        return response.duels;
      }
      throw new Error('Failed to fetch duels');
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
    retry: 2,
  });

  // Get the first duel as featured
  const featuredDuel = duelsData?.[0] || null;

  // Initialize WebSocket authentication for notifications
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#181824] via-[#23243a] to-[#181824] flex flex-col items-center">
      <div className="min-h-screen">
        {isLoading ? (
          <div className="w-full mb-12">
            <div className="max-w-6xl mx-auto flex justify-center">
              <LoadingSpinner text="Loading battle data..." />
            </div>
          </div>
      ) : error ? (
        <div className="w-full mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-red-400 mb-2">
              No Featured Battle Available
            </h2>
            <p className="text-lg text-gray-300">
              Check back later for the next epic showdown
            </p>
          </div>
        </div>
      ) : featuredDuel ? (
        <div className="w-full mb-12">
            <WarPage 
              duelId={featuredDuel.id} 
              showTransactionBanner={true}
              className="bg-transparent"
            />
        </div>
      ) : null}
    </div>

      {!isLoading && <div className=" mx-auto p-8 flex flex-col items-center">
        {/* Title & Subtitle */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-green-300 mb-2">
            meme knockouts
          </h1>
          <p className="text-lg text-gray-300">
            pick a side. make your meme win.
          </p>
        </div>
        {/* Meme Cards */}
        <div className="flex flex-wrap gap-2 md:gap-8 justify-center mb-12">
          {(duelsData || []).map((duel) => {
            const left = {
              name: duel.token_a_symbol || duel.token_a_name,
              avatar: {
                src: getAvatarSrc(duel.token_a_mint),
                alt: duel.token_a_name || duel.token_a_symbol || 'Token A'
              },
              theme: { backgroundColor: "#22c55e", textColor: "#111827" },
            };
            const right = {
              name: duel.token_b_symbol || duel.token_b_name,
              avatar: {
                src: getAvatarSrc(duel.token_b_mint),
                alt: duel.token_b_name || duel.token_b_symbol || 'Token B'
              },
              theme: { backgroundColor: "#d946ef", textColor: "#111827" },
            };
            return (
              <MemeBattleCard
                key={duel.id}
                left={left}
                right={right}
                isHot={!!duel.featured}
                className="shadow-xl"
                onClick={() => router.push(`/war/${duel.id}`)}
              />
            );
          })}
        </div>
      </div>
      }
    </main>
  );
}
