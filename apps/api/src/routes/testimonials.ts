/**
 * apps/api/src/routes/testimonials.ts
 * Public GET endpoint for approved testimonials.
 * POST (submission via invite token) is implemented in P6-05.
 */
import { Hono } from "hono";
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
