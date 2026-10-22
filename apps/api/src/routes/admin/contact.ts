/**
 * apps/api/src/routes/admin/contact.ts
 * P6-08 — Owner-only contact inbox.
 *   GET    /api/admin/contact       → all messages
 *   PATCH  /api/admin/contact/:id  → mark as read
 *   DELETE /api/admin/contact/:id  → delete
 */

import { Hono } from "hono";
import type { Env } from "../../lib/env.ts";

export const adminContactRouter = new Hono<{ Bindings: Env }>();

// ─── GET /api/admin/contact ───────────────────────────────────────────────────
adminContactRouter.get("/", async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT id, name, email, message, read, created_at
     FROM contact_messages
     ORDER BY read ASC, created_at DESC`,
  ).all();
  return c.json({ messages: rows.results ?? [] });
});

// ─── PATCH /api/admin/contact/:id (mark as read) ──────────────────────────────
adminContactRouter.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const result = await c.env.DB.prepare("UPDATE contact_messages SET read = 1 WHERE id = ?")
    .bind(id)
    .run();

  if (!result.meta.changes) {
    return c.json({ error: "Message not found" }, 404);
  }
  return c.json({ success: true });
});

// ─── DELETE /api/admin/contact/:id ────────────────────────────────────────────
adminContactRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const result = await c.env.DB.prepare("DELETE FROM contact_messages WHERE id = ?").bind(id).run();

  if (!result.meta.changes) {
    return c.json({ error: "Message not found" }, 404);
  }
  return c.json({ success: true });
});
