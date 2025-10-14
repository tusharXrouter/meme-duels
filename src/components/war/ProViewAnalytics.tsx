"use client";

import React from "react";
import MaskedComponent from "@/components/ui/masked-component";
import { cn } from "@/lib/utils";

export type LiveBet = {
  time: string; // 15:20:57
  amount: string; // e.g. 0.44 SOL
  sideLabel: string; // e.g. $TRUMP or $MELANIA
  sideAccent?: "emerald" | "fuchsia" | "cyan" | "yellow" | "neutral";
};

export type MarketVitals = {
  name: string; // $TRUMP
  volatilityLabel: string; // High / Medium
  momentumLabel: string; // Strong Bullish ↗ etc
  accent?: "emerald" | "fuchsia" | "cyan" | "amber";
};

export type NarrativeIntel = {
  name: string; // $TRUMP
  attentionScore: number; // 88.5
  status?: string; // Sentiment Spike!
  alert?: boolean;
  accent?: "emerald" | "fuchsia" | "cyan" | "amber";
};

export type ProViewAnalyticsProps = {
  title?: string;
  live: LiveBet[];
  tokenA: MarketVitals;
  tokenB: MarketVitals;
  narrativeA: NarrativeIntel;
  narrativeB: NarrativeIntel;
  lastUpdate?: string;
  latencyMs?: number;
};

const accentToClasses: Record<string, { text: string; border: string; chip: string }> = {
  emerald: { text: "text-emerald-300", border: "border-emerald-700/40", chip: "bg-emerald-500" },
  fuchsia: { text: "text-fuchsia-300", border: "border-fuchsia-700/40", chip: "bg-fuchsia-500" },
  cyan: { text: "text-cyan-300", border: "border-cyan-700/40", chip: "bg-cyan-500" },
  amber: { text: "text-amber-300", border: "border-amber-700/40", chip: "bg-amber-500" },
  neutral: { text: "text-white/80", border: "border-white/10", chip: "bg-white/30" },
};

export default function ProViewAnalytics({
  title = "PRO VIEW ANALYTICS",
  live,
  tokenA,
  tokenB,
  narrativeA,
  narrativeB,
  lastUpdate,
  latencyMs,
}: ProViewAnalyticsProps) {
  return (
    <MaskedComponent
      shape="octagon"
      borderWidth="2px"
      cornerRadius="10px"
      borderColor="#232323"
      backgroundColor="#0D0D0D"
      className="w-full max-w-[600px] mx-auto rounded-xl bg-[#0b0b0b] border border-white/10"
    >
      <div className="p-4 sm:p-6">
        {/* Title row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold tracking-wide">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-white/90">{title}</span>
          </div>
          <div className="text-white/50 text-xs">REAL–TIME</div>
        </div>

        {/* Live Bet Tape */}
        <SectionTitle>LIVE BET TAPE</SectionTitle>
        <div className="relative rounded-lg border border-white/10 bg-black/30">
          <div className="absolute right-3 top-2 text-[10px] text-white/60">• STREAMING</div>
          <div className="px-3 pt-6 pb-2 font-mono text-sm max-h-40 overflow-auto">
            {live.map((row, i) => {
              const c = accentToClasses[row.sideAccent || "neutral"]; 
              return (
                <div key={i} className="grid grid-cols-[auto_1fr_auto] items-center py-1">
                  <div className="text-white/50 pr-3">{row.time}</div>
                  <div className="text-white/90">{row.amount}</div>
                  <div className={cn("pl-3 font-bold", c.text)}>{row.sideLabel}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Market Vitals */}
        <SectionTitle className="mt-5">MARKET VITALS</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <VitalsCard data={tokenA} />
          <VitalsCard data={tokenB} />
        </div>

        {/* Narrative Intel */}
        <SectionTitle className="mt-5">NARRATIVE INTEL</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NarrativeCard data={narrativeA} />
          <NarrativeCard data={narrativeB} />
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between text-xs text-white/50">
          <div>Last Update: {lastUpdate}</div>
          <div>Latency: {latencyMs}ms</div>
        </div>
      </div>
    </MaskedComponent>
  );
}

function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mt-4 mb-2 text-white/70 text-sm font-bold tracking-wider", className)}>
      {children}
    </div>
  );
}

function VitalsCard({ data }: { data: MarketVitals }) {
  const accent = accentToClasses[data.accent || "neutral"]; 
  return (
    <div className={cn("rounded-xl border p-4 bg-gradient-to-b from-white/5 to-white/0", accent.border)}>
      <div className={cn("font-extrabold", data.accent === "emerald" ? "text-emerald-300" : data.accent === "fuchsia" ? "text-fuchsia-300" : "text-white/90")}>{data.name}</div>
      <div className="mt-3 space-y-2 text-white/80 text-sm">
        <div className="flex items-center justify-between">
          <span>Volatility:</span>
          <span className="text-amber-300 font-semibold">{data.volatilityLabel}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Momentum:</span>
          <span className="text-emerald-300 font-semibold">{data.momentumLabel}</span>
        </div>
      </div>
    </div>
  );
}

function NarrativeCard({ data }: { data: NarrativeIntel }) {
  const accent = accentToClasses[data.accent || "neutral"]; 
  return (
    <div className={cn("rounded-xl border p-4 bg-gradient-to-b from-white/5 to-white/0", accent.border)}>
      <div className={cn("font-extrabold", data.accent === "emerald" ? "text-emerald-300" : data.accent === "fuchsia" ? "text-fuchsia-300" : "text-white/90")}>{data.name}</div>
      <div className="mt-3 text-white/80 text-sm">Kaito Attention Score:</div>
      <div className={cn("mt-1 text-3xl font-extrabold", accent.text)}>{data.attentionScore.toFixed(1)}</div>
      {data.status ? (
        <div className="mt-2 text-amber-300 text-sm font-semibold">{data.status}</div>
      ) : null}
      {data.alert ? (
        <div className="mt-2 inline-flex items-center gap-2 text-[10px] text-amber-300">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          Risk Alert
        </div>
      ) : null}
    </div>
  );
}
