import { zValidator } from "@hono/zod-validator";
/**
 * apps/api/src/routes/contact.ts
 * Public contact form submission.
 * Full implementation in P6-08; this stub accepts and stores messages.
 */
import { Hono } from "hono";
import { z } from "zod";
import type { Env } from "../lib/env.ts";
import { rateLimit } from "../middleware/rate-limit.ts";

const contactSchema = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email().max(254),
  message: z.string().min(10).max(2000),
  // Honeypot — any value triggers silent rejection (checked in handler)
  website: z.string().optional(),
});

export const contactRouter = new Hono<{ Bindings: Env }>();

contactRouter.post("/", rateLimit("contact", 3), zValidator("json", contactSchema), async (c) => {
  const body = c.req.valid("json");

  // Reject honeypot
  if (body.website) {
    return c.json({ success: true }); // silent reject
  }

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  await c.env.DB.prepare(
    `INSERT INTO contact_messages (id, name, email, message, created_at)
       VALUES (?, ?, ?, ?, ?)`,
  )
    .bind(id, body.name, body.email, body.message, createdAt)
    .run();

  return c.json({ success: true }, 201);
});
