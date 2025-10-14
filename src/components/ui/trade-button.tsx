import * as React from "react"
import { cn } from "@/lib/utils"
import MaskedComponent from "./masked-component"

type TradeButtonProps = React.ComponentProps<"button"> & {
  side?: "right" | "left"
  color?: string
  label: string
}

function TradeButton({
  className,
  label,
  side = "left",
  color,
  ...props
}: TradeButtonProps) {
  const resolvedColor = color ?? (side === "right" ? "#00ff99" : "#ff4d4d")

  // Convert SVG polygon points to CSS clip-path format
  // Original points are in 100x40 viewBox, need to convert to percentages
  const rightClipPath = "polygon(84% 15%, 95% 15%, 100% 30%, 100% 100%, 80% 100%, 50% 100%, 11% 100%, 0 81%, 0 0, 76% 0)"
  
  const leftClipPath = "polygon(16% 15%, 5% 15%, 0 30%, 0 100%, 20% 100%, 50% 100%, 89% 100%, 100% 81%, 100% 0, 24% 0)"

  const clipPath = side === "right" ? rightClipPath : leftClipPath

  return (
    <MaskedComponent
      as="button"
      shape="custom"
      customClipPath={clipPath}
      borderWidth="2px"
      borderColor={resolvedColor}
      backgroundColor="#1f2937"
      hoverEffects={true}
      className={cn(
        "items-center justify-center font-semibold tracking-wide disabled:pointer-events-none disabled:opacity-50 select-none hover:cursor-pointer",
        "h-6 w-26 lg:h-14 lg:w-56",
        "text-xs md:text-sm lg:text-base",
        className
      )}
      contentClass="relative flex items-center justify-center bg-blue-200 h-full w-full"
      {...props}
    >
      {/* Hover overlay fill at 20% */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-150 pointer-events-none group-hover:opacity-20"
        style={{ backgroundColor: resolvedColor }}
      />

      <span
        className="relative z-10"
        style={{ color: resolvedColor }}
      >
        {label}
      </span>
    </MaskedComponent>
  )
}

export { TradeButton }
