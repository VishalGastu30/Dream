"use client";

/**
 * components/BootScreen.tsx
 *
 * Fullscreen CSS boot sequence — the FIRST thing a visitor sees.
 * Pure HTML/CSS — zero Three.js dependency. Loads instantly.
 *
 * Shown once per browser session (sessionStorage).
 * Session = dismissed on tab close. Returns on next visit.
 *
 * Animation timeline (total ~2200ms before buttons appear):
 *   0ms    → Dark void
 *   150ms  → CSS orb scales in with glow
 *   700ms  → "VISHAL GASTU" typewriters in (80ms/char)
 *   1400ms → Sub-title fades in
 *   1700ms → Keyword drift starts
 *   2200ms → Entry buttons fade in
 */

import { useView } from "@/contexts/ViewContext";
import careerData from "@/data/career.json";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "dream-booted";

// Subset of keywords for the boot drift — not all of them
const BOOT_KEYWORDS = [
  "Python",
  "TypeScript",
  "Go",
  "React",
  "Next.js",
  "AI Engineer",
  "ML",
  "LLM",
  "PyTorch",
  "PostgreSQL",
  "Three.js",
  "Docker",
  "Rust",
  "Backend",
  "Full Stack",
  "GRPO",
  "QLoRA",
  "WebGL",
  "API",
  "SRM '27",
];

type BootPhase = "hidden" | "orb" | "name" | "subtitle" | "keywords" | "buttons" | "done";

