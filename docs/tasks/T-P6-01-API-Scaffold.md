# T-P6-01 — Edge API Scaffold + D1 Schema

Roadmap ref: P6-01
Branch: main

## Goal
Replace the Phase 0 stub in `apps/api` with a working Hono router, D1 binding,
migrations, and local dev workflow.

## Acceptance criteria (testable)
- [ ] `GET /api/health` returns `{status:"ok",phase:6}` locally with `wrangler dev --local`
- [ ] D1 tables created locally via `pnpm -F api db:migrate`
- [ ] Security headers present on all responses (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- [ ] CORS restricted to `SITE_URL` env var origin
- [ ] `pnpm check` green

## Allowed paths
apps/api/**, packages/schema/src/github.ts (new file)

## Result
- Summary:
- Files changed:
- Follow-ups: P6-02 (Auth)
