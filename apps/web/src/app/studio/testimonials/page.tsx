"use client";

/**
 * apps/web/src/app/studio/testimonials/page.tsx
 * P6-06 — Testimonial moderation: approve, edit, reject, delete.
 */

import { apiDelete, apiGet, apiPatch } from "@/lib/api";
import { useCallback, useEffect, useState } from "react";

type Testimonial = {
  id: string;
  name: string;
  designation: string;
  company: string;
  relationship: string;
  message: string;
  project_id: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  approved_at: string | null;
  invite_label: string | null;
};

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await apiGet<{ testimonials: Testimonial[] }>("/api/admin/testimonials");
      setItems(data.testimonials);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleStatus(id: string, status: "approved" | "rejected") {
    try {
      await apiPatch(`/api/admin/testimonials/${id}`, { status });
      load();
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Permanently delete this testimonial?")) return;
    try {
      await apiDelete(`/api/admin/testimonials/${id}`);
      load();
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  }

  async function handleEdit(id: string) {
    if (!editText.trim()) return;
    try {
      await apiPatch(`/api/admin/testimonials/${id}`, { message: editText.trim() });
      setEditingId(null);
      setEditText("");
      load();
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  }

  const pending = items.filter((t) => t.status === "pending");
  const approved = items.filter((t) => t.status === "approved");
  const rejected = items.filter((t) => t.status === "rejected");

  return (
    <div>
      <h1 style={S.pageTitle}>Testimonials</h1>
      {error && <Notice type="error">{error}</Notice>}

      {loading ? (
        <p style={S.muted}>Loading…</p>
      ) : items.length === 0 ? (
        <p style={S.muted}>No testimonials yet. Create an invite to collect one.</p>
      ) : (
        <>
          {pending.length > 0 && (
            <Section title={`Pending review (${pending.length})`} accent="#ffb347">
              {pending.map((t) => (
                <TestimonialCard
                  key={t.id}
                  t={t}
                  editing={editingId === t.id}
                  editText={editText}
                  onEdit={() => {
                    setEditingId(t.id);
                    setEditText(t.message);
                  }}
                  onEditChange={setEditText}
                  onEditSave={() => handleEdit(t.id)}
                  onEditCancel={() => {
                    setEditingId(null);
                    setEditText("");
                  }}
                  onApprove={() => handleStatus(t.id, "approved")}
                  onReject={() => handleStatus(t.id, "rejected")}
                  onDelete={() => handleDelete(t.id)}
                />
              ))}
            </Section>
          )}
          {approved.length > 0 && (
            <Section title={`Approved (${approved.length})`} accent="#00d084">
              {approved.map((t) => (
                <TestimonialCard
                  key={t.id}
                  t={t}
                  editing={editingId === t.id}
                  editText={editText}
                  onEdit={() => {
                    setEditingId(t.id);
                    setEditText(t.message);
                  }}
                  onEditChange={setEditText}
                  onEditSave={() => handleEdit(t.id)}
                  onEditCancel={() => {
                    setEditingId(null);
                    setEditText("");
                  }}
                  onApprove={() => handleStatus(t.id, "approved")}
                  onReject={() => handleStatus(t.id, "rejected")}
                  onDelete={() => handleDelete(t.id)}
                />
              ))}
            </Section>
          )}
          {rejected.length > 0 && (
            <Section title={`Rejected (${rejected.length})`} accent="#555">
              {rejected.map((t) => (
                <TestimonialCard
                  key={t.id}
                  t={t}
                  editing={editingId === t.id}
                  editText={editText}
                  onEdit={() => {
                    setEditingId(t.id);
                    setEditText(t.message);
                  }}
                  onEditChange={setEditText}
                  onEditSave={() => handleEdit(t.id)}
                  onEditCancel={() => {
                    setEditingId(null);
                    setEditText("");
                  }}
                  onApprove={() => handleStatus(t.id, "approved")}
                  onReject={() => handleStatus(t.id, "rejected")}
                  onDelete={() => handleDelete(t.id)}
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
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>{children}</div>
    </section>
  );
}

function TestimonialCard({
  t,
  editing,
  editText,
  onEdit,
  onEditChange,
  onEditSave,
  onEditCancel,
  onApprove,
  onReject,
  onDelete,
}: {
  t: Testimonial;
  editing: boolean;
  editText: string;
  onEdit: () => void;
  onEditChange: (v: string) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
}) {
  return (
    <div style={S.card}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "16px",
          marginBottom: "12px",
        }}
      >
        <div>
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#f2f4f8",
              fontFamily: "var(--font-dm-sans, sans-serif)",
            }}
          >
            {t.name}
          </span>
          <span
            style={{
              fontSize: "12px",
              color: "#555",
              fontFamily: "var(--font-jetbrains-mono, monospace)",
              marginLeft: "10px",
            }}
          >
            {t.designation} @ {t.company}
          </span>
          <span
            style={{
              fontSize: "11px",
              color: "#333",
              fontFamily: "var(--font-jetbrains-mono, monospace)",
              marginLeft: "10px",
            }}
          >
            via: {t.invite_label ?? t.relationship}
          </span>
        </div>
        <span
          style={{
            fontSize: "11px",
            color: "#444",
            fontFamily: "var(--font-jetbrains-mono, monospace)",
            whiteSpace: "nowrap",
          }}
        >
          {new Date(t.created_at).toLocaleDateString()}
        </span>
      </div>

      {editing ? (
        <div>
          <textarea
            value={editText}
            onChange={(e) => onEditChange(e.target.value)}
            maxLength={1200}
            rows={4}
            style={{ ...S.input, width: "100%", resize: "vertical", marginBottom: "8px" }}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <button type="button" style={S.btn} onClick={onEditSave}>
              Save
            </button>
            <button type="button" style={S.ghostBtn} onClick={onEditCancel}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <blockquote
          style={{
            margin: "0 0 12px",
            fontSize: "13px",
            color: "#aaa",
            fontFamily: "var(--font-dm-sans, sans-serif)",
            lineHeight: 1.6,
            borderLeft: "2px solid #1a1a1a",
            paddingLeft: "12px",
          }}
        >
          "{t.message}"
        </blockquote>
      )}

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {t.status !== "approved" && (
          <button type="button" style={S.approveBtn} onClick={onApprove}>
            ✓ Approve
          </button>
        )}
        {t.status !== "rejected" && (
          <button type="button" style={S.rejectBtn} onClick={onReject}>
            ✕ Reject
          </button>
        )}
        {!editing && (
          <button type="button" style={S.ghostBtn} onClick={onEdit}>
            Edit text
          </button>
        )}
        <button type="button" style={S.deleteBtn} onClick={onDelete}>
          Delete
        </button>
      </div>
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
    padding: "16px",
  },
  muted: {
    color: "#555",
    fontSize: "12px",
    fontFamily: "var(--font-jetbrains-mono, monospace)",
    margin: 0,
  },
  input: {
    padding: "8px 10px",
    background: "#050505",
    border: "1px solid #2a2a2a",
    borderRadius: "4px",
    color: "#f2f4f8",
    fontSize: "13px",
    fontFamily: "var(--font-jetbrains-mono, monospace)",
    outline: "none",
    boxSizing: "border-box" as const,
  },
  btn: {
    padding: "6px 12px",
    background: "#00d084",
    color: "#050505",
    border: "none",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: 700,
    fontFamily: "var(--font-jetbrains-mono, monospace)",
    cursor: "pointer",
  },
  approveBtn: {
    padding: "6px 12px",
    background: "rgba(0,208,132,0.1)",
    color: "#00d084",
    border: "1px solid rgba(0,208,132,0.3)",
    borderRadius: "4px",
    fontSize: "11px",
    fontFamily: "var(--font-jetbrains-mono, monospace)",
    cursor: "pointer",
  },
  rejectBtn: {
    padding: "6px 12px",
    background: "rgba(255,107,107,0.1)",
    color: "#ff6b6b",
    border: "1px solid rgba(255,107,107,0.3)",
    borderRadius: "4px",
    fontSize: "11px",
    fontFamily: "var(--font-jetbrains-mono, monospace)",
    cursor: "pointer",
  },
  ghostBtn: {
    padding: "6px 12px",
    background: "transparent",
    color: "#555",
    border: "1px solid #2a2a2a",
    borderRadius: "4px",
    fontSize: "11px",
    fontFamily: "var(--font-jetbrains-mono, monospace)",
    cursor: "pointer",
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
