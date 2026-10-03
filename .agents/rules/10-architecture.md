# Rule 10 — Architecture & Monorepo Boundaries

## Monorepo structure
- `apps/web`              Next.js static export (the portfolio site)
- `apps/api`              Edge API on Cloudflare Workers (Hono router) — DO NOT import into web
- `packages/schema`       Zod schemas, TypeScript types, migration helpers — the ONLY shared type source
- `packages/resume-engine`  Scoring, selection, bullet-variant logic, exporters
- `packages/ui-tokens`    Design tokens as CSS variables + TypeScript constants
- `content/`              YAML + MDX — the single source of truth. Never write to this from a component.
- `scripts/`              Build-time Node scripts (tsx). Never imported by apps.
- `assets/`               Static assets. Every entry requires a row in `assets/manifest.yml`.

## Data flow (one direction only)
```
content/ → validate:content → build:career → career.json → apps/web (read at build time)
content/ → build:resumes → PDFs (CI artefacts)
content/ → build:career → llm-context.json → apps/api (included in prompt)
```

## Import rules (🔒)
- `apps/web` may import from: `packages/schema`, `packages/ui-tokens`, `packages/resume-engine`
- `apps/api` may import from: `packages/schema`
- `packages/resume-engine` may import from: `packages/schema`, `packages/ui-tokens`
- Cross-app imports (`apps/web` ↔ `apps/api`) are **FORBIDDEN**
- Scripts may import from packages but not from apps

## ADR summary (full ADRs in docs/adr/)
| ADR | Decision |
|---|---|
| ADR-001 | Next.js App Router + TypeScript, `output: 'export'` |
| ADR-002 | Cloudflare Workers/Pages + D1 (not Vercel — non-commercial ToS risk) |
| ADR-003 | Content in Git (YAML/MDX) + Zod validation (not a CMS) |
| ADR-004 | D1 only for dynamic data (testimonials, contact, AI counters) |
| ADR-005 | Better Auth + GitHub OAuth, owner-only allowlist |
| ADR-006 | React Three Fiber v9 + drei + postprocessing, procedural-first |
| ADR-007 | GSAP (free) + Lenis smooth-scroll |
| ADR-008 | Resume = HTML/CSS + print stylesheet + Playwright PDF in CI |
| ADR-009 | Groq via edge proxy, provider-agnostic adapter, full-context (no RAG) |
| ADR-010 | pnpm monorepo |
| ADR-011 | Cookieless analytics (Cloudflare Web Analytics) |
| ADR-012 | No custom CMS; optional Keystatic in local/dev mode only |
| ADR-013 | No file uploads in v1 |
| ADR-014 | Domain is optional; start on *.pages.dev |

## Environment variables
`SITE_URL`, `GROQ_API_KEY`, `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`,
`AUTH_SECRET`, `OWNER_GITHUB_ID`, `TURNSTILE_SECRET`, `GITHUB_TOKEN` (CI only).
Never in the browser bundle. Always use `.env.example` as the template.
