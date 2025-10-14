"use client";

import React from "react";
import TradingViewWidget from "@/components/ui/trading-view-widget";

export default function TradingViewDemoPage() {
  return (
    <main className="min-h-screen w-full bg-[#0A0A0A] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">TradingView Widget Demo</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* TRUMP Chart */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#A3FF7C]">$TRUMP Chart</h2>
            <div className="h-96 border border-white/10 rounded-lg overflow-hidden">
              <TradingViewWidget 
                chartHref="https://www.tradingview.com/symbols/BINANCE-TRUMPUSDT/?exchange=BINANCE"
                symbol="BINANCE:TRUMPUSDT"
                theme="dark"
                interval="1"
              />
            </div>
          </div>

          {/* MELANIA Chart */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#FFB07C]">$MELANIA Chart</h2>
            <div className="h-96 border border-white/10 rounded-lg overflow-hidden">
              <TradingViewWidget 
                chartHref="https://www.tradingview.com/symbols/BINANCE-MELANIAUSDT/?exchange=BINANCE"
                symbol="BINANCE:MELANIAUSDT"
                theme="dark"
                interval="5"
              />
            </div>
          </div>

          {/* Light Theme Chart */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-blue-400">Light Theme Chart</h2>
            <div className="h-96 border border-white/10 rounded-lg overflow-hidden">
              <TradingViewWidget 
                chartHref="https://www.tradingview.com/symbols/BINANCE-BTCUSDT/?exchange=BINANCE"
                symbol="BINANCE:BTCUSDT"
                theme="light"
                interval="15"
              />
            </div>
          </div>

          {/* Different Interval Chart */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-purple-400">Daily Chart</h2>
            <div className="h-96 border border-white/10 rounded-lg overflow-hidden">
              <TradingViewWidget 
                chartHref="https://www.tradingview.com/symbols/BINANCE-ETHUSDT/?exchange=BINANCE"
                symbol="BINANCE:ETHUSDT"
                theme="dark"
                interval="D"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
