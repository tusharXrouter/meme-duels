"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type TimerProps = {
  className?: string;
  onTimeUpdate?: (timeRemaining: string) => void;
};

export function Timer({ className, onTimeUpdate }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes in seconds
  const [isActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          const newTime = prevTime - 1;
          
          // When timer reaches 0, reset to 2 minutes
          if (newTime <= 0) {
            return 120; // Reset to 2 minutes
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeRemaining]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Notify parent component of time updates
  useEffect(() => {
    onTimeUpdate?.(formatTime(timeRemaining));
  }, [timeRemaining, onTimeUpdate]);

  // Toggle timer pause/resume
  // const toggleTimer = () => {
  //   setIsActive(!isActive);
  // };

  // Reset timer manually
  // const resetTimer = () => {
  //   setTimeRemaining(120);
  //   setIsActive(true);
  // };

  const formattedTime = formatTime(timeRemaining);

  return (
    <div className={cn("w-full text-center", className)}>
      <div
        className={cn(
          "text-white uppercase tracking-wider font-bold",
          "text-[28px] md:text-[32px] lg:text-[36px]",
          "mb-2"
        )}
      >
        {formattedTime}
      </div>
      
      {/* Timer Controls */}
      {/* <div className="flex items-center justify-center gap-3 text-sm">
        <button
          onClick={toggleTimer}
          className={cn(
            "px-3 py-1.5 rounded-md border transition-colors",
            isActive 
              ? "border-red-500/50 text-red-300 hover:border-red-400 hover:bg-red-500/10" 
              : "border-green-500/50 text-green-300 hover:border-green-400 hover:bg-green-500/10"
          )}
        >
          {isActive ? "⏸️ Pause" : "▶️ Resume"}
        </button>
        
        <button
          onClick={resetTimer}
          className="px-3 py-1.5 rounded-md border border-blue-500/50 text-blue-300 hover:border-blue-400 hover:bg-blue-500/10 transition-colors"
        >
          🔄 Reset
        </button>
      </div> */}
      
      {/* Timer Status */}
      <div className="mt-2 text-xs text-white/60">
        {isActive ? "⏰ Timer Running" : "⏸️ Timer Paused"}
      </div>
    </div>
  );
}
