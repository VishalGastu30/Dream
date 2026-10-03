import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Signal Lost",
  description: "This coordinate doesn't exist.",
  robots: { index: false },
};

export default function NotFound() {
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
      <p
        style={{
          color: "var(--text-2)",
          fontSize: "0.75rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        ERROR 404
      </p>

      <h1
        style={{
          color: "var(--signal)",
          fontSize: "clamp(2rem, 8vw, 5rem)",
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        Signal lost.
      </h1>

      <p style={{ color: "var(--text-1)", maxWidth: "36ch" }}>
        This coordinate doesn&apos;t exist in the universe.
      </p>

      <Link
        href="/"
        style={{
          color: "var(--signal)",
          textDecoration: "none",
          fontSize: "0.9rem",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-s)",
          padding: "0.5rem 1.25rem",
          transition: "border-color 300ms var(--ease-out)",
        }}
      >
        ← Return to base
      </Link>
    </main>
  );
}
