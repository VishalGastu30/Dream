/**
 * apps/api/src/routes/admin/usage.ts
 * GET /api/admin/usage → AI usage stats (prep for Phase 7)
 */

import { Hono } from "hono";
import type { Env } from "../../lib/env.ts";

export const usageRouter = new Hono<{ Bindings: Env }>();

usageRouter.get("/", async (c) => {
  const rows = await c.env.DB.prepare(
    "SELECT date, count FROM ai_usage ORDER BY date DESC LIMIT 30",
  ).all<{ date: string; count: number }>();

  const today = new Date().toISOString().slice(0, 10);
  const todayRow = (rows.results ?? []).find((r) => r.date === today);

  return c.json({
    today_count: todayRow?.count ?? 0,
    daily_cap: Number(c.env.AI_DAILY_CAP) || 200,
    history: rows.results ?? [],
  });
});
