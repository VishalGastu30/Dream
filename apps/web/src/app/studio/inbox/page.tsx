"use client";

/**
 * apps/web/src/app/studio/inbox/page.tsx
 * P6-08 — Contact message inbox: read, mark read, delete.
 */

import { apiDelete, apiGet, apiPatch } from "@/lib/api";
import { useCallback, useEffect, useState } from "react";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: number; // 0 or 1
  created_at: string;
};

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await apiGet<{ messages: Message[] }>("/api/admin/contact");
      setMessages(data.messages);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleMarkRead(id: string) {
    try {
      await apiPatch(`/api/admin/contact/${id}`, {});
      load();
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    try {
      await apiDelete(`/api/admin/contact/${id}`);
      if (expanded === id) setExpanded(null);
      load();
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  }

  const unread = messages.filter((m) => !m.read);
  const read = messages.filter((m) => m.read);

  return (
    <div>
      <h1 style={S.pageTitle}>Inbox</h1>
      {error && <Notice type="error">{error}</Notice>}

      {loading ? (
        <p style={S.muted}>Loading…</p>
      ) : messages.length === 0 ? (
        <p style={S.muted}>No messages yet.</p>
      ) : (
        <>
          {unread.length > 0 && (
            <Section title={`Unread (${unread.length})`} accent="#ffb347">
              {unread.map((m) => (
                <MessageRow
                  key={m.id}
                  m={m}
                  open={expanded === m.id}
                  onToggle={() => {
                    setExpanded(expanded === m.id ? null : m.id);
                    if (!m.read) handleMarkRead(m.id);
                  }}
                  onDelete={() => handleDelete(m.id)}
                />
              ))}
            </Section>
          )}
          {read.length > 0 && (
            <Section title={`Read (${read.length})`} accent="#333">
              {read.map((m) => (
                <MessageRow
                  key={m.id}
                  m={m}
                  open={expanded === m.id}
                  onToggle={() => setExpanded(expanded === m.id ? null : m.id)}
                  onDelete={() => handleDelete(m.id)}
                />
              ))}
            </Section>
          )}
        </>
      )}
    </div>
  );
}

function Section({
  title,
  accent,
  children,
}: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "32px" }}>
      <h2 style={{ ...S.sectionTitle, color: accent }}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>{children}</div>
    </section>
  );
}

function MessageRow({
  m,
  open,
  onToggle,
  onDelete,
}: {
  m: Message;
  open: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div style={{ ...S.card, borderColor: !m.read ? "#2a1a00" : "#1a1a1a" }}>
      <button
        type="button"
        onClick={onToggle}
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          gap: "16px",
          textAlign: "left",
        }}
      >
        <div>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: m.read ? "#666" : "#f2f4f8",
              fontFamily: "var(--font-dm-sans, sans-serif)",
            }}
          >
            {m.name}
          </span>
          <span
            style={{
              fontSize: "12px",
              color: "#444",
              fontFamily: "var(--font-jetbrains-mono, monospace)",
              marginLeft: "10px",
            }}
          >
            {m.email}
          </span>
        </div>
        <span
          style={{
            fontSize: "11px",
            color: "#333",
            fontFamily: "var(--font-jetbrains-mono, monospace)",
            whiteSpace: "nowrap",
          }}
        >
          {new Date(m.created_at).toLocaleDateString()} {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #1a1a1a" }}>
          <p
            style={{
              margin: "0 0 12px",
              fontSize: "13px",
              color: "#aaa",
              fontFamily: "var(--font-dm-sans, sans-serif)",
              lineHeight: 1.6,
            }}
          >
            {m.message}
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <a
              href={`mailto:${m.email}`}
              style={{
                padding: "6px 12px",
                background: "rgba(0,208,132,0.1)",
                color: "#00d084",
                border: "1px solid rgba(0,208,132,0.3)",
                borderRadius: "4px",
                fontSize: "11px",
                fontFamily: "var(--font-jetbrains-mono, monospace)",
                textDecoration: "none",
              }}
            >
              Reply ↗
            </a>
            <button type="button" style={S.deleteBtn} onClick={onDelete}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Notice({ type, children }: { type: "error" | "success"; children: React.ReactNode }) {
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

const S = {
  pageTitle: {
    margin: "0 0 24px",
    fontSize: "22px",
    fontWeight: 700,
    color: "#f2f4f8",
    fontFamily: "var(--font-dm-sans, sans-serif)",
  },
  sectionTitle: {
    margin: "0 0 12px",
    fontSize: "12px",
    fontWeight: 600,
    fontFamily: "var(--font-jetbrains-mono, monospace)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
  },
  card: {
    background: "#0a0a0a",
    border: "1px solid #1a1a1a",
    borderRadius: "6px",
    padding: "14px 16px",
  },
  muted: {
    color: "#555",
    fontSize: "12px",
    fontFamily: "var(--font-jetbrains-mono, monospace)",
    margin: 0,
  },
  deleteBtn: {
    padding: "6px 12px",
    background: "transparent",
    color: "#333",
    border: "1px solid #1a1a1a",
    borderRadius: "4px",
    fontSize: "11px",
    fontFamily: "var(--font-jetbrains-mono, monospace)",
    cursor: "pointer",
  },
};
