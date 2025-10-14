"use client";

import React from "react";
import MaskedComponent from "@/components/ui/masked-component";

// const CHIP_CLIP = "polygon(12% 18%, 30% 0, 100% 0, 100% 100%, 0 100%, 12% 80%)";

type ChipProps = {
  label: string;
  link: string;
};

type ActionChipsProps = {
  xLink: string;
  boostLink: string;
  tgLink: string;
};

function Chip({ label, link }: ChipProps) {
  return (
    <MaskedComponent
      shape="octagon"
      as={link ? "a" : "div"}
      borderWidth="1px"
      cornerRadius="5px"
      borderColor={link ? "#22d3ee" : "#09414a"}
      backgroundColor="#0b0b0b"
      className="h-8 w-8"
      contentClass={`h-full w-full flex items-center justify-center text-[10px] ${link ? "text-cyan-300" : `text-{#09414a}`}`}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </MaskedComponent>
  );
}


export function ActionChips({
  xLink,
  boostLink,
  tgLink,
}: ActionChipsProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <Chip label="X" link={xLink} />
      <Chip label="BOOST" link={boostLink} />
      <Chip label="TG" link={tgLink} />
    </div>
  );
}
