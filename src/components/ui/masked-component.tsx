"use client";

import { cn, fixedForwardRef } from "@/lib/utils";
import React, {
  type ForwardedRef,
  type CSSProperties,
  type ComponentPropsWithoutRef,
  type ElementType,
  type PropsWithChildren,
  type ReactNode,
} from "react";

// Predefined corner radius options
type DefaultCornerRadii = "2px" | "4px" | "7px" | "10px" | "13px" | "16px" | "20px";

// Mask shape types
type MaskShape = 
  | "octagon" 
  | "hexagon" 
  | "diamond" 
  | "triangle" 
  | "star" 
  | "circle" 
  | "rounded" 
  | "custom";

// Border width options
type BorderWidth = "0px" | "1px" | "2px" | "3px" | "4px" | "6px" | "8px";

// Polymorphic props type
type PolymorphicProps<E extends ElementType> = PropsWithChildren<
  ComponentPropsWithoutRef<E> & {
    as?: E;
  }
>;

type DefaultElement = "div";

export type MaskedComponentProps<T extends ElementType = DefaultElement> = PolymorphicProps<T> & {
  /** Border width around the mask */
  borderWidth?: BorderWidth;
  /** Corner radius for rounded masks */
  cornerRadius?: DefaultCornerRadii | (`${number}rem` & {}) | (`${number}px` & {});
  /** Shape of the mask */
  shape?: MaskShape;
  /** Custom clip-path for custom shapes */
  customClipPath?: string;
  /** Background color of the mask border */
  borderColor?: string;
  /** Background color of the content area */
  backgroundColor?: string;
  /** Additional class for the content wrapper */
  contentClass?: string;
  /** Element type for the content wrapper */
  contentAs?: ElementType;
  /** Whether to show a gradient border effect */
  gradientBorder?: boolean;
  /** Gradient colors for border (if gradientBorder is true) */
  gradientColors?: [string, string, string?];
  /** Animation duration for hover effects */
  animationDuration?: string;
  /** Whether to enable hover effects */
  hoverEffects?: boolean;
  children?: ReactNode;
};

// CSS for different mask shapes
const getMaskStyles = (shape: MaskShape, cornerRadius: string): CSSProperties => {
  const baseStyles: CSSProperties = {
    "--corner": cornerRadius,
  } as CSSProperties;

  // Helper function to convert corner radius to pixels
  const getCornerRadiusInPx = (radius: string): number => {
    if (radius.endsWith('px')) {
      return parseFloat(radius);
    } else if (radius.endsWith('rem')) {
      return parseFloat(radius) * 16; // Assuming 16px = 1rem
    }
    return parseFloat(radius);
  };

  // Helper function to generate clip path with pixel-based corners
  const generateClipPath = (shape: MaskShape, cornerRadiusPx: number): string => {
      const cornerPx = Math.min(cornerRadiusPx, 50); // Cap at 50px to avoid extreme shapes
      
      switch (shape) {
        case "octagon":
          return `polygon(${cornerPx}px 0px, calc(100% - ${cornerPx}px) 0px, 100% ${cornerPx}px, 100% calc(100% - ${cornerPx}px), calc(100% - ${cornerPx}px) 100%, ${cornerPx}px 100%, 0px calc(100% - ${cornerPx}px), 0px ${cornerPx}px)`;
        case "hexagon":
          return `polygon(${cornerPx}px 0px, calc(100% - ${cornerPx}px) 0px, 100% 50%, calc(100% - ${cornerPx}px) 100%, ${cornerPx}px 100%, 0px 50%)`;
        case "diamond":
          return `polygon(50% ${cornerPx}px, calc(100% - ${cornerPx}px) 50%, 50% calc(100% - ${cornerPx}px), ${cornerPx}px 50%)`;
        default:
          return "";
      }
  };

  const cornerRadiusPx = getCornerRadiusInPx(cornerRadius);

  switch (shape) {
    case "octagon":
      return {
        ...baseStyles,
        clipPath: generateClipPath("octagon", cornerRadiusPx),
      };
    case "hexagon":
      return {
        ...baseStyles,
        clipPath: generateClipPath("hexagon", cornerRadiusPx),
      };
    case "diamond":
      return {
        ...baseStyles,
        clipPath: generateClipPath("diamond", cornerRadiusPx),
      };
    case "triangle":
      return {
        ...baseStyles,
        clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
      };
    case "star":
      return {
        ...baseStyles,
        clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
      };
    case "circle":
      return {
        ...baseStyles,
        borderRadius: "50%",
      };
    case "rounded":
      return {
        ...baseStyles,
        borderRadius: `var(--corner)`,
      };
    case "custom":
      return baseStyles;
    default:
      return baseStyles;
  }
};

const MaskedComponent = fixedForwardRef(
  <E extends ElementType = DefaultElement>(
    {
      as,
      children,
      borderWidth = "2px",
      cornerRadius = "10px",
      shape = "rounded",
      customClipPath,
      borderColor = "transparent",
      backgroundColor = "transparent",
      contentClass,
      contentAs,
      gradientBorder = false,
      gradientColors = ["#ff6b6b", "#4ecdc4", "#45b7d1"],
      animationDuration = "0.3s",
      hoverEffects = true,
      ...props
    }: MaskedComponentProps<E>,
    ref?: ForwardedRef<HTMLElement | null>,
  ) => {
    const Component: ElementType = as ?? "div";
    const ContentComponent: ElementType = contentAs ?? "div";

    // Get mask styles
    const maskStyles = getMaskStyles(shape, cornerRadius);
    
    // Build gradient background if enabled
    const gradientBackground = gradientBorder 
      ? `linear-gradient(45deg, ${gradientColors.join(", ")})` 
      : borderColor;

    // For custom shapes, we need to apply the clip path to both outer and inner containers
    const outerClipPath = shape === "custom" && customClipPath ? customClipPath : maskStyles.clipPath;
    const innerClipPath = shape === "custom" && customClipPath ? customClipPath : 
                         (shape !== "rounded" && shape !== "circle" ? maskStyles.clipPath : undefined);

    return (
      <Component
        ref={ref}
        {...props}
        className={cn(
          "masked-component relative flex h-full w-full",
          hoverEffects && "transition-all duration-300",
          props.className
        )}
        style={
          {
            "--border-width": borderWidth,
            "--animation-duration": animationDuration,
            padding: `var(--border-width)`,
            background: gradientBackground,
            ...maskStyles,
            ...(outerClipPath && { clipPath: outerClipPath }),
            ...props.style,
          } as CSSProperties
        }
      >
        <ContentComponent 
          className={cn(
            "masked-content flex-1",
            "transition-all duration-300",
            contentClass
          )}
          style={{
            background: backgroundColor,
            ...(shape === "rounded" && { borderRadius: `calc(var(--corner) - var(--border-width))` }),
            ...(shape === "circle" && { borderRadius: "50%" }),
            ...(innerClipPath && { clipPath: innerClipPath }),
          }}
        >
          {children}
        </ContentComponent>
      </Component>
    );
  },
);

export default MaskedComponent;
