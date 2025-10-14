"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import MaskedComponent from "@/components/ui/masked-component";
import { cn } from "@/lib/utils";
import { RealTimeTimer } from "./RealTimeTimer";
import { EpochData } from "@/types";
import { useUserStore } from "@/stores/user.store";
import { Tooltip } from "@/components/ui/tooltip";

type TokenSide = {
  name: string; // e.g. "$TRUMP"
  badgeColor?: string; // tailwind color hex or class for accents
  poolSize?: string; // e.g. "15.8 SOL"
  price: number; // Current market price in USD
  userBalance: number; // User's stake in SOL
  livePrice?: number; // Real-time price from price-streamer
  priceQuality?: string; // 'live' | 'fallback' | 'stale'
};

export type BettingPanelProps = {
  tokenA: TokenSide;
  tokenB: TokenSide;
  epoch?: EpochData | null;
  onBetA?: (amount: number) => void;
  onBetB?: (amount: number) => void;
  onProViewToggle?: (isOpen: boolean) => void;
  isProViewOpen?: boolean;
};

export function BettingPanel({ 
  tokenA, 
  tokenB, 
  epoch,
  onBetA, 
  onBetB, 
  onProViewToggle,
  isProViewOpen = false
}: BettingPanelProps) {
  const [amount, setAmount] = React.useState<string>("");
  const { balances, isAuthenticated } = useUserStore();
  const [vibrateTokenA, setVibrateTokenA] = React.useState(false);
  const [vibrateTokenB, setVibrateTokenB] = React.useState(false);
  const [winToken, setWinToken] = React.useState<"token_a" | "token_b" | "tie" | undefined>(undefined);

  // Trigger vibration animation when epoch gets a winner
  useEffect(() => {
    const winner = epoch?.winner;
    if (winner === 'token_a') {
      setWinToken('token_a');
      setVibrateTokenA(true);
      const t = setTimeout(() => {
        setVibrateTokenA(false);
        setWinToken(undefined)
      }, 500);
      return () => clearTimeout(t);
    } else if (winner === 'token_b') {
      setWinToken('token_b');
      setVibrateTokenB(true);
      const t = setTimeout(() => {
        setVibrateTokenA(false);
        setWinToken(undefined)
      }, 500);
      return () => clearTimeout(t);
    }
  }, [epoch?.winner]);


  const handleMax = () => {
    // Placeholder: in real app, pull actual wallet balance
    setAmount(balances['So11111111111111111111111111111111111111112'].toString());
  };

  const handleProViewToggle = () => {
    onProViewToggle?.(!isProViewOpen);
  };

  const parsedAmount = Number(amount || 0);
  const bettingDisabled = parsedAmount <= 0 || epoch?.status !== 'betting' || !isAuthenticated;

  // Handle bet placement with vibration
  const handleBetA = (amount: number) => {
    onBetA?.(amount);
    // Trigger vibration for token A
    setVibrateTokenA(true);
    setTimeout(() => setVibrateTokenA(false), 300);
  };

  const handleBetB = (amount: number) => {
    onBetB?.(amount);
    // Trigger vibration for token B
    setVibrateTokenB(true);
    setTimeout(() => setVibrateTokenB(false), 300);
  };

  // Helper function to get tooltip message for betting buttons
  const getTooltipMessage = () => {
    // Priority order: authentication > epoch status > amount validation
    if (!isAuthenticated) {
      return "Connect wallet first to place bets";
    }
    if (epoch?.status === 'settling') {
      return "Can't bet, war is settling";
    }
    if (epoch?.status === 'settled') {
      return "Can't bet, war has ended";
    }
    if (epoch?.status !== 'betting') {
      return "Betting is not available right now";
    }
    if (parsedAmount <= 0) {
      return "Enter a valid bet amount";
    }
    return null; // No tooltip needed - betting is allowed
  };

  const tooltipMessage = getTooltipMessage();

  return (
    <MaskedComponent
      shape="octagon"
      borderWidth="2px"
      cornerRadius="10px"
      borderColor="#232323"
      backgroundColor="#0D0D0D"
      className="w-full max-w-[600px] mx-auto rounded-xl bg-[#0b0b0b] border border-white/10"
    >
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header: VS Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-base sm:text-lg lg:text-2xl font-extrabold">
            <span className={cn("h-3 w-3 sm:h-4 sm:w-4 rounded-full border", tokenA.badgeColor ? "border-0" : "border-white/40")} style={tokenA.badgeColor ? { background: tokenA.badgeColor } : undefined} />
            <span className="text-emerald-400">{tokenA.name}</span>
            <span className="text-white/60 mx-1 sm:mx-2">VS</span>
            <span className={cn("h-3 w-3 sm:h-4 sm:w-4 rounded-full border", tokenB.badgeColor ? "border-0" : "border-white/40")} style={tokenB.badgeColor ? { background: tokenB.badgeColor } : undefined} />
            <span className="text-fuchsia-400">{tokenB.name}</span>
          </div>

          <button 
            onClick={handleProViewToggle}
            className={cn(
              "flex items-center justify-center gap-2 px-3 py-1.5 rounded-md border text-xs font-semibold transition-colors w-full sm:w-auto",
              isProViewOpen 
                ? "border-emerald-400 bg-emerald-500/20 text-emerald-300" 
                : "border-emerald-500/50 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-500/10"
            )}
          >
            <span className="i-lucide-bar-chart-3" />
            {isProViewOpen ? "Hide Pro" : "Pro View"}
          </button>
        </div>

        {/* Status */}
        <div className="mt-4 sm:mt-6">
          <RealTimeTimer epoch={epoch || null} />
        </div>

        {/* Sides */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <SideCard
            title={`BACK ${tokenA.name.replace(/^\$/, "")}`}
            poolSize={tokenA.poolSize}
            price={tokenA.price.toString()}
            userBalance={tokenA.userBalance}
            accentClass="from-emerald-600/30 to-emerald-600/10 text-emerald-300 border-emerald-700/40"
            livePrice={tokenA.livePrice}
            priceQuality={tokenA.priceQuality}
            vibrate={vibrateTokenA}
            win={winToken === "token_a"}
          />
          <SideCard
            title={`BACK ${tokenB.name.replace(/^\$/, "")}`}
            poolSize={tokenB.poolSize}
            price={tokenB.price.toString()}
            userBalance={tokenB.userBalance}
            accentClass="from-fuchsia-600/30 to-fuchsia-600/10 text-fuchsia-300 border-fuchsia-700/40"
            livePrice={tokenB.livePrice}
            priceQuality={tokenB.priceQuality}
            vibrate={vibrateTokenB}
            win={winToken === "token_b"}
          />
        </div>

        {/* Bet input */}
        <div className="mt-6 sm:mt-8">
          <div className="text-center text-emerald-400 font-bold text-base sm:text-lg">Place Your Bet</div>
          <div className="text-center text-white/70 text-xs sm:text-sm mt-1">Choose your champion and bet amount</div>

          <div className="mt-3 sm:mt-4">
            <div className="relative">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter Bet Amount"
                className="w-full rounded-lg bg-black/40 border border-white/10 px-3 sm:px-4 py-2.5 sm:py-3 text-white outline-none focus:ring-2 focus:ring-white/10 text-sm sm:text-base"
              />
              <button onClick={handleMax} className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-300 text-xs sm:text-sm font-bold">MAX</button>
            </div>

            <div className="flex items-center w-full gap-2 mt-2">
              {["0.001", "0.002", "0.005", "0.01"].map((val) => (
                <button key={val} onClick={() => setAmount(val)} className="text-emerald-300 text-xs sm:text-sm font-bold w-1/4 px-1.5 sm:px-2.5 py-1 sm:py-2 bg-black/40 border border-white/10 rounded-md">{val}</button>
              ))}
            </div>
          </div>

          <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-3 sm:gap-4">
            {tooltipMessage ? (
              <Tooltip content={tooltipMessage} side="top">
                <button
                  disabled={bettingDisabled}
                  onClick={() => handleBetA(parsedAmount)}
                  className={`rounded-lg ${bettingDisabled ? 'bg-gray-500/80 cursor-not-allowed' : 'bg-emerald-600/80 hover:bg-emerald-600'} text-white/80 font-extrabold py-3 sm:py-4 uppercase text-sm sm:text-base w-full`}
                >
                  BACK {tokenA.name.replace(/^\$/, "")}
                </button>
              </Tooltip>
            ) : (
              <button
                disabled={bettingDisabled}
                onClick={() => handleBetA(parsedAmount)}
                className={`rounded-lg ${bettingDisabled ? 'bg-gray-500/80 cursor-not-allowed' : 'bg-emerald-600/80 hover:bg-emerald-600'} text-white/80 font-extrabold py-3 sm:py-4 uppercase text-sm sm:text-base`}
              >
                BACK {tokenA.name.replace(/^\$/, "")}
              </button>
            )}
            
            {tooltipMessage ? (
              <Tooltip content={tooltipMessage} side="top">
                <button
                  disabled={bettingDisabled}
                  onClick={() => handleBetB(parsedAmount)}
                  className={`rounded-lg ${bettingDisabled ? 'bg-gray-500/80 cursor-not-allowed' : 'bg-fuchsia-700/80 hover:bg-fuchsia-700'} text-white/80 font-extrabold py-3 sm:py-4 uppercase text-sm sm:text-base w-full`}
                >
                  BACK {tokenB.name.replace(/^\$/, "")}
                </button>
              </Tooltip>
            ) : (
              <button
                disabled={bettingDisabled}
                onClick={() => handleBetB(parsedAmount)}
                className={`rounded-lg ${bettingDisabled ? 'bg-gray-500/80 cursor-not-allowed' : 'bg-fuchsia-700/80 hover:bg-fuchsia-700'} text-white/80 font-extrabold py-3 sm:py-4 uppercase text-sm sm:text-base`}
              >
                BACK {tokenB.name.replace(/^\$/, "")}
              </button>
            )}
          </div>
        </div>
      </div>
    </MaskedComponent>
  );
}

type SideCardProps = {
  title: string;
  poolSize?: string;
  price: string;
  userBalance: number;
  accentClass: string;
  livePrice?: number;
  priceQuality?: string;
  vibrate?: boolean;
  win?: boolean;
};

function SideCard({ title, poolSize = "-", price = "-", userBalance = 0, accentClass, livePrice, priceQuality, vibrate = false, win = false }: SideCardProps) {
  const displayPrice = livePrice !== undefined ? livePrice : Number(price);
  const isLive = priceQuality === 'live';
  const isStale = priceQuality === 'stale';
  
  return (
    <motion.div
      animate={vibrate ? { x: [0, -2, 2, -1, 1, 0] } : {}}
      transition={vibrate ? { duration: 0.2, repeat: 10, repeatType: 'loop' } : {}}
      className={cn(
        "relative rounded-xl border bg-gradient-to-b p-3 sm:p-4 lg:p-5",
        accentClass
      )}
    >
      <div className="text-base sm:text-lg lg:text-xl font-extrabold uppercase tracking-wide">{title}</div>
      <div className="mt-3 sm:mt-4 space-y-2 text-white/80 text-sm sm:text-base">
        <div className="flex items-center justify-between">
          <span>Pool Size:</span>
          <span className="font-bold text-white">{poolSize} SOL</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Your stake:</span>
          <span className="font-bold text-white">{userBalance} SOL</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Token Price:</span>
          <div className="flex items-center gap-2">
            <span className={cn(
              "font-extrabold", 
              isLive ? "text-emerald-300" : isStale ? "text-yellow-300" : "text-emerald-300"
            )}>
              ${Number(displayPrice).toPrecision(2)}
            </span>
            {priceQuality && (
              <div className={cn(
                "w-2 h-2 rounded-full",
                isLive ? "bg-green-400" : isStale ? "bg-yellow-400" : "bg-blue-400"
              )} />
            )}
          </div>
        </div>
      </div>
      {/* {win && vibrate && (
        <div className="absolute top-2 right-2 text-xl select-none">🎉</div>
      )} */}

      <motion.div
        animate={win ? { x: [0, -2, 2, -1, 1, 0] } : {}}
        transition={win ? { duration: 2, repeat: 10, repeatType: 'loop' } : {}}
        className={cn("top-2 right-2 text-xl select-none hidden opacity-0 absolute", win ? "block opacity-100" : "opacity-0")}
      >
        🎉
      </motion.div>
    </motion.div>
  );
}

export default BettingPanel;
