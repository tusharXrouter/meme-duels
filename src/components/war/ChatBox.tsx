"use client";

import React from "react";

type ChatBoxProps = {
  title: string;
  placeholder: string;
};

export function ChatBox({ title, placeholder }: ChatBoxProps) {
  return (
    <div className="bg-[#111111] border border-white/10 rounded-xl p-3">
      <div className="text-right text-[11px] text-white/60 mb-2">{title}</div>
      <div className="h-40 overflow-y-auto rounded-md bg-black/50 border border-white/10 mb-2" />
      <input
        placeholder={placeholder}
        className="w-full h-10 px-3 rounded-md bg-black text-white border border-white/15 outline-none"
      />
    </div>
  );
}
