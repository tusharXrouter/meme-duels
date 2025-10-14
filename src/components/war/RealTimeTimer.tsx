import { useState, useEffect } from 'react';
import { websocketService } from '@/services/websocket.service';
import { EpochData } from '@/types';

interface RealTimeTimerProps {
  epoch: EpochData | null;
  className?: string;
}

export function RealTimeTimer({ epoch, className = '' }: RealTimeTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Real-time countdown timer - calculate based on epoch times with server-synced clock
  useEffect(() => {
    if (!epoch) {
      setTimeRemaining(0);
      return;
    }

    const updateTimer = () => {
      const now = websocketService.now();
      const bettingEnd = new Date(epoch.betting_end_time).getTime();
      const settlementEnd = new Date(epoch.settlement_end_time).getTime();
      
      let remaining = 0;
      
      // Calculate remaining time based on actual timestamps, not just status
      if (now < bettingEnd) {
        // Still in betting phase
        remaining = Math.max(0, bettingEnd - now);
      } else if (now < settlementEnd) {
        // In settling phase
        remaining = Math.max(0, settlementEnd - now);
      } else {
        // Settled
        remaining = 0;
      }
      
      setTimeRemaining(remaining);
    };

    // Update immediately
    updateTimer();
    
    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [epoch]);

  // Format time remaining
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get phase info
  const getPhaseInfo = () => {
    if (!epoch) return { label: 'Loading...', color: 'text-gray-500' };
    
    const now = websocketService.now();
    const bettingEnd = new Date(epoch.betting_end_time).getTime();
    const settlementEnd = new Date(epoch.settlement_end_time).getTime();
    
    // console.log('=================epoch.status===============', epoch.status, now, epoch.betting_end_time, bettingEnd, settlementEnd);
    // Add small buffer (5 seconds) to prevent timing race conditions
    const BUFFER_MS = 0;
    
    // Hybrid approach: Use backend status with timestamp validation
    if (epoch.status === 'betting' && now < (bettingEnd + BUFFER_MS)) {
      return { label: 'BETTING OPEN', color: 'text-green-500' };
    } else if (epoch.status === 'settling' || (now >= bettingEnd && now < (settlementEnd + BUFFER_MS))) {
      return { label: 'SETTLING', color: 'text-yellow-500' };
    } else if (epoch.status === 'settled' || now >= settlementEnd) {
      return { label: 'SETTLED', color: 'text-red-500' };
    } else {
      // Fallback to pure timestamp calculation
      if (now < bettingEnd) {
        return { label: 'BETTING OPEN', color: 'text-green-500' };
      } else if (now < settlementEnd) {
        return { label: 'SETTLING', color: 'text-yellow-500' };
      } else {
        return { label: 'SETTLED', color: 'text-gray-500' };
      }
    }
  };

  const phaseInfo = getPhaseInfo();

  return (
    <div className={`text-center ${className}`}>
      <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-wide">
        {phaseInfo.label}
      </div>
      <div className="mx-auto mt-2 sm:mt-3 inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-3 rounded-lg bg-white/5 px-3 sm:px-4 py-2 border border-white/10">
        <span className="text-white/60 text-xs sm:text-sm">Time Remaining:</span>
        <span className={`font-mono text-base sm:text-lg ${phaseInfo.color}`}>
          {timeRemaining > 0 ? formatTime(timeRemaining) : '00:00'}
        </span>
        {/* No extra 'Finalizing...' label; backend will settle and broadcast via WS */}
      </div>
    </div>
  );
}
