"use client";

import { useView } from "@/contexts/ViewContext";

export function ViewToggle() {
  const { view, setView } = useView();

  return (
    <div className="flex bg-accent-dim/20 p-1 rounded-full text-sm font-mono border border-border">
      <button
        type="button"
        onClick={() => setView("professional")}
        className={`px-4 py-1.5 rounded-full transition-cinematic duration-300 ${
          view === "professional"
            ? "bg-foreground text-background font-bold shadow-sm"
            : "text-muted hover:text-foreground"
        }`}
        aria-pressed={view === "professional"}
      >
        Professional
      </button>
      <button
        type="button"
        onClick={() => setView("cinematic")}
        className={`px-4 py-1.5 rounded-full transition-cinematic duration-300 ${
          view === "cinematic"
            ? "bg-foreground text-background font-bold shadow-sm"
            : "text-muted hover:text-foreground"
        }`}
        aria-pressed={view === "cinematic"}
      >
        Cinematic
      </button>
    </div>
  );
}
