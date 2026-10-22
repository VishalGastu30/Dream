#!/usr/bin/env tsx
/**
 * scripts/export-testimonials.ts
 * P6-07 — Fetch approved testimonials from the local API and write the
 * committed snapshot: content/testimonials.snapshot.json
 *
 * Usage:
 *   pnpm export:testimonials
 * Requires wrangler dev to be running on $API_URL (default localhost:8787).
 * The session cookie must be set (run after dev-login or paste in cookie header).
 *
 * In CI/CD: The admin export endpoint is called during the publish workflow.
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const API_URL = process.env.API_URL ?? "http://localhost:8787";
const SESSION_COOKIE = process.env.SESSION_COOKIE ?? "";

async function main() {
  console.log(`Fetching approved testimonials from ${API_URL}/api/admin/export …`);

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (SESSION_COOKIE) {
    headers["Cookie"] = `dream_session=${SESSION_COOKIE}`;
  }

  const res = await fetch(`${API_URL}/api/admin/export`, { headers });

  if (res.status === 401 || res.status === 403) {
    console.error(
      "❌ Not authenticated. Run wrangler dev, log in via /studio/login,\n" +
      "   then re-run with SESSION_COOKIE=<your_cookie_value> pnpm export:testimonials",
    );
    process.exit(1);
  }

  if (!res.ok) {
    console.error(`❌ API error: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  const data = await res.json();
  const outPath = resolve(process.cwd(), "content/testimonials.snapshot.json");
  writeFileSync(outPath, JSON.stringify(data, null, 2) + "\n", "utf8");

  const count = (data as { testimonials: unknown[] }).testimonials?.length ?? 0;
  console.log(`✅ Exported ${count} approved testimonial(s) → content/testimonials.snapshot.json`);
}

main().catch((err) => {
  console.error("❌ Export failed:", err);
  process.exit(1);
});
