/**
 * apps/api/src/lib/env.ts
 * Typed Cloudflare Workers environment bindings.
 * All secrets are set via `wrangler secret put`, never hard-coded here.
 */

export interface Env {
  /** D1 database binding — configured in wrangler.toml */
  DB: D1Database;

  /** The canonical site URL (e.g. https://vishal.pages.dev). Used for CORS. */
  SITE_URL: string;

  /** Non-secret environment label */
  ENVIRONMENT: "production" | "development";

  // --- Auth secrets (set via wrangler secret put) ---
  /** 32+ random bytes for signing session cookies (HMAC-SHA-256) */
  AUTH_SECRET: string;
  /** GitHub numeric user ID of the portfolio owner */
  OWNER_GITHUB_ID: string;
  /** GitHub OAuth App Client ID */
  GITHUB_OAUTH_CLIENT_ID: string;
  /** GitHub OAuth App Client Secret */
  GITHUB_OAUTH_CLIENT_SECRET: string;

  // --- Dev bypass (set in .dev.vars only, NEVER in production) ---
  /** Set to "true" in .dev.vars to enable /api/auth/dev-login endpoint */
  DEV_BYPASS_AUTH?: string;

  // --- AI (Phase 7) ---
  GROQ_API_KEY: string;
  GROQ_MODEL: string;
  ENABLE_ASK_ME: string;
  AI_DAILY_CAP: string;

  // --- Spam prevention ---
  TURNSTILE_SECRET?: string;
}
