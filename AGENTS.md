# AGENTS.md — Vishal // Digital Universe

## What this repo is
A static-exported Next.js portfolio (cinematic 3D + professional view), a resume engine, a tiny edge API (Cloudflare) and an AI "Ask me" assistant. Content lives in `content/` (YAML/MDX) and is the single source of truth. Full plan: `docs/PORTFOLIO_MASTER_PLAN.md`.

## Commands
- `pnpm check`            = typecheck + lint + unit tests + content validation + build + budgets (run before every PR)
- `pnpm dev`              = Next.js dev server for apps/web
- `pnpm test:e2e`         = Playwright e2e tests
- `pnpm validate:content` = Zod-validate every file in content/
- `pnpm build:resumes`    = Playwright renders each resume preset → PDF
- `pnpm check:assets`     = verify assets/manifest.yml completeness + budgets
- `pnpm check:budget`     = bundle size + free-tier tripwire
- `pnpm format`           = Biome format + lint fix

## Non-negotiables (🔒)
1. **₹0 rule:** never add paid services, API keys that require a card, or billing config. Stop and ask the owner.
2. **Content is data:** never hard-code project/job/testimonial/profile text in components. It all comes from `content/` via `career.json`.
3. **Every visual feature needs:** DOM twin (same info as readable HTML), keyboard path, reduced-motion path, and tier fallbacks (High / Medium / Low / None).
4. **3D budgets:** initial 3D payload ≤ 3 MB; any single model ≤ 1.5 MB; no allocations in `useFrame`; see `.agents/rules/40-3d-performance.md`.
5. **Every asset** must be in `assets/manifest.yml` with a licence (prefer CC0 / CC-BY; no NC / ND).
6. **No secrets in code.** Use `.env.example` for the template; real secrets go in platform secrets / `.env` (never committed).
7. **Package boundaries:** `apps/web` must not import from `apps/api`. Shared types come from `packages/schema` only.
8. **No new dependency** without a justification written in the task file: what it does, why it's needed, size, licence, free-tier impact.
9. **Accessibility target:** WCAG 2.2 AA. Contrast and focus are not optional extras.
10. **One task per session.** Work from `docs/tasks/T-xxxx.md`; write open questions into the task file instead of guessing.

## Workflow
Plan → implement on a branch → `pnpm check` → verify in browser (desktop + mobile viewport) → summarise with screenshots + test output → update any docs/ADR/runbook if behaviour changed.

## Where things live
See the repo tree in `docs/PORTFOLIO_MASTER_PLAN.md §4.2`. Detailed rules: `.agents/rules/*`. Procedures: `.agents/skills/*`, `.agents/workflows/*`. Task files: `docs/tasks/`. ADRs: `docs/adr/`.

## Style
TypeScript strict, small modules, named exports, tests co-located with code (`*.test.ts`), conventional commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`).
