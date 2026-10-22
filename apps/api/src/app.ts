/**
 * apps/api/src/app.ts
 * Hono app factory — exported separately so tests can import it directly.
 */
import { Hono } from "hono";
import type { Env } from "./lib/env.ts";
import { corsMiddleware } from "./middleware/cors.ts";
import { securityHeaders } from "./middleware/security-headers.ts";
import { adminRouter } from "./routes/admin/index.ts";
import { authRouter } from "./routes/auth.ts";
import { contactRouter } from "./routes/contact.ts";
import { healthRouter } from "./routes/health.ts";
import { testimonialsRouter } from "./routes/testimonials.ts";

export function createApp() {
  const app = new Hono<{ Bindings: Env }>();

  // Global middleware
  app.use("*", securityHeaders());
  app.use("*", corsMiddleware());

  // Routes
  app.route("/api/health", healthRouter);
  app.route("/api/auth", authRouter);
  app.route("/api/testimonials", testimonialsRouter);
  app.route("/api/contact", contactRouter);
  app.route("/api/admin", adminRouter);

  // 404 fallback
  app.notFound((c) => c.json({ error: "Not found" }, 404));

  // Error handler
  app.onError((err, c) => {
    console.error(err);
    return c.json({ error: "Internal server error" }, 500);
  });

  return app;
}
