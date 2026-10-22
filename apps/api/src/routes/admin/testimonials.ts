/**
 * apps/api/src/routes/admin/testimonials.ts
 * P6-06 — Owner-only testimonial moderation.
 *   GET    /api/admin/testimonials       → all testimonials (all statuses)
 *   PATCH  /api/admin/testimonials/:id  → update status or message
 *   DELETE /api/admin/testimonials/:id  → hard delete
 */

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import type { Env } from "../../lib/env.ts";

export const adminTestimonialsRouter = new Hono<{ Bindings: Env }>();

const patchSchema = z.object({
  status: z.enum(["approved", "rejected"]).optional(),
  message: z.string().min(10).max(1200).optional(),
});

// ─── GET /api/admin/testimonials ──────────────────────────────────────────────
adminTestimonialsRouter.get("/", async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT t.id, t.name, t.designation, t.company, t.relationship,
            t.message, t.project_id, t.status, t.created_at, t.approved_at,
            i.label as invite_label
     FROM testimonials t
     LEFT JOIN invites i ON t.invite_id = i.id
     ORDER BY
       CASE t.status WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END,
       t.created_at DESC`,
  ).all();
  return c.json({ testimonials: rows.results ?? [] });
});

// ─── PATCH /api/admin/testimonials/:id ────────────────────────────────────────
adminTestimonialsRouter.patch("/:id", zValidator("json", patchSchema), async (c) => {
  const id = c.req.param("id");
  const body = c.req.valid("json");

  if (!body.status && !body.message) {
    return c.json({ error: "Provide status or message to update" }, 400);
  }

  const sets: string[] = [];
  const binds: unknown[] = [];

  if (body.status) {
    sets.push("status = ?");
    binds.push(body.status);
    if (body.status === "approved") {
      sets.push("approved_at = ?");
      binds.push(new Date().toISOString());
    }
  }
  if (body.message) {
    sets.push("message = ?");
    binds.push(body.message);
  }

  binds.push(id);
  const result = await c.env.DB.prepare(`UPDATE testimonials SET ${sets.join(", ")} WHERE id = ?`)
    .bind(...binds)
    .run();

  if (!result.meta.changes) {
    return c.json({ error: "Testimonial not found" }, 404);
  }
  return c.json({ success: true });
});

// ─── DELETE /api/admin/testimonials/:id ───────────────────────────────────────
adminTestimonialsRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const result = await c.env.DB.prepare("DELETE FROM testimonials WHERE id = ?").bind(id).run();

  if (!result.meta.changes) {
    return c.json({ error: "Testimonial not found" }, 404);
  }
  return c.json({ success: true });
});
