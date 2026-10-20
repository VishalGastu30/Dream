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

  // --- Secrets (set via wrangler secret put) ---
  GROQ_API_KEY: string;
  GITHUB_OAUTH_CLIENT_ID: string;
  GITHUB_OAUTH_CLIENT_SECRET: string;
  AUTH_SECRET: string;
  /** Numeric GitHub user ID of the portfolio owner */
  OWNER_GITHUB_ID: string;
  TURNSTILE_SECRET?: string;
}
