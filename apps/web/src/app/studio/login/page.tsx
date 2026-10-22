"use client";

/**
 * apps/web/src/app/studio/login/page.tsx
 * P6-03 — Studio login page.
 * - Shows "Sign in with GitHub" button (wired to /api/auth/login)
 * - Shows "Dev Login" button when NEXT_PUBLIC_DEV_AUTH=true (local only)
 * - noindex via metadata (added in layout)
 */

import { API_URL } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const ERROR_MESSAGES: Record<string, string> = {
  forbidden: "This GitHub account is not the portfolio owner.",
  auth_failed: "Authentication failed. Please try again.",
  state_mismatch: "Security check failed. Please try again.",
  missing_params: "Missing OAuth parameters. Please try again.",
};

// ─── Outer page — Suspense shell ─────────────────────────────────────────────
export default function StudioLoginPage() {
  return (
    <Suspense fallback={<LoginShell />}>
      <LoginInner />
    </Suspense>
  );
}

function LoginShell() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#050505",
      }}
    />
  );
}

// ─── Inner component — reads searchParams ─────────────────────────────────────
function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDev = process.env.NEXT_PUBLIC_DEV_AUTH === "true";

  useEffect(() => {
    const errKey = params.get("error");
    if (errKey) setError(ERROR_MESSAGES[errKey] ?? "An error occurred.");

    // If already authenticated, redirect to studio
    fetch(`${API_URL}/api/auth/me`, { credentials: "include" })
      .then((r) => {
        if (r.ok) router.replace("/studio");
      })
      .catch(() => {});
  }, [params, router]);

  async function handleDevLogin() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/dev-login`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        router.replace("/studio");
      } else {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Dev login failed. Check OWNER_GITHUB_ID in .dev.vars");
      }
    } catch {
      setError("Could not connect to API server. Is wrangler dev running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#050505",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          border: "1px solid #1a1a1a",
          borderRadius: "8px",
          padding: "40px 32px",
          background: "#080808",
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono, monospace)",
              fontSize: "10px",
              color: "#00d084",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              marginBottom: "8px",
            }}
          >
            ◉ Studio Access
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: 700,
              color: "#f2f4f8",
              fontFamily: "var(--font-dm-sans, sans-serif)",
            }}
          >
            Owner Sign In
          </h1>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: "13px",
              color: "#555",
              fontFamily: "var(--font-jetbrains-mono, monospace)",
            }}
          >
            Restricted to portfolio owner only.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px",
              background: "rgba(255,60,60,0.08)",
              border: "1px solid rgba(255,60,60,0.2)",
              borderRadius: "4px",
              fontSize: "12px",
              color: "#ff6b6b",
              fontFamily: "var(--font-jetbrains-mono, monospace)",
            }}
          >
            {error}
          </div>
        )}

        {/* GitHub OAuth button */}
        <a
          href={`${API_URL}/api/auth/login`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            width: "100%",
            padding: "12px 20px",
            background: "#f2f4f8",
            color: "#050505",
            border: "none",
            borderRadius: "4px",
            fontSize: "13px",
            fontWeight: 600,
            fontFamily: "var(--font-dm-sans, sans-serif)",
            textDecoration: "none",
            cursor: "pointer",
            transition: "opacity 0.15s",
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "0.85";
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "0.85";
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "1";
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "1";
          }}
        >
          <GithubIcon />
          Sign in with GitHub
        </a>

        {/* Dev bypass — only shown when NEXT_PUBLIC_DEV_AUTH=true */}
        {isDev && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                margin: "20px 0",
              }}
            >
              <div style={{ flex: 1, height: "1px", background: "#1a1a1a" }} />
              <span
                style={{
                  fontSize: "10px",
                  color: "#333",
                  fontFamily: "var(--font-jetbrains-mono, monospace)",
                }}
              >
                DEV
              </span>
              <div style={{ flex: 1, height: "1px", background: "#1a1a1a" }} />
            </div>
            <button
              type="button"
              onClick={handleDevLogin}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 20px",
                background: "transparent",
                color: "#00d084",
                border: "1px solid #00d084",
                borderRadius: "4px",
                fontSize: "12px",
                fontFamily: "var(--font-jetbrains-mono, monospace)",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.5 : 1,
                transition: "opacity 0.15s",
              }}
            >
              {loading ? "Signing in…" : "Dev Login (bypass OAuth)"}
            </button>
            <p
              style={{
                marginTop: "12px",
                fontSize: "10px",
                color: "#333",
                fontFamily: "var(--font-jetbrains-mono, monospace)",
                textAlign: "center",
              }}
            >
              Requires OWNER_GITHUB_ID + DEV_BYPASS_AUTH=true in .dev.vars
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function GithubIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}
