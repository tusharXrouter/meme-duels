"use client";

import React from "react";
import WarPage from "@/components/war/WarPage";

export default function WarSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);

  return <WarPage duelId={slug} />;
}
