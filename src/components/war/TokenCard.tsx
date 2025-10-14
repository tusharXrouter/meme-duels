"use client";

import React from "react";
import MaskedComponent from "@/components/ui/masked-component";

type TokenCardProps = {
  title: string;
  description: string;
  image: React.ReactNode;
  contract: string;
  imageSide?: "left" | "right";
};

export function TokenCard({ title, description, image, contract, imageSide = "left" }: TokenCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
      {imageSide === "right" && (
        <MaskedComponent
          shape="octagon"
          borderWidth="2px"
          borderColor="#3f3f46"
          backgroundColor="#111111"
          className="h-40 w-full"
          contentClass="h-full w-full flex items-center justify-center"
        >
          {image}
        </MaskedComponent>
      )}

      <div className="text-[13px] text-white/80 max-w-[480px]">
        <div className="mb-2 text-white/70 uppercase tracking-wide text-[12px]">{title}</div>
        <p className="leading-relaxed">{description}</p>
        <div className="mt-3 text-[12px] font-mono text-white/60">Contract Address - {contract}</div>
      </div>

      {imageSide === "left" && (
        <MaskedComponent
          shape="octagon"
          borderWidth="3px"
          borderColor="#3f3f46"
          backgroundColor="#111111"
          className="h-40 w-full"
          contentClass="h-full w-full flex items-center justify-center"
        >
          {image}
        </MaskedComponent>
      )}
    </div>
  );
}
