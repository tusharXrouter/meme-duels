"use client";

import React from "react";
import MaskedComponent from "@/components/ui/masked-component";

type StatRow = {
  label: string;
  value: string;
  indicatorColor?: string; // color of the single indicator
  percentage?: number; // 0-100 fill amount
};

type StatListProps = {
  side?: "left" | "right";
  stats: StatRow[];
  className?: string;
  orientation?: "vertical" | "horizontal"; // controls bar direction and text placement
};

function IndicatorBar({ color, percent, height, width = 10, orientation = "vertical" }:{ color: string; percent: number; height: number; width?: number; orientation?: "vertical" | "horizontal" }) {
  const clamped = Math.max(0, Math.min(100, percent ?? 100));
  const containerStyle = orientation === "vertical" ? { height, width: 'w-1/4' } : { height: width, width: height };
  const fillStyle = orientation === "vertical" ? { height: `${clamped}%`, left: 0, right: 0, bottom: 0 } : { width: `${clamped}%`, top: 0, bottom: 0, left: 0 };
  return (
    <div className={`relative`} style={containerStyle}>
      {/* Track */}
      <MaskedComponent
        shape="rounded"
        cornerRadius="1px"
        borderWidth="1px"
        borderColor={color}
        backgroundColor="#1f1f1f"
        className="absolute inset-0"
      />
      {/* Fill */}
      <div className="absolute" style={fillStyle as React.CSSProperties}>
        <MaskedComponent
          shape="rounded"
          cornerRadius="1px"
          borderWidth="0px"
          borderColor="transparent"
          backgroundColor={color}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}

export function StatList({ side = "left", stats, className, orientation = "horizontal" }: StatListProps) {
  const isRight = side === "right";

  return (
    <div className={"flex justify-between gap-4 md:gap-6 lg:gap-8 divide-y divide-white/5 " + (className ?? "")}> 
      {stats.map((s) => (
        <div key={s.label} className={orientation === "vertical" ? "py-4 flex items-center justify-between gap-4" : "py-4 flex flex-col items-center gap-2"}>
          {orientation === "vertical" ? (
            !isRight ? (
              <>
                <div className="min-w-0">
                  <div className="text-[8px] lg:text-[10px] uppercase tracking-wide text-white/60">{s.label}</div>
                  <div className="text-[16px] lg:text-[20px] leading-none font-semibold text-white">{s.value}</div>
                </div>
                <IndicatorBar color={s.indicatorColor ?? "#22c55e"} percent={s.percentage ?? 100} height={48} />
              </>
            ) : (
              <>
                <IndicatorBar color={s.indicatorColor ?? "#22c55e"} percent={s.percentage ?? 100} height={48} />
                <div className="text-right min-w-0">
                  <div className="text-[8px] lg:text-[10px] uppercase tracking-wide text-white/60">{s.label}</div>
                  <div className="text-[16px] lg:text-[20px] leading-none font-semibold text-white">{s.value}</div>
                </div>
              </>
            )
          ) : (
            <>
              <IndicatorBar color={s.indicatorColor ?? "#22c55e"} percent={s.percentage ?? 100} height={64} width={10} orientation="horizontal" />
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-wide text-white/60">{s.label}</div>
                <div className="text-[20px] leading-none font-semibold text-white">{s.value}</div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
