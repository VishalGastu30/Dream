/**
 * apps/api/src/index.ts — Cloudflare Worker entry point
 *
 * Phase 6: Hono router with D1 binding.
 * Routes:
 *   GET  /api/health             → health check
 *   GET  /api/testimonials       → public approved testimonials (cached)
 *   POST /api/contact            → contact form → D1 inbox
 *   *    /api/admin/**           → owner-only (Better Auth, P6-02)
 *
 * See MASTER_PLAN.md §11 and the Phase 6 implementation plan.
 * RULE: apps/web must NEVER import from this package.
 */

import { createApp } from "./app.ts";

const app = createApp();

export default app;
