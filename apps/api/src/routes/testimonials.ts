/**
 * apps/api/src/routes/testimonials.ts
 * Public testimonials endpoint.
 *   GET  /api/testimonials   → approved testimonials (cached)
 *   POST /api/testimonials   → submit via invite token (P6-05)
 */

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import type { Env } from "../lib/env.ts";

export type PublicTestimonial = {
  id: string;
  name: string;
  designation: string;
  company: string;
  relationship: "mentor" | "manager" | "teammate" | "professor" | "client";
  message: string;
  project_id: string | null;
  approved_at: string;
};

export const testimonialsRouter = new Hono<{ Bindings: Env }>();

// ─── GET /api/testimonials ────────────────────────────────────────────────────
testimonialsRouter.get("/", async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT id, name, designation, company, relationship, message, project_id, approved_at
     FROM testimonials
     WHERE status = 'approved'
     ORDER BY approved_at DESC`,
  ).all<PublicTestimonial>();

  return c.json({ testimonials: rows.results ?? [] }, 200, {
    "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
  });
});

// ─── POST /api/testimonials (P6-05) ───────────────────────────────────────────
const submitSchema = z.object({
  token: z.string().min(1).max(200),
  name: z.string().min(1).max(80),
  designation: z.string().min(1).max(100),
  company: z.string().min(1).max(100),
  relationship: z.enum(["mentor", "manager", "teammate", "professor", "client"]),
  message: z.string().min(10).max(1200),
  project_id: z.string().max(100).optional(),
  consent: z.literal(true),
  // Honeypot — must be absent or empty
  website: z.string().max(0).optional(),
});

testimonialsRouter.post("/", zValidator("json", submitSchema), async (c) => {
  const body = c.req.valid("json");

  // Silent reject on honeypot
  if (body.website) {
    return c.json({ success: true });
  }

  // Hash the submitted token and look it up
  const hashBuf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(body.token));
  const tokenHash = Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const invite = await c.env.DB.prepare(
    "SELECT id, used, expires_at FROM invites WHERE token_hash = ?",
  )
    .bind(tokenHash)
    .first<{ id: string; used: number; expires_at: string }>();

  if (!invite) {
    return c.json({ error: "Invalid or expired invite link" }, 410);
  }
  if (invite.used) {
    return c.json({ error: "This invite link has already been used" }, 410);
  }
  if (new Date(invite.expires_at) < new Date()) {
    return c.json({ error: "This invite link has expired" }, 410);
  }

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  // Insert testimonial
  await c.env.DB.prepare(
    `INSERT INTO testimonials
       (id, invite_id, name, designation, company, relationship, message, project_id, consent, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 'pending', ?)`,
  )
    .bind(
      id,
      invite.id,
      body.name,
      body.designation,
      body.company,
      body.relationship,
      body.message,
      body.project_id ?? null,
      createdAt,
    )
    .run();

  // Mark invite as used (single-use enforcement)
  await c.env.DB.prepare("UPDATE invites SET used = 1 WHERE id = ?").bind(invite.id).run();

  return c.json({ success: true }, 201);
});
