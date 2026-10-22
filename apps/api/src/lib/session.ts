/**
 * apps/api/src/lib/session.ts
 * Lightweight HMAC-SHA-256 signed session cookies.
 * No database required — the cookie IS the session.
 *
 * Cookie format: base64url(payload) + "." + base64url(HMAC-SHA-256(payload))
 * Payload: { github_id: string, exp: number (unix ms) }
 */

import type { Context } from "hono";
import type { Env } from "./env.ts";

export type SessionPayload = {
  github_id: string;
  exp: number; // unix milliseconds
};

export const SESSION_COOKIE = "dream_session";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// ─── Signing helpers ─────────────────────────────────────────────────────────

function b64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function b64urlStr(str: string): string {
  return b64url(new TextEncoder().encode(str).buffer as ArrayBuffer);
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return b64url(sig);
}

async function verify(payload: string, signature: string, secret: string): Promise<boolean> {
  const expected = await sign(payload, secret);
  // Constant-time comparison
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function createSession(github_id: string, secret: string): Promise<string> {
  const payload: SessionPayload = {
    github_id,
    exp: Date.now() + SESSION_TTL_MS,
  };
  const encodedPayload = b64urlStr(JSON.stringify(payload));
  const signature = await sign(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

export async function verifySession(token: string, secret: string): Promise<SessionPayload | null> {
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex === -1) return null;

  const encodedPayload = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);

  const valid = await verify(encodedPayload, signature, secret);
  if (!valid) return null;

  try {
    const payload = JSON.parse(
      atob(encodedPayload.replace(/-/g, "+").replace(/_/g, "/")),
    ) as SessionPayload;
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function setSessionCookie(c: Context<{ Bindings: Env }>, token: string): void {
  const isSecure = c.env.ENVIRONMENT === "production";
  c.header(
    "Set-Cookie",
    [
      `${SESSION_COOKIE}=${token}`,
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      `Max-Age=${SESSION_TTL_MS / 1000}`,
      ...(isSecure ? ["Secure"] : []),
    ].join("; "),
  );
}

export function clearSessionCookie(c: Context<{ Bindings: Env }>): void {
  c.header("Set-Cookie", `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

export function getSessionToken(c: Context<{ Bindings: Env }>): string | null {
  const cookie = c.req.header("Cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  return match?.[1] ?? null;
}

export async function getSession(c: Context<{ Bindings: Env }>): Promise<SessionPayload | null> {
  const token = getSessionToken(c);
  if (!token) return null;
  return verifySession(token, c.env.AUTH_SECRET);
}
