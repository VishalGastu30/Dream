/**
 * apps/api/src/index.ts — Edge API entry point
 *
 * Phase 0: minimal health-check stub.
 * Phase 6: implement with Hono router:
 *   - GET  /api/testimonials     → public testimonials from D1
 *   - POST /api/testimonials      → submit via invite token
 *   - POST /api/ask              → AI assistant (Groq adapter)
 *   - POST /api/contact          → contact form → D1 inbox
 *   - GET  /api/admin/*          → studio endpoints (Better Auth protected)
 *   - GET  /api/health           → health check
 *
 * See MASTER_PLAN.md §11 and §12 for the full API spec.
 * RULE: apps/web must NEVER import from this package.
 */

export default {
  async fetch(_request: Request): Promise<Response> {
    return new Response(
      JSON.stringify({
        status: "ok",
        phase: 0,
        message: "API stub — Phase 6 will implement all routes",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "X-Frame-Options": "DENY",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  },
};
