"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  className?: string;
  delayDuration?: number;
}

export const Tooltip = ({
  children,
  content,
  side = "bottom",
  align = "center",
  className,
  delayDuration = 100,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [showTimeoutId, setShowTimeoutId] = React.useState<NodeJS.Timeout | null>(null);
  const [hideTimeoutId, setHideTimeoutId] = React.useState<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    // Clear any pending hide timeout
    if (hideTimeoutId) {
      clearTimeout(hideTimeoutId);
      setHideTimeoutId(null);
    }
    
    // Clear any existing show timeout
    if (showTimeoutId) {
      clearTimeout(showTimeoutId);
    }
    
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delayDuration);
    setShowTimeoutId(id);
  };

  const hideTooltip = () => {
    // Clear any pending show timeout
    if (showTimeoutId) {
      clearTimeout(showTimeoutId);
      setShowTimeoutId(null);
    }
    
    // Clear any existing hide timeout
    if (hideTimeoutId) {
      clearTimeout(hideTimeoutId);
    }
    
    const id = setTimeout(() => {
      setIsVisible(false);
    }, 200); // 200ms delay before hiding
    setHideTimeoutId(id);
  };

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      if (showTimeoutId) {
        clearTimeout(showTimeoutId);
      }
      if (hideTimeoutId) {
        clearTimeout(hideTimeoutId);
      }
    };
  }, [showTimeoutId, hideTimeoutId]);

  const getPositionClasses = () => {
    const baseClasses = "absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg border border-gray-700";
    
    switch (side) {
      case "top":
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-2`;
      case "bottom":
        return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 mt-2`;
      case "left":
        return `${baseClasses} right-full top-1/2 transform -translate-y-1/2 mr-2`;
      case "right":
        return `${baseClasses} left-full top-1/2 transform -translate-y-1/2 ml-2`;
      default:
        return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 mt-2`;
    }
  };

  const getAlignClasses = () => {
    switch (align) {
      case "start":
        return side === "top" || side === "bottom" ? "left-0" : "top-0";
      case "end":
        return side === "top" || side === "bottom" ? "right-0" : "bottom-0";
      default:
        return "";
    }
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            getPositionClasses(),
            getAlignClasses(),
            "animate-in fade-in-0 zoom-in-95 duration-200",
            className
          )}
          role="tooltip"
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
        >
          {content}
          {/* Arrow */}
          <div
            className={cn(
              "absolute w-2 h-2 bg-gray-900 border border-gray-700 transform rotate-45",
              side === "top" && "top-full left-1/2 -translate-x-1/2 -translate-y-1/2 border-t-0 border-l-0",
              side === "bottom" && "bottom-full left-1/2 -translate-x-1/2 translate-y-1/2 border-b-0 border-r-0",
              side === "left" && "left-full top-1/2 -translate-y-1/2 -translate-x-1/2 border-l-0 border-b-0",
              side === "right" && "right-full top-1/2 -translate-y-1/2 translate-x-1/2 border-r-0 border-t-0"
            )}
          />
        </div>
      )}
    </div>
  );
};
