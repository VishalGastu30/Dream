/**
 * apps/api/src/middleware/rate-limit.ts
 * Simple D1-backed daily rate limiter.
 * Key = SHA-256(route + date) salted — no raw IPs stored.
 *
 * Phase 6: guards /api/contact (max 3/day) and stubs /api/ask (max 20/day).
 */
import type { MiddlewareHandler } from "hono";
import type { Env } from "../lib/env.ts";

async function makeKey(route: string, salt: string): Promise<string> {
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const raw = `${route}:${date}:${salt}`;
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function rateLimit(route: string, maxPerDay: number): MiddlewareHandler<{ Bindings: Env }> {
  return async (c, next) => {
    // Use CF-Connecting-IP if available, otherwise fall back to a fixed string
    // (all local dev requests share one bucket — acceptable for dev)
    const ip = c.req.header("CF-Connecting-IP") ?? "local";
    const key = await makeKey(route, ip);

    const row = await c.env.DB.prepare("SELECT count FROM rate_limits WHERE key = ?")
      .bind(key)
      .first<{ count: number }>();

    const current = row?.count ?? 0;

    if (current >= maxPerDay) {
      return c.json({ error: "Rate limit exceeded. Try again tomorrow." }, 429, {
        "Retry-After": secondsUntilMidnightUtc().toString(),
      });
    }

    // Upsert counter
    await c.env.DB.prepare(
      `INSERT INTO rate_limits (key, count, reset_at)
       VALUES (?, 1, date('now', '+1 day'))
       ON CONFLICT(key) DO UPDATE SET count = count + 1`,
    )
      .bind(key)
      .run();

    await next();
  };
}

function secondsUntilMidnightUtc(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setUTCHours(24, 0, 0, 0);
  return Math.ceil((midnight.getTime() - now.getTime()) / 1000);
}
