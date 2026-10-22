"use client";

/**
 * apps/web/src/app/studio/invites/page.tsx
 * P6-04 — Invite management: create, list, revoke.
 */

import { apiDelete, apiGet, apiPost } from "@/lib/api";
import { useCallback, useEffect, useState } from "react";

type Invite = {
  id: string;
  label: string;
  relationship: string;
  project_id: string | null;
  expires_at: string;
  used: boolean;
  expired: boolean;
  created_at: string;
};

type CreateResult = {
  id: string;
  invite_url: string;
  label: string;
  relationship: string;
  expires_at: string;
  created_at: string;
};

const RELATIONSHIPS = ["mentor", "manager", "teammate", "professor", "client"] as const;

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

export default function InvitesPage() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [label, setLabel] = useState("");
  const [relationship, setRelationship] = useState<string>(RELATIONSHIPS[0]);
  const [expiryDays, setExpiryDays] = useState(14);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await apiGet<{ invites: Invite[] }>("/api/admin/invites");
      setInvites(data.invites);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;
    setCreating(true);
    setError(null);
    setNewUrl(null);
    try {
      const res = await apiPost<CreateResult>("/api/admin/invites", {
        label: label.trim(),
        relationship,
        expires_at: daysFromNow(expiryDays),
      });
      setNewUrl(res.invite_url);
      setLabel("");
      load();
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(id: string) {
    if (!confirm("Revoke this invite?")) return;
    try {
      await apiDelete(`/api/admin/invites/${id}`);
      load();
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  }

  return (
    <div>
      <h1 style={styles.pageTitle}>Invites</h1>

      {error && <Notice type="error">{error}</Notice>}

      {/* New invite URL banner */}
      {newUrl && (
        <div style={styles.urlBanner}>
          <span style={{ fontSize: "11px", color: "#888", display: "block", marginBottom: "6px" }}>
            ✓ Invite created — copy this URL now. It will not be shown again.
          </span>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <code style={{ flex: 1, fontSize: "12px", color: "#00d084", wordBreak: "break-all" }}>
              {newUrl}
            </code>
            <button
              type="button"
              style={styles.smallBtn}
              onClick={async () => {
                await navigator.clipboard.writeText(newUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}

      {/* Create form */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>New invite</h2>
        <form
          onSubmit={handleCreate}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <div style={styles.fieldRow}>
            <label style={styles.label} htmlFor="invite-label">
              Label
            </label>
            <input
              id="invite-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. John from SRM internship"
              maxLength={80}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.fieldRow}>
            <label style={styles.label} htmlFor="invite-rel">
              Relationship
            </label>
            <select
              id="invite-rel"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              style={styles.input}
            >
              {RELATIONSHIPS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.fieldRow}>
            <label style={styles.label} htmlFor="invite-expiry">
              Expires in
            </label>
            <select
              id="invite-expiry"
              value={expiryDays}
              onChange={(e) => setExpiryDays(Number(e.target.value))}
              style={styles.input}
            >
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
            </select>
          </div>
          <button type="submit" disabled={creating} style={styles.btn}>
            {creating ? "Creating…" : "Create invite →"}
          </button>
        </form>
      </section>

      {/* Invite list */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>All invites ({invites.length})</h2>
        {loading ? (
          <p style={styles.muted}>Loading…</p>
        ) : invites.length === 0 ? (
          <p style={styles.muted}>No invites yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                {["Label", "Relationship", "Status", "Expires", ""].map((h) => (
                  <th key={h} style={styles.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invites.map((inv) => (
                <tr key={inv.id} style={styles.tr}>
                  <td style={styles.td}>{inv.label}</td>
                  <td style={styles.td}>{inv.relationship}</td>
                  <td style={styles.td}>
                    <StatusBadge color={inv.used ? "#555" : inv.expired ? "#ff6b6b" : "#00d084"}>
                      {inv.used ? "used" : inv.expired ? "expired" : "open"}
                    </StatusBadge>
                  </td>
                  <td style={styles.td}>{new Date(inv.expires_at).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    {!inv.used && !inv.expired && (
                      <button
                        type="button"
                        style={styles.dangerBtn}
                        onClick={() => handleRevoke(inv.id)}
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

function StatusBadge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: "10px",
        fontFamily: "var(--font-jetbrains-mono, monospace)",
        color,
        border: `1px solid ${color}`,
        borderRadius: "2px",
        padding: "1px 6px",
      }}
    >
      {children}
    </span>
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

const styles = {
  pageTitle: {
    margin: "0 0 24px",
    fontSize: "22px",
    fontWeight: 700,
    color: "#f2f4f8",
    fontFamily: "var(--font-dm-sans, sans-serif)",
  },
  card: {
    background: "#0a0a0a",
    border: "1px solid #1a1a1a",
    borderRadius: "6px",
    padding: "24px",
    marginBottom: "20px",
  },
  sectionTitle: {
    margin: "0 0 16px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#888",
    fontFamily: "var(--font-jetbrains-mono, monospace)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
  },
  fieldRow: { display: "flex", flexDirection: "column" as const, gap: "4px" },
  label: { fontSize: "11px", color: "#555", fontFamily: "var(--font-jetbrains-mono, monospace)" },
  input: {
    padding: "8px 10px",
    background: "#050505",
    border: "1px solid #2a2a2a",
    borderRadius: "4px",
    color: "#f2f4f8",
    fontSize: "13px",
    fontFamily: "var(--font-jetbrains-mono, monospace)",
    outline: "none",
  },
  btn: {
    padding: "10px 16px",
    background: "#00d084",
    color: "#050505",
    border: "none",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: 700,
    fontFamily: "var(--font-jetbrains-mono, monospace)",
    cursor: "pointer",
  },
  smallBtn: {
    padding: "6px 12px",
    background: "transparent",
    border: "1px solid #00d084",
    color: "#00d084",
    borderRadius: "4px",
    fontSize: "11px",
    fontFamily: "var(--font-jetbrains-mono, monospace)",
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
  },
  dangerBtn: {
    padding: "4px 10px",
    background: "transparent",
    border: "1px solid rgba(255,60,60,0.4)",
    color: "#ff6b6b",
    borderRadius: "4px",
    fontSize: "11px",
    fontFamily: "var(--font-jetbrains-mono, monospace)",
    cursor: "pointer",
  },
  muted: {
    color: "#555",
    fontSize: "12px",
    fontFamily: "var(--font-jetbrains-mono, monospace)",
    margin: 0,
  },
  table: { width: "100%", borderCollapse: "collapse" as const },
  th: {
    textAlign: "left" as const,
    fontSize: "10px",
    color: "#444",
    fontFamily: "var(--font-jetbrains-mono, monospace)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    padding: "0 12px 10px 0",
    borderBottom: "1px solid #1a1a1a",
  },
  td: {
    padding: "10px 12px 10px 0",
    fontSize: "12px",
    color: "#888",
    fontFamily: "var(--font-jetbrains-mono, monospace)",
    borderBottom: "1px solid #111",
  },
  tr: {},
  urlBanner: {
    marginBottom: "20px",
    padding: "16px",
    background: "rgba(0,208,132,0.04)",
    border: "1px solid rgba(0,208,132,0.2)",
    borderRadius: "6px",
  },
};
