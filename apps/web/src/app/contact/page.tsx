"use client";

/**
 * apps/web/src/app/contact/page.tsx
 * P6-08 — Contact page with working form → POST /api/contact.
 */

import { apiFetch } from "@/lib/api";
import { useState } from "react";

// Note: export const metadata doesn't work in client components.
// SEO metadata is handled via the parent layout title.

type FormState = "idle" | "sending" | "sent" | "error";

export default function ContactPage() {
  const [state, setState] = useState<FormState>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setErrorMsg("");

    try {
      const res = await apiFetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });

      if (res.ok) {
        setState("sent");
      } else {
        const data = (await res.json()) as { error?: string };
        setErrorMsg(data.error ?? "Something went wrong. Try emailing directly.");
        setState("error");
      }
    } catch {
      setErrorMsg("Could not reach the server. Please email me directly.");
      setState("error");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: "96px",
        paddingBottom: "64px",
        maxWidth: "640px",
        margin: "0 auto",
        padding: "96px 32px 64px",
        display: "flex",
        flexDirection: "column",
        gap: "48px",
      }}
    >
      <header style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 700,
            color: "var(--color-foreground)",
            fontFamily: "var(--font-dm-sans, sans-serif)",
            letterSpacing: "-0.02em",
          }}
        >
          Signal Transmission
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: "16px",
            color: "var(--color-muted)",
            fontFamily: "var(--font-jetbrains-mono, monospace)",
            lineHeight: 1.6,
          }}
        >
          My inbox is always open. Whether you have a question, a project idea, or just want to say
          hi — I'll get back to you.
        </p>
      </header>

      {state === "sent" ? (
        <div
          style={{
            padding: "40px",
            border: "1px solid rgba(0,208,132,0.2)",
            borderRadius: "8px",
            background: "rgba(0,208,132,0.04)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "16px" }}>✓</div>
          <h2
            style={{
              margin: "0 0 8px",
              fontSize: "18px",
              color: "var(--color-foreground)",
              fontFamily: "var(--font-dm-sans, sans-serif)",
            }}
          >
            Message received
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "var(--color-muted)",
              fontFamily: "var(--font-jetbrains-mono, monospace)",
            }}
          >
            I'll get back to you at{" "}
            <strong style={{ color: "var(--color-foreground)" }}>{email}</strong> as soon as I can.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          {/* Honeypot */}
          <input
            type="text"
            name="website"
            style={{ display: "none" }}
            tabIndex={-1}
            aria-hidden="true"
          />

          {state === "error" && (
            <div
              style={{
                padding: "12px 16px",
                background: "rgba(255,60,60,0.08)",
                border: "1px solid rgba(255,60,60,0.2)",
                borderRadius: "6px",
                fontSize: "13px",
                color: "#ff6b6b",
                fontFamily: "var(--font-jetbrains-mono, monospace)",
              }}
            >
              {errorMsg}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Field id="contact-name" label="Name" required>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                maxLength={80}
                required
                style={inputStyle}
              />
            </Field>
            <Field id="contact-email" label="Email" required>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                maxLength={200}
                required
                style={inputStyle}
              />
            </Field>
          </div>

          <Field id="contact-message" label="Message" required>
            <textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What's on your mind?"
              rows={6}
              minLength={10}
              maxLength={2000}
              required
              style={{ ...inputStyle, resize: "vertical" as const }}
            />
            <span
              style={{
                fontSize: "11px",
                color: "var(--color-muted)",
                alignSelf: "flex-end",
                fontFamily: "var(--font-jetbrains-mono, monospace)",
              }}
            >
              {message.length}/2000
            </span>
          </Field>

          <button
            type="submit"
            disabled={state === "sending"}
            style={{
              padding: "14px 28px",
              background: "var(--color-foreground)",
              color: "var(--color-background)",
              border: "none",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: 700,
              fontFamily: "var(--font-dm-sans, sans-serif)",
              cursor: state === "sending" ? "not-allowed" : "pointer",
              opacity: state === "sending" ? 0.6 : 1,
              alignSelf: "flex-start",
              transition: "opacity 0.15s",
            }}
          >
            {state === "sending" ? "Sending…" : "Send message →"}
          </button>
        </form>
      )}

      {/* Fallback direct contacts */}
      <div
        style={{
          paddingTop: "32px",
          borderTop: "1px solid var(--color-border)",
          display: "flex",
          justifyContent: "center",
          gap: "32px",
        }}
      >
        {[
          {
            label: "Email",
            href: "mailto:vishalgastu30@gmail.com",
            text: "vishalgastu30@gmail.com",
          },
          { label: "GitHub", href: "https://github.com/vishalgastu30", text: "GitHub ↗" },
          { label: "LinkedIn", href: "https://linkedin.com/in/vishal-gastu", text: "LinkedIn ↗" },
        ].map(({ href, text }) => (
          <a
            key={href}
            href={href}
            target={href.startsWith("mailto") ? undefined : "_blank"}
            rel="noopener noreferrer"
            style={{
              fontSize: "13px",
              color: "var(--color-muted)",
              fontFamily: "var(--font-jetbrains-mono, monospace)",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--color-foreground)";
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--color-foreground)";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--color-muted)";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--color-muted)";
            }}
          >
            {text}
          </a>
        ))}
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  required,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label
        htmlFor={id}
        style={{
          fontSize: "11px",
          color: "var(--color-muted)",
          fontFamily: "var(--font-jetbrains-mono, monospace)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {label}
        {required && " *"}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 14px",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid var(--color-border)",
  borderRadius: "4px",
  color: "var(--color-foreground)",
  fontSize: "14px",
  fontFamily: "var(--font-dm-sans, sans-serif)",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};
