/**
 * apps/api/src/routes/auth.ts
 * Authentication routes:
 *   GET  /api/auth/login       → redirect to GitHub OAuth
 *   GET  /api/auth/callback    → handle GitHub callback, set session cookie
 *   GET  /api/auth/me          → return current session (or 401)
 *   POST /api/auth/logout      → clear session cookie
 *   POST /api/auth/dev-login   → dev bypass (ENVIRONMENT=development only)
 */

import { Hono } from "hono";
import type { Env } from "../lib/env.ts";
import { exchangeCodeForToken, getAuthorizationUrl, getGithubUser } from "../lib/github-oauth.ts";
import { clearSessionCookie, createSession, getSession, setSessionCookie } from "../lib/session.ts";

export const authRouter = new Hono<{ Bindings: Env }>();

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
authRouter.get("/me", async (c) => {
  const session = await getSession(c);
  if (!session || session.github_id !== c.env.OWNER_GITHUB_ID) {
    return c.json({ authenticated: false }, 401);
  }
  return c.json({ authenticated: true, github_id: session.github_id });
});

// ─── GET /api/auth/login ──────────────────────────────────────────────────────
authRouter.get("/login", (c) => {
  const clientId = c.env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId || clientId === "your_github_oauth_client_id") {
    return c.json(
      {
        error: "GitHub OAuth not configured. Set GITHUB_OAUTH_CLIENT_ID in .dev.vars",
      },
      503,
    );
  }

  // Use a random state value stored in a short-lived cookie for CSRF protection
  const state = crypto.randomUUID();
  const redirectUri = `${c.env.SITE_URL.replace("3000", "8787")}/api/auth/callback`;
  const url = getAuthorizationUrl(clientId, redirectUri, state);

  // Store state in a short-lived cookie
  c.header("Set-Cookie", `oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=300`);

  return c.redirect(url, 302);
});

// ─── GET /api/auth/callback ───────────────────────────────────────────────────
authRouter.get("/callback", async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const errorParam = c.req.query("error");

  if (errorParam) {
    return c.redirect(
      `${c.env.SITE_URL}/studio/login?error=${encodeURIComponent(errorParam)}`,
      302,
    );
  }

  if (!code || !state) {
    return c.redirect(`${c.env.SITE_URL}/studio/login?error=missing_params`, 302);
  }

  // Verify state (CSRF check)
  const cookieHeader = c.req.header("Cookie") ?? "";
  const stateCookie = cookieHeader.match(/oauth_state=([^;]+)/)?.[1];
  if (!stateCookie || stateCookie !== state) {
    return c.redirect(`${c.env.SITE_URL}/studio/login?error=state_mismatch`, 302);
  }

  try {
    const clientId = c.env.GITHUB_OAUTH_CLIENT_ID;
    const clientSecret = c.env.GITHUB_OAUTH_CLIENT_SECRET;
    const redirectUri = `${c.env.SITE_URL.replace("3000", "8787")}/api/auth/callback`;

    const accessToken = await exchangeCodeForToken(clientId, clientSecret, code, redirectUri);
    const { id } = await getGithubUser(accessToken);

    if (String(id) !== c.env.OWNER_GITHUB_ID) {
      return c.redirect(`${c.env.SITE_URL}/studio/login?error=forbidden`, 302);
    }

    const sessionToken = await createSession(String(id), c.env.AUTH_SECRET);
    setSessionCookie(c, sessionToken);

    // Clear the state cookie via a second Set-Cookie header
    const response = c.res;
    response.headers.append(
      "Set-Cookie",
      "oauth_state=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
    );

    return c.redirect(`${c.env.SITE_URL}/studio`, 302);
  } catch (err) {
    console.error("OAuth callback error:", err);
    return c.redirect(`${c.env.SITE_URL}/studio/login?error=auth_failed`, 302);
  }
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
authRouter.post("/logout", (c) => {
  clearSessionCookie(c);
  return c.json({ success: true });
});

// ─── POST /api/auth/dev-login ─────────────────────────────────────────────────
// DEVELOPMENT ONLY — creates an owner session without GitHub OAuth.
// Blocked in production by the ENVIRONMENT check.
authRouter.post("/dev-login", async (c) => {
  if (c.env.ENVIRONMENT !== "development" || c.env.DEV_BYPASS_AUTH !== "true") {
    return c.json({ error: "Dev login is only available in development" }, 403);
  }

  const ownerId = c.env.OWNER_GITHUB_ID;
  if (!ownerId) {
    return c.json({ error: "OWNER_GITHUB_ID is not set in .dev.vars" }, 503);
  }

  const sessionToken = await createSession(ownerId, c.env.AUTH_SECRET);
  setSessionCookie(c, sessionToken);
  return c.json({ success: true, github_id: ownerId });
});
