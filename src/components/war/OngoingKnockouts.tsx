"use client";

import React from "react";
import MaskedComponent from "@/components/ui/masked-component";
import { TradeButton } from "@/components/ui/trade-button";
import type { Duel } from "@/types";
import { usePriceStore, selectDuelPrices } from "@/stores/price.store";

interface OngoingKnockoutsProps {
  duels: Duel[];
  onFightNow?: (duelId: string) => void;
}

function PriceRow({ duel }: { duel: Duel }) {
  const selector = React.useMemo(() => selectDuelPrices(duel.id), [duel.id]);
  const prices = usePriceStore(selector);

  const a = prices?.tokenA?.price;
  const b = prices?.tokenB?.price;
  const aQual = prices?.tokenA?.quality;
  const bQual = prices?.tokenB?.quality;

  const fmt = (n?: number) => (typeof n === 'number' && isFinite(n) ? n.toFixed(6) : '—');
  const dot = (q?: string) => (
    <span className={`inline-block w-2 h-2 rounded-full mr-1 ${q === 'live' ? 'bg-green-500' : q === 'fallback' ? 'bg-yellow-500' : 'bg-zinc-500'}`} />
  );

  return (
    <div className="text-center flex flex-col md:flex-row items-center justify-center gap-2">
      <span className="flex items-center text-emerald-400">{dot(aQual)}{fmt(a)}</span>
      <span className="hidden md:inline text-zinc-600">/</span>
      <span className="flex items-center text-fuchsia-400">{dot(bQual)}{fmt(b)}</span>
    </div>
  );
}

export function OngoingKnockouts({ duels, onFightNow }: OngoingKnockoutsProps) {
  const fmtVol = (v: unknown) => {
    const n = typeof v === 'number' ? v : Number(v);
    if (!isFinite(n)) return '—';
    if (n >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
    return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  return (
    <section className="">
      <h2 className="text-center text-[32px] md:text-[40px] font-semibold tracking-wide text-[#46f08a] mb-6">
        ongoing knockouts
      </h2>

      <MaskedComponent
        shape="octagon"
        borderWidth="2px"
        borderColor="#2a2a2a"
        backgroundColor="#0c0c0f"
        className="w-full lg:w-[1000px] max-mx-4 lg:mx-auto overflow-x-auto"
      >
        <div className="w-11/12 mx-auto">
          <div className="grid grid-cols-[1.5fr_repeat(3,minmax(100px,1fr))_160px] px-6 py-3 text-sm uppercase text-zinc-400/90 tracking-wider">
            <div>pairs</div>
            <div className="text-center">epochs</div>
            {/* <div className="text-center">time left</div> */}
            <div className="text-center">volume</div>
            <div className="text-center">price</div>
            <div className="text-center">battle</div>
          </div>

          <div className="divide-y divide-white/5">
            {duels.map((duel) => (
              <div
                key={duel.id}
                className="grid grid-cols-[1.5fr_repeat(3,minmax(100px,1fr))_160px] items-center px-6 py-4 text-sm"
              >
                {/* pairs */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-zinc-200">
                    <span className="font-semibold uppercase">{duel.token_a_name}</span>
                    <span className="text-zinc-500">vs</span>
                    <span className="font-semibold uppercase ">{duel.token_b_name}</span>
                </div>

                {/* epochs - placeholder for now */}
                <div className="text-center text-zinc-400">{duel.total_epochs}</div>

                {/* time left - placeholder until wire to epoch data */}
                {/* <div className="text-center text-zinc-400">{duel.status}</div> */}

                {/* volume mock left/right colors */}
                <div className="text-center">
                  <span className="text-red-400 mr-2">{fmtVol(duel.total_volume)}</span>
                </div>

                {/* live token prices via WS */}
                <PriceRow duel={duel} />

                {/* probability mock */}
                <div className="flex items-center justify-end">
                  <TradeButton
                    side="right"
                    label="bet now"
                    onClick={() => onFightNow?.(duel.id)}
                    className="justify-self-end"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </MaskedComponent>
    </section>
  );
}

export default OngoingKnockouts;
