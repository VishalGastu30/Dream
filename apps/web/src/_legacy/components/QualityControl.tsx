"use client";

import { type QualityMode, useSceneStore } from "@/canvas/store/scene.store";
import { useView } from "@/contexts/ViewContext";

export function QualityControl() {
  const { quality, setQuality } = useSceneStore();
  const { view } = useView();

  // Hide in professional view if we want to keep it minimal,
  // or maybe we show it only when in cinematic view?
  if (view === "professional") return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-bg-1/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-border text-xs font-mono text-text-2">
      <span className="hidden sm:inline-block">Quality:</span>
      {(["auto", "high", "low"] as QualityMode[]).map((q) => (
        <button
          key={q}
          type="button"
          onClick={() => setQuality(q)}
          className={`px-2 py-1 rounded transition-colors ${
            quality === q ? "bg-signal/20 text-signal" : "hover:text-text-0"
          }`}
          aria-pressed={quality === q}
        >
          {q.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
