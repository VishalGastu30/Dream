/**
 * apps/api/src/routes/admin/invites.ts
 * P6-04 — Owner-only invite management.
 *   POST   /api/admin/invites        → create invite, return one-time URL
 *   GET    /api/admin/invites        → list all invites
 *   DELETE /api/admin/invites/:id    → revoke invite
 */

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import type { Env } from "../../lib/env.ts";

export const invitesRouter = new Hono<{ Bindings: Env }>();

const createInviteSchema = z.object({
  label: z.string().min(1).max(80),
  relationship: z.enum(["mentor", "manager", "teammate", "professor", "client"]),
  project_id: z.string().max(100).optional(),
  /** ISO date string for expiry — max 30 days from now */
  expires_at: z.string().datetime(),
});

// ─── POST /api/admin/invites ──────────────────────────────────────────────────
invitesRouter.post("/", zValidator("json", createInviteSchema), async (c) => {
  const body = c.req.valid("json");

  // Validate expiry is in the future and within 30 days
  const expiresAt = new Date(body.expires_at);
  const now = new Date();
  const maxExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  if (expiresAt <= now) {
    return c.json({ error: "expires_at must be in the future" }, 400);
  }
  if (expiresAt > maxExpiry) {
    return c.json({ error: "expires_at must be within 30 days" }, 400);
  }

  // Generate one-time token (returned once; only hash stored in DB)
  const rawToken = `${crypto.randomUUID()}-${crypto.randomUUID()}`;
  const hashBuf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(rawToken));
  const tokenHash = Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const id = crypto.randomUUID();
  const createdAt = now.toISOString();

  await c.env.DB.prepare(
    `INSERT INTO invites (id, token_hash, label, relationship, project_id, expires_at, used, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
  )
    .bind(
      id,
      tokenHash,
      body.label,
      body.relationship,
      body.project_id ?? null,
      body.expires_at,
      createdAt,
    )
    .run();

  // Return the one-time URL — token is never stored again
  const inviteUrl = `${c.env.SITE_URL}/t/${rawToken}`;

  return c.json(
    {
      id,
      invite_url: inviteUrl,
      label: body.label,
      relationship: body.relationship,
      expires_at: body.expires_at,
      created_at: createdAt,
    },
    201,
  );
});

// ─── GET /api/admin/invites ───────────────────────────────────────────────────
invitesRouter.get("/", async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT id, label, relationship, project_id, expires_at, used, created_at
     FROM invites
     ORDER BY created_at DESC`,
  ).all<{
    id: string;
    label: string;
    relationship: string;
    project_id: string | null;
    expires_at: string;
    used: number;
    created_at: string;
  }>();

  const invites = (rows.results ?? []).map((r) => ({
    ...r,
    used: r.used === 1,
    expired: new Date(r.expires_at) < new Date(),
  }));

  return c.json({ invites });
});

// ─── DELETE /api/admin/invites/:id ────────────────────────────────────────────
invitesRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const result = await c.env.DB.prepare("DELETE FROM invites WHERE id = ?").bind(id).run();

  if (!result.meta.changes) {
    return c.json({ error: "Invite not found" }, 404);
  }
  return c.json({ success: true });
});
