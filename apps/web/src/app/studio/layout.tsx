"use client";

/**
 * apps/web/src/app/studio/layout.tsx
 * Studio auth-guard layout. All pages under /studio/* get this wrapper.
 * - /studio/login is allowed through without an auth check.
 * - All other studio pages redirect to /studio/login if no valid session.
 */

import { API_URL } from "@/lib/api";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authState, setAuthState] = useState<"checking" | "ok" | "denied">("checking");

  // Login page is public — skip auth check
  const isLoginPage = pathname === "/studio/login";

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        credentials: "include",
      });
      if (res.ok) {
        setAuthState("ok");
      } else {
        setAuthState("denied");
        if (!isLoginPage) router.replace("/studio/login");
      }
    } catch {
      setAuthState("denied");
      if (!isLoginPage) router.replace("/studio/login");
    }
  }, [isLoginPage, router]);

  useEffect(() => {
    if (isLoginPage) {
      setAuthState("ok");
      return;
    }
    checkAuth();
  }, [isLoginPage, checkAuth]);

  if (!isLoginPage && authState === "checking") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          color: "#888",
          fontFamily: "var(--font-jetbrains-mono, monospace)",
          fontSize: "13px",
        }}
      >
        <span>Verifying access…</span>
      </div>
    );
  }

  if (!isLoginPage && authState === "denied") {
    return null; // redirect is in flight
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#050505" }}>
      {/* Sidebar — hidden on login page */}
      {!isLoginPage && (
        <aside
          style={{
            width: "200px",
            flexShrink: 0,
            borderRight: "1px solid #1a1a1a",
            padding: "24px 0",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <div
            style={{
              padding: "0 20px 24px",
              borderBottom: "1px solid #1a1a1a",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-jetbrains-mono, monospace)",
                fontSize: "10px",
                color: "#00d084",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
              }}
            >
              ◉ Studio
            </span>
          </div>
          {[
            { href: "/studio", label: "Dashboard" },
            { href: "/studio/invites", label: "Invites" },
            { href: "/studio/testimonials", label: "Testimonials" },
            { href: "/studio/inbox", label: "Inbox" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                padding: "8px 20px",
                fontFamily: "var(--font-jetbrains-mono, monospace)",
                fontSize: "12px",
                color: pathname === href ? "#f2f4f8" : "#555",
                background: pathname === href ? "#111" : "transparent",
                borderLeft: pathname === href ? "2px solid #00d084" : "2px solid transparent",
                textDecoration: "none",
                transition: "color 0.15s, background 0.15s",
              }}
            >
              {label}
            </Link>
          ))}
          <div style={{ marginTop: "auto", padding: "20px" }}>
            <button
              type="button"
              onClick={async () => {
                await fetch(`${API_URL}/api/auth/logout`, {
                  method: "POST",
                  credentials: "include",
                });
                router.replace("/studio/login");
              }}
              style={{
                fontFamily: "var(--font-jetbrains-mono, monospace)",
                fontSize: "11px",
                color: "#555",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Sign out ↗
            </button>
          </div>
        </aside>
      )}

      {/* Main content */}
      <main
        id="main-content"
        style={{ flex: 1, overflow: "auto", padding: isLoginPage ? 0 : "32px" }}
      >
        {children}
      </main>
    </div>
  );
}
