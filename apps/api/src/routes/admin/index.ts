/**
 * apps/api/src/routes/admin/index.ts
 * Mounts all admin sub-routers under /api/admin/*.
 * Protected by ownerOnly() middleware.
 */

import { Hono } from "hono";
import type { Env } from "../../lib/env.ts";
import { ownerOnly } from "../../middleware/owner-only.ts";
import { adminContactRouter } from "./contact.ts";
import { exportRouter } from "./export.ts";
import { invitesRouter } from "./invites.ts";
import { adminTestimonialsRouter } from "./testimonials.ts";
import { usageRouter } from "./usage.ts";

export const adminRouter = new Hono<{ Bindings: Env }>();

// All admin routes require owner session
adminRouter.use("*", ownerOnly());

// Sub-routers
adminRouter.route("/invites", invitesRouter);
adminRouter.route("/testimonials", adminTestimonialsRouter);
adminRouter.route("/contact", adminContactRouter);
adminRouter.route("/export", exportRouter);
adminRouter.route("/usage", usageRouter);

// Dashboard summary
adminRouter.get("/", async (c) => {
  const [pendingT, unreadC, todayAI] = await Promise.all([
    c.env.DB.prepare("SELECT COUNT(*) as count FROM testimonials WHERE status = 'pending'").first<{
      count: number;
    }>(),
    c.env.DB.prepare("SELECT COUNT(*) as count FROM contact_messages WHERE read = 0").first<{
      count: number;
    }>(),
    c.env.DB.prepare("SELECT count FROM ai_usage WHERE date = date('now')").first<{
      count: number;
    }>(),
  ]);

  return c.json({
    pending_testimonials: pendingT?.count ?? 0,
    unread_messages: unreadC?.count ?? 0,
    ai_requests_today: todayAI?.count ?? 0,
  });
});