export function BootScreen() {
  const { setView } = useView();
  const [phase, setPhase] = useState<BootPhase>("hidden");
  const [typedChars, setTypedChars] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const NAME = careerData.profile.displayName; // "VISHAL GASTU"

  useEffect(() => {
    // Check if already booted this session
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(STORAGE_KEY)) {
      return; // Skip boot screen — user has already seen it
    }
    setVisible(true);

    // Animation timeline
    const timers = [
      setTimeout(() => setPhase("orb"), 150),
      setTimeout(() => setPhase("name"), 700),
      setTimeout(() => setPhase("subtitle"), 1400),
      setTimeout(() => setPhase("keywords"), 1700),
      setTimeout(() => setPhase("buttons"), 2200),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (phase !== "name") return;
    setTypedChars(0);
    intervalRef.current = setInterval(() => {
      setTypedChars((n) => {
        if (n >= NAME.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return n;
        }
        return n + 1;
      });
    }, 75);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase, NAME.length]);

  const handleEnterCinematic = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setView("cinematic");
    // Fade out boot screen
    setPhase("done");
    setTimeout(() => setVisible(false), 600);
  };

  const handleSkip = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setView("professional");
    setPhase("done");
    setTimeout(() => setVisible(false), 600);
  };

  if (!visible) return null;

  const isDone = phase === "done";
  const showOrb = ["orb", "name", "subtitle", "keywords", "buttons", "done"].includes(phase);
  const showName = ["name", "subtitle", "keywords", "buttons", "done"].includes(phase);
  const showSubtitle = ["subtitle", "keywords", "buttons", "done"].includes(phase);
  const showKeywords = ["keywords", "buttons", "done"].includes(phase);
  const showButtons = ["buttons", "done"].includes(phase);

  return (
    <dialog
      open
      aria-label="Welcome — choose your experience"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        background: "#050505",
        border: "none",
        margin: 0,
        padding: 0,
        width: "100%",
        height: "100%",
        maxWidth: "none",
        maxHeight: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        opacity: isDone ? 0 : 1,
        transition: "opacity 0.6s ease",
        pointerEvents: isDone ? "none" : "auto",
      }}
    >
      {/* Floating keywords — background layer */}
      {showKeywords &&
        BOOT_KEYWORDS.map((word, i) => (
          <span
            key={word}
            aria-hidden="true"
            style={{
              position: "absolute",
              left: `${5 + ((i * 19.3) % 90)}%`,
              top: `${110 + ((i * 7.7) % 50)}%`,
              fontSize: `${11 + (i % 4) * 2}px`,
              color: "#6EE7F9",
              opacity: 0.06 + (i % 5) * 0.02,
              fontFamily: "var(--font-jetbrains-mono, monospace)",
              fontWeight: 400,
              letterSpacing: "0.05em",
              animation: `bootDrift ${8 + (i % 5) * 2}s linear ${(i * 0.3) % 3}s infinite`,
              whiteSpace: "nowrap",
            }}
          >
            {word}
          </span>
        ))}

      {/* Central content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "32px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* CSS Orb */}
        <div
          aria-hidden="true"
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 40% 40%, #ffffff 0%, #6EE7F9 45%, transparent 75%)",
            boxShadow: showOrb
              ? "0 0 40px 20px rgba(110,231,249,0.55), 0 0 100px 50px rgba(110,231,249,0.25), 0 0 250px 120px rgba(110,231,249,0.08)"
              : "none",
            opacity: showOrb ? 1 : 0,
            transform: showOrb ? "scale(1)" : "scale(0.1)",
            transition:
              "opacity 0.6s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1), box-shadow 0.8s ease",
            animation: showOrb ? "bootOrbPulse 2.5s ease-in-out infinite" : "none",
          }}
        />

        {/* Name */}
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "var(--font-dm-sans, sans-serif)",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 700,
              color: "#f2f4f8",
              letterSpacing: "0.15em",
              margin: 0,
              opacity: showName ? 1 : 0,
              transition: "opacity 0.4s ease",
              minHeight: "1.2em",
            }}
          >
            {NAME.slice(0, typedChars)}
            {showName && typedChars < NAME.length && (
              <span
                style={{
                  display: "inline-block",
                  width: "3px",
                  height: "0.85em",
                  background: "#6EE7F9",
                  marginLeft: "4px",
                  verticalAlign: "text-bottom",
                  animation: "bootCursorBlink 0.8s step-end infinite",
                }}
                aria-hidden="true"
              />
            )}
          </h1>

          {/* Sub-title */}
          <p
            style={{
              fontFamily: "var(--font-jetbrains-mono, monospace)",
              fontSize: "clamp(0.65rem, 1.5vw, 0.85rem)",
              color: "#6EE7F9",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              margin: "10px 0 0",
              opacity: showSubtitle ? 1 : 0,
              transform: showSubtitle ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
            }}
          >
            {careerData.profile.title}&nbsp;·&nbsp;SRM&nbsp;'27
          </p>
        </div>

        {/* Status line */}
        {showSubtitle && (
          <p
            style={{
              fontFamily: "var(--font-jetbrains-mono, monospace)",
              fontSize: "0.7rem",
              color: "rgba(110,231,249,0.5)",
              letterSpacing: "0.2em",
              margin: 0,
              animation: "bootStatusPulse 3s ease-in-out infinite",
            }}
            aria-live="polite"
          >
            SYSTEM ONLINE. AWAITING INPUT.
          </p>
        )}

        {/* Entry buttons */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "center",
            opacity: showButtons ? 1 : 0,
            transform: showButtons ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
            pointerEvents: showButtons ? "auto" : "none",
          }}
        >
          <button
            type="button"
            id="boot-enter-cinematic"
            onClick={handleEnterCinematic}
            style={{
              padding: "14px 32px",
              border: "1.5px solid #6EE7F9",
              color: "#6EE7F9",
              background: "transparent",
              fontFamily: "var(--font-jetbrains-mono, monospace)",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(110,231,249,0.12)";
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(110,231,249,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            Enter Cinematic
          </button>
          <button
            type="button"
            id="boot-skip-professional"
            onClick={handleSkip}
            style={{
              padding: "14px 32px",
              border: "1.5px solid rgba(242,244,248,0.2)",
              color: "rgba(242,244,248,0.6)",
              background: "transparent",
              fontFamily: "var(--font-jetbrains-mono, monospace)",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#f2f4f8";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(242,244,248,0.5)";
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#f2f4f8";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(242,244,248,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(242,244,248,0.6)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(242,244,248,0.2)";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(242,244,248,0.6)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(242,244,248,0.2)";
            }}
          >
            Skip → Professional
          </button>
        </div>
      </div>
    </dialog>
  );
}
