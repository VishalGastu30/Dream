"use client";

import { useSceneStore } from "@/canvas/store/scene.store";
import { useView } from "@/contexts/ViewContext";

export function SkipIntro() {
  const { isIntro, setIsIntro, setChapter } = useSceneStore();
  const { view } = useView();

  // Hide in professional view or if intro is already skipped
  if (view === "professional" || !isIntro) return null;

  const handleSkip = () => {
    setIsIntro(false);
    setChapter(1);
    // Add logic later to smoothly scroll to chapter 1 if necessary
  };

  return (
    <button
      type="button"
      onClick={handleSkip}
      className="fixed bottom-4 right-4 z-50 bg-bg-1/80 backdrop-blur-md px-4 py-2 rounded-full border border-border text-sm font-mono text-text-1 hover:text-text-0 hover:border-signal/50 transition-colors"
      aria-label="Skip introduction"
    >
      Skip ↓
    </button>
  );
}
