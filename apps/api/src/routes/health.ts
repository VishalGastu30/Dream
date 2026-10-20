/**
 * apps/api/src/routes/health.ts
 */
import { Hono } from "hono";
import type { Env } from "../lib/env.ts";

export const healthRouter = new Hono<{ Bindings: Env }>();

healthRouter.get("/", (c) => {
  return c.json({
    status: "ok",
    phase: 6,
    environment: c.env.ENVIRONMENT ?? "unknown",
    timestamp: new Date().toISOString(),
  });
});
