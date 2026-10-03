import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vishal Gastu // Digital Universe",
  description:
    "Creating what doesn't exist yet, and building it well enough to change what comes next.",
};

export default function HomePage() {
  return (
    <main
      id="main-content"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "1.5rem",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      {/* Signal dot — ghost light, luminous near-white glow */}
      <div
        aria-hidden="true"
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: "var(--signal)",
          boxShadow: "0 0 18px 6px rgba(242, 244, 248, 0.35)",
          animation: "pulse 3s ease-in-out infinite",
        }}
      />

      {/* Name — VISHAL GASTU in all-caps, dominant hero presence */}
      <h1
        style={{
          color: "var(--signal)",
          fontSize: "clamp(1.75rem, 6vw, 3.5rem)",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        Vishal Gastu
      </h1>

      {/* Tagline */}
      <p
        style={{
          color: "var(--text-1)",
          maxWidth: "46ch",
          fontSize: "1.0625rem",
          lineHeight: 1.65,
          letterSpacing: "0.01em",
        }}
      >
        Creating what doesn&apos;t exist yet, and building it well enough to
        change what comes next.
      </p>

      <p style={{ color: "var(--text-2)", fontSize: "0.8125rem", letterSpacing: "0.08em" }}>
        DIGITAL UNIVERSE — IN CONSTRUCTION
      </p>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 18px 6px rgba(242, 244, 248, 0.35); }
          50% { opacity: 0.55; transform: scale(0.82); box-shadow: 0 0 8px 2px rgba(242, 244, 248, 0.15); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes pulse { 0%, 100% { opacity: 1; } }
        }
      `}</style>
    </main>
  );
}
