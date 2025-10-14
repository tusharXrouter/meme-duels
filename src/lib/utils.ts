import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import React from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * A fixed version of `React.forwardRef` that allows the `ref` to be typed as a generic.
 */
export function fixedForwardRef<T, P = object>(
  render: (props: P, ref: React.Ref<T>) => React.ReactNode,
): (props: P & React.RefAttributes<T | null>) => React.ReactNode {
  // @ts-expect-error: This is a known issue with React.forwardRef
   
  return React.forwardRef(render);
}