"use client";

/**
 * apps/web/src/app/t/page.tsx
 * P6-05 — Testimonial submission page.
 * URL format: /t?token=<rawToken>
 *
 * With `output: "export"`, useSearchParams must live inside a <Suspense> boundary.
 * The outer page component provides the Suspense shell; the inner one reads params.
 */

import { apiFetch } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const RELATIONSHIPS = [
  { value: "mentor", label: "Mentor" },
  { value: "manager", label: "Manager" },
  { value: "teammate", label: "Teammate" },
  { value: "professor", label: "Professor" },
  { value: "client", label: "Client" },
];

type State = "idle" | "submitting" | "success" | "error" | "invalid";

// ─── Outer page — Suspense shell ─────────────────────────────────────────────
export default function TestimonialPage() {
  return (
    <Suspense
      fallback={
        <Shell>
          <div style={S.centeredBox}>
            <p style={S.subtitle}>Loading…</p>
          </div>
        </Shell>
      }
    >
      <TestimonialForm />
    </Suspense>
  );
}

// ─── Inner component — reads searchParams ────────────────────────────────────
function TestimonialForm() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [state, setState] = useState<State>(token ? "idle" : "invalid");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Form fields
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [company, setCompany] = useState("");
  const [relationship, setRelationship] = useState("teammate");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    if (!token) setState("invalid");
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) return;
    setState("submitting");
    setErrorMsg("");

    try {
      const res = await apiFetch("/api/testimonials", {
        method: "POST",
        body: JSON.stringify({
          token,
          name: name.trim(),
          designation: designation.trim(),
          company: company.trim(),
          relationship,
          message: message.trim(),
          consent: true,
        }),
      });

      if (res.ok) {
        setState("success");
      } else {
        const data = (await res.json()) as { error?: string };
        setErrorMsg(data.error ?? "Submission failed. Please try again.");
        setState("error");
      }
    } catch {
      setErrorMsg("Could not connect. Please check your connection and try again.");
      setState("error");
    }
  }

  if (state === "invalid") {
    return (
      <Shell>
        <div style={S.centeredBox}>
          <div style={S.icon}>🔗</div>
          <h1 style={S.title}>Invalid invite link</h1>
          <p style={S.subtitle}>
            This link is missing a token. Please use the full invite link you received.
          </p>
        </div>
      </Shell>
    );
  }

  if (state === "success") {
    return (
      <Shell>
        <div style={S.centeredBox}>
          <div style={{ ...S.icon, color: "#00d084" }}>✓</div>
          <h1 style={S.title}>Thank you!</h1>
          <p style={S.subtitle}>
            Your testimonial has been submitted and is pending review. I really appreciate you
            taking the time.
          </p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div style={S.formWrap}>
        <header style={{ marginBottom: "32px" }}>
          <div style={S.label}>You were invited to share</div>
          <h1 style={S.title}>Leave a testimonial</h1>
          <p style={S.subtitle}>
            Your words will appear on my portfolio (after review). This link can only be used once.
          </p>
        </header>

        {state === "error" && <div style={S.errorBox}>{errorMsg}</div>}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {/* Honeypot — hidden from real users */}
          <input
            type="text"
            name="website"
            style={{ display: "none" }}
            tabIndex={-1}
            aria-hidden="true"
          />

          <div style={S.fieldRow}>
            <label style={S.fieldLabel} htmlFor="t-name">
              Your name *
            </label>
            <input
              id="t-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              maxLength={80}
              required
              style={S.input}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={S.fieldRow}>
              <label style={S.fieldLabel} htmlFor="t-designation">
                Title / Role *
              </label>
              <input
                id="t-designation"
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Senior Engineer"
                maxLength={100}
                required
                style={S.input}
              />
            </div>
            <div style={S.fieldRow}>
              <label style={S.fieldLabel} htmlFor="t-company">
                Company / Institution *
              </label>
              <input
                id="t-company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. SRM Institute"
                maxLength={100}
                required
                style={S.input}
              />
            </div>
          </div>

          <div style={S.fieldRow}>
            <label style={S.fieldLabel} htmlFor="t-relationship">
              Your relationship *
            </label>
            <select
              id="t-relationship"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              style={S.input}
            >
              {RELATIONSHIPS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div style={S.fieldRow}>
            <label style={S.fieldLabel} htmlFor="t-message">
              Your testimonial *
            </label>
            <textarea
              id="t-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your experience working with Vishal..."
              rows={5}
              minLength={10}
              maxLength={1200}
              required
              style={{ ...S.input, resize: "vertical" as const }}
            />
            <span
              style={{
                fontSize: "11px",
                color: "#444",
                fontFamily: "var(--font-jetbrains-mono, monospace)",
                alignSelf: "flex-end",
              }}
            >
              {message.length}/1200
            </span>
          </div>

          <label
            style={{ display: "flex", gap: "10px", alignItems: "flex-start", cursor: "pointer" }}
          >
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              style={{ marginTop: "2px", flexShrink: 0, accentColor: "#00d084" }}
              required
            />
            <span
              style={{
                fontSize: "12px",
                color: "#666",
                fontFamily: "var(--font-dm-sans, sans-serif)",
                lineHeight: 1.5,
              }}
            >
              I consent to this testimonial being displayed publicly on Vishal&apos;s portfolio
              website. I confirm this is my genuine experience.
            </span>
          </label>

          <button
            type="submit"
            disabled={state === "submitting" || !consent}
            style={{
              ...S.submitBtn,
              opacity: state === "submitting" || !consent ? 0.5 : 1,
              cursor: state === "submitting" || !consent ? "not-allowed" : "pointer",
            }}
          >
            {state === "submitting" ? "Submitting…" : "Submit testimonial →"}
          </button>
        </form>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      {children}
    </div>
  );
}

const S = {
  centeredBox: { textAlign: "center" as const, maxWidth: "400px" },
  formWrap: { width: "100%", maxWidth: "560px" },
  icon: { fontSize: "40px", marginBottom: "16px" },
  label: {
    fontSize: "11px",
    color: "#00d084",
    fontFamily: "var(--font-jetbrains-mono, monospace)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.15em",
    marginBottom: "8px",
  },
  title: {
    margin: "0 0 10px",
    fontSize: "28px",
    fontWeight: 700,
    color: "#f2f4f8",
    fontFamily: "var(--font-dm-sans, sans-serif)",
  },
  subtitle: {
    margin: 0,
    fontSize: "14px",
    color: "#555",
    fontFamily: "var(--font-dm-sans, sans-serif)",
    lineHeight: 1.6,
  },
  errorBox: {
    padding: "12px",
    background: "rgba(255,60,60,0.08)",
    border: "1px solid rgba(255,60,60,0.2)",
    borderRadius: "4px",
    fontSize: "13px",
    color: "#ff6b6b",
    fontFamily: "var(--font-jetbrains-mono, monospace)",
    marginBottom: "8px",
  },
  fieldRow: { display: "flex", flexDirection: "column" as const, gap: "6px" },
  fieldLabel: {
    fontSize: "12px",
    color: "#888",
    fontFamily: "var(--font-jetbrains-mono, monospace)",
  },
  input: {
    padding: "10px 12px",
    background: "#0a0a0a",
    border: "1px solid #2a2a2a",
    borderRadius: "4px",
    color: "#f2f4f8",
    fontSize: "14px",
    fontFamily: "var(--font-dm-sans, sans-serif)",
    outline: "none",
    width: "100%",
    boxSizing: "border-box" as const,
  },
  submitBtn: {
    padding: "14px 20px",
    background: "#f2f4f8",
    color: "#050505",
    border: "none",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: 700,
    fontFamily: "var(--font-dm-sans, sans-serif)",
  },
};
