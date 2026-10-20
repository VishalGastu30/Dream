/**
 * apps/api/src/middleware/cors.ts
 * Restricts CORS to the SITE_URL origin.
 * In local dev (ENVIRONMENT=development), also allows localhost origins.
 */
import type { MiddlewareHandler } from "hono";
import type { Env } from "../lib/env.ts";

export const corsMiddleware = (): MiddlewareHandler<{ Bindings: Env }> => async (c, next) => {
  const origin = c.req.header("Origin") ?? "";
  const siteUrl = c.env.SITE_URL ?? "";
  const isDev = c.env.ENVIRONMENT === "development";

  const isAllowed = origin === siteUrl || (isDev && /^https?:\/\/localhost(:\d+)?$/.test(origin));

  if (c.req.method === "OPTIONS") {
    if (isAllowed) {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
          Vary: "Origin",
        },
      });
    }
    return new Response(null, { status: 403 });
  }

  await next();

  if (isAllowed) {
    c.header("Access-Control-Allow-Origin", origin);
    c.header("Vary", "Origin");
  }
};
