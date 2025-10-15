"use client";

import Image from "next/image";
import clsx from "clsx";

interface TokenData {
  name: string;
  symbol: string;
  image: string;
  poolSize: number;
  stake: number;
  price: number;
  color: string;
}

interface BattleArenaCardProps {
  tokenA: TokenData;
  tokenB: TokenData;
  status?: "LIVE" | "ENDED" | "UPCOMING";
}

export default function BattleArenaCard({
  tokenA,
  tokenB,
  status = "LIVE",
}: BattleArenaCardProps) {
  return (
    <div className="relative w-full max-w-[680px] rounded-2xl bg-[#0c0d12] shadow-2xl overflow-hidden border border-gray-800">
      {/* Battle Banner */}
      <div className="relative h-[260px]">
        {/* Left Background */}
        <div
          className="absolute inset-0 clip-left"
          style={{ backgroundColor: tokenA.color }}
        ></div>
        {/* Right Background */}
        <div
          className="absolute inset-0 clip-right"
          style={{ backgroundColor: tokenB.color }}
        ></div>
        {/* Diagonal Divider */}
        <div className="absolute inset-0 bg-black clip-divider opacity-90" />

        {/* Center VS */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <span className="text-white text-4xl font-extrabold drop-shadow-lg">VS</span>
        </div>

        {/* Left Token */}
        <div className="absolute top-8 left-6 z-20 flex flex-col items-start">
          <div className="relative w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg">
            <Image
              src={tokenA.image}
              alt={tokenA.name}
              fill
              className="object-cover"
            />
          </div>
          <p className="mt-3 text-white text-lg font-bold uppercase">{tokenA.symbol}</p>
        </div>

        {/* Right Token */}
        <div className="absolute bottom-8 right-6 z-20 flex flex-col items-end">
          <div className="relative w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg">
            <Image
              src={tokenB.image}
              alt={tokenB.name}
              fill
              className="object-cover"
            />
          </div>
          <p className="mt-3 text-white text-lg font-bold uppercase">{tokenB.symbol}</p>
        </div>

        {/* Status Badge */}
        <div
          className={clsx(
            "absolute top-4 right-4 z-30 px-3 py-1 rounded-md text-xs font-semibold",
            {
              "bg-green-500 text-black": status === "LIVE",
              "bg-yellow-400 text-black": status === "UPCOMING",
              "bg-gray-500 text-white": status === "ENDED",
            }
          )}
        >
          {status}
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch gap-3 bg-[#111217] p-4 text-sm text-gray-200">
        {/* Token A Stats */}
        <div className="flex-1 rounded-lg bg-gradient-to-br from-[#004d3a] to-[#00845d] p-4 shadow-md border border-[#00b86e]/30">
          <h3 className="text-lg font-extrabold text-green-300 mb-1">
            BACK {tokenA.symbol}
          </h3>
          <p className="flex justify-between">
            <span>Pool Size:</span>
            <span className="font-semibold">{tokenA.poolSize} SOL</span>
          </p>
          <p className="flex justify-between">
            <span>Your stake:</span>
            <span className="font-semibold">{tokenA.stake} SOL</span>
          </p>
          <p className="flex justify-between items-center">
            <span>Token Price:</span>
            <span className="text-green-400 font-semibold">
              ${tokenA.price.toFixed(4)}
            </span>
            <span className="w-2 h-2 bg-green-400 rounded-full ml-1" />
          </p>
        </div>

        {/* Token B Stats */}
        <div className="flex-1 rounded-lg bg-gradient-to-br from-[#450063] to-[#8b1fa9] p-4 shadow-md border border-[#a855f7]/30">
          <h3 className="text-lg font-extrabold text-purple-300 mb-1">
            BACK {tokenB.symbol}
          </h3>
          <p className="flex justify-between">
            <span>Pool Size:</span>
            <span className="font-semibold">{tokenB.poolSize} SOL</span>
          </p>
          <p className="flex justify-between">
            <span>Your stake:</span>
            <span className="font-semibold">{tokenB.stake} SOL</span>
          </p>
          <p className="flex justify-between items-center">
            <span>Token Price:</span>
            <span className="text-green-400 font-semibold">
              ${tokenB.price.toExponential(2)}
            </span>
            <span className="w-2 h-2 bg-green-400 rounded-full ml-1" />
          </p>
        </div>
      </div>
    </div>
  );
}
