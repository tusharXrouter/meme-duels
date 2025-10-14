"use client";

import React, { useState } from "react";
import { TradeButton } from "@/components/ui/trade-button";

export function TradePanel() {
  const [tab, setTab] = useState<"PLONKY" | "CHONKY">("PLONKY");
  const [amount, setAmount] = useState<string>("0.0");

  const setQuick = (v: string) => setAmount(v);

  return (
    <div className="bg-[#0f0f0f] rounded-xl p-4 border border-white/10 w-full max-w-[420px] mx-auto">
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-3">
        {(["PLONKY", "CHONKY"] as const).map((t) => (
          <button
            key={t}
            className={`px-4 py-1 rounded-full text-xs font-semibold ${
              tab === t ? "bg-white text-black" : "bg-black text-white border border-white/20"
            }`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Buy/Sell */}
      <div className="flex items-center gap-3 mb-3">
        <TradeButton side="left" label="BUY" className="h-10 w-28" />
        <TradeButton side="right" label="SELL" className="h-10 w-28" color="#ff4444" />
      </div>

      {/* Amount */}
      <div className="mb-3">
        <label className="text-xs text-white/70">amount (sol)</label>
        <div className="mt-1 flex items-center gap-2 bg-black border border-white/10 rounded-md px-3 h-11">
          <input
            type="number"
            className="bg-transparent outline-none flex-1 text-white"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <span className="text-white/50 text-xs">SOL</span>
        </div>
      </div>

      {/* Quick selects */}
      <div className="flex items-center gap-2 mb-4">
        {[
          { label: "0.1 SOL", value: "0.1" },
          { label: "0.5 SOL", value: "0.5" },
          { label: "1.5 SOL", value: "1.5" },
        ].map((q) => (
          <button
            key={q.label}
            onClick={() => setQuick(q.value)}
            className="px-3 py-1 rounded-full text-xs bg-black border border-white/15 text-white/80"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Submit */}
      <div className="flex justify-center">
        <TradeButton side="right" label={`BUY $${tab}`} className="h-12 w-80" />
      </div>
    </div>
  );
}
