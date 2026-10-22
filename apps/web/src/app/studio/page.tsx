"use client";

/**
 * apps/web/src/app/studio/page.tsx
 * P6-03 — Studio dashboard.
 */

import { apiGet } from "@/lib/api";
import { useEffect, useState } from "react";

type Stats = {
  pending_testimonials: number;
  unread_messages: number;
  ai_requests_today: number;
};

export default function StudioDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<Stats>("/api/admin")
      .then(setStats)
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <div>
      <header style={{ marginBottom: "32px" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "22px",
            fontWeight: 700,
            color: "#f2f4f8",
            fontFamily: "var(--font-dm-sans, sans-serif)",
          }}
        >
          Dashboard
        </h1>
        <p
          style={{
            margin: "6px 0 0",
            fontSize: "12px",
            color: "#555",
            fontFamily: "var(--font-jetbrains-mono, monospace)",
          }}
        >
          Portfolio studio — owner view
        </p>
      </header>

      {error && <Notice type="error">{error}</Notice>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "40px",
        }}
      >
        <StatCard
          label="Pending testimonials"
          value={stats?.pending_testimonials ?? "—"}
          accent={stats?.pending_testimonials ? "#ffb347" : "#00d084"}
          href="/studio/testimonials"
        />
        <StatCard
          label="Unread messages"
          value={stats?.unread_messages ?? "—"}
          accent={stats?.unread_messages ? "#ffb347" : "#00d084"}
          href="/studio/inbox"
        />
        <StatCard
          label="AI requests today"
          value={stats?.ai_requests_today ?? "—"}
          accent="#5b8dee"
          href={null}
        />
      </div>

      <section>
        <h2
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#888",
            fontFamily: "var(--font-jetbrains-mono, monospace)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "12px",
          }}
        >
          Quick links
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { href: "/studio/invites", label: "Create a testimonial invite →" },
            { href: "/studio/testimonials", label: "Review pending testimonials →" },
            { href: "/studio/inbox", label: "Read contact messages →" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              style={{
                fontSize: "13px",
                color: "#00d084",
                fontFamily: "var(--font-jetbrains-mono, monospace)",
                textDecoration: "none",
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
  href,
}: {
  label: string;
  value: number | string;
  accent: string;
  href: string | null;
}) {
  const content = (
    <div
      style={{
        padding: "20px",
        background: "#0a0a0a",
        border: "1px solid #1a1a1a",
        borderRadius: "6px",
        cursor: href ? "pointer" : "default",
        transition: "border-color 0.15s",
      }}
      onMouseOver={(e) => {
        if (href) (e.currentTarget as HTMLElement).style.borderColor = accent;
      }}
      onFocus={(e) => {
        if (href) (e.currentTarget as HTMLElement).style.borderColor = accent;
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#1a1a1a";
      }}
      onBlur={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#1a1a1a";
      }}
    >
      <div
        style={{
          fontSize: "28px",
          fontWeight: 700,
          color: accent,
          fontFamily: "var(--font-jetbrains-mono, monospace)",
          lineHeight: 1,
          marginBottom: "8px",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "11px",
          color: "#555",
          fontFamily: "var(--font-jetbrains-mono, monospace)",
        }}
      >
        {label}
      </div>
    </div>
  );

  return href ? (
    <a href={href} style={{ textDecoration: "none" }}>
      {content}
    </a>
  ) : (
    content
  );
}

function Notice({
  type,
  children,
}: {
  type: "error" | "success";
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        marginBottom: "20px",
        padding: "12px",
        background: type === "error" ? "rgba(255,60,60,0.08)" : "rgba(0,208,132,0.08)",
        border: `1px solid ${type === "error" ? "rgba(255,60,60,0.2)" : "rgba(0,208,132,0.2)"}`,
        borderRadius: "4px",
        fontSize: "12px",
        color: type === "error" ? "#ff6b6b" : "#00d084",
        fontFamily: "var(--font-jetbrains-mono, monospace)",
      }}
    >
      {children}
    </div>
  );
}
