/**
 * apps/api/src/routes/admin/index.ts
 * Admin route stubs — protected by owner-only auth (P6-02).
 * For now returns 501 to unblock scaffold.
 * Full implementation in P6-02 through P6-08.
 */
import { Hono } from "hono";
import type { Env } from "../../lib/env.ts";

export const adminRouter = new Hono<{ Bindings: Env }>();

// Temporary 401 guard until Better Auth is wired in P6-02
adminRouter.use("*", async (c, next) => {
  // Phase 6-02 will replace this with real session verification
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
});

adminRouter.get("/", (c) => {
  return c.json({ message: "Studio admin — Phase 6-02 will add full auth" });
});
