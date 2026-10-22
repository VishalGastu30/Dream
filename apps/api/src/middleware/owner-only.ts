/**
 * apps/api/src/middleware/owner-only.ts
 * Guards any route to the portfolio owner only.
 * Reads the session cookie and verifies the github_id matches OWNER_GITHUB_ID.
 */

import type { MiddlewareHandler } from "hono";
import type { Env } from "../lib/env.ts";
import { getSession } from "../lib/session.ts";

export const ownerOnly = (): MiddlewareHandler<{ Bindings: Env }> => async (c, next) => {
  const session = await getSession(c);
  if (!session) {
    return c.json({ error: "Unauthorized — please sign in" }, 401);
  }
  if (session.github_id !== c.env.OWNER_GITHUB_ID) {
    return c.json({ error: "Forbidden — owner access only" }, 403);
  }
  await next();
};
