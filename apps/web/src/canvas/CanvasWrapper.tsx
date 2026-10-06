"use client";

import dynamic from "next/dynamic";

const CanvasRoot = dynamic(() => import("./CanvasRoot"), { ssr: false });

export function CanvasWrapper() {
  return <CanvasRoot />;
}
