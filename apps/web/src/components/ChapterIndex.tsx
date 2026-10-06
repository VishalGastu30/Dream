"use client";

import { useSceneStore } from "@/canvas/store/scene.store";
import { useView } from "@/contexts/ViewContext";

const CHAPTERS = ["Boot", "Journey", "Projects", "Galaxy", "Contact"];

export function ChapterIndex() {
  const { chapter, setChapter } = useSceneStore();
  const { view } = useView();

  if (view === "professional") return null;

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
      {CHAPTERS.map((title, i) => (
        <button
          key={title}
          type="button"
          onClick={() => setChapter(i)}
          className="group relative flex items-center justify-end"
          aria-label={`Go to ${title}`}
        >
          <span
            className={`absolute right-8 text-xs font-mono transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
              chapter === i ? "text-signal" : "text-text-2"
            }`}
          >
            {title}
          </span>
          <div
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              chapter === i
                ? "bg-signal shadow-[0_0_8px_rgba(110,231,249,0.8)] scale-125"
                : "bg-border hover:bg-text-2"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
