"use client";

/**
 * components/ChapterNav.tsx
 *
 * Minimal chapter navigation dots — visible only in cinematic mode.
 * Right edge of screen. Click to jump chapters.
 */

import { useSceneStore } from "@/canvas/store/scene.store";
import { useView } from "@/contexts/ViewContext";

const CHAPTERS = [
  { label: "Boot", targetProgress: 0 },
  { label: "Journey", targetProgress: 0.25 },
  { label: "Projects", targetProgress: 0.55 },
  { label: "Outro", targetProgress: 0.85 },
];

export function ChapterNav() {
  const { chapter, setChapter } = useSceneStore();
  const { view } = useView();

  if (view !== "cinematic") return null;

  const handleChapterClick = (index: number, targetProgress: number) => {
    setChapter(index);
    // Scroll to the corresponding progress position in the 500vh spacer
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: maxScroll * targetProgress, behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Cinematic chapters"
      style={{
        position: "fixed",
        right: "24px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      {CHAPTERS.map((ch, i) => (
        <button
          key={ch.label}
          type="button"
          onClick={() => handleChapterClick(i, ch.targetProgress)}
          aria-label={`Go to chapter: ${ch.label}`}
          aria-current={chapter === i ? "step" : undefined}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {/* Label (shown on hover) */}
          <span
            style={{
              position: "absolute",
              right: "18px",
              fontFamily: "var(--font-jetbrains-mono, monospace)",
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: chapter === i ? "#6EE7F9" : "#555",
              opacity: 0,
              whiteSpace: "nowrap",
              transition: "opacity 0.2s",
            }}
            className="chapter-nav-label"
          >
            {ch.label}
          </span>

          {/* Dot */}
          <span
            style={{
              width: chapter === i ? "10px" : "6px",
              height: chapter === i ? "10px" : "6px",
              borderRadius: "50%",
              background: chapter === i ? "#6EE7F9" : "#333",
              boxShadow: chapter === i ? "0 0 10px rgba(110,231,249,0.8)" : "none",
              transition: "all 0.3s ease",
              display: "block",
            }}
          />
        </button>
      ))}

      <style>{`
        button:hover .chapter-nav-label,
        button:focus .chapter-nav-label {
          opacity: 1 !important;
        }
      `}</style>
    </nav>
  );
}
