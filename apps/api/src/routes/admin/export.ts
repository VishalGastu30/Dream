/**
 * apps/api/src/routes/admin/export.ts
 * P6-07 — Snapshot export for testimonials fallback.
 *   GET /api/admin/export → all approved testimonials as JSON
 * Used by scripts/export-testimonials.ts to generate the committed snapshot.
 */

import { Hono } from "hono";
import type { Env } from "../../lib/env.ts";

export const exportRouter = new Hono<{ Bindings: Env }>();

exportRouter.get("/", async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT id, name, designation, company, relationship, message, project_id, approved_at
     FROM testimonials
     WHERE status = 'approved'
     ORDER BY approved_at DESC`,
  ).all();

  return c.json(
    {
      exported_at: new Date().toISOString(),
      testimonials: rows.results ?? [],
    },
    200,
    {
      // No caching — owner always gets fresh data
      "Cache-Control": "no-store",
    },
  );
});
