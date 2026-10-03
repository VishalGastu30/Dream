# Rule 70 — Testing & CI

## The `pnpm check` command (must pass before every PR merge)
Runs in this order — a failure in any step stops the chain:
1. `typecheck`         — tsc --noEmit across all packages, 0 errors
2. `lint`              — Biome, 0 errors
3. `test`              — Vitest unit tests, all pass; resume-engine coverage ≥ 90%
4. `validate:content`  — Zod + broken links + duplicate IDs + alt text, 0 errors
5. `build`             — Next.js static export succeeds
6. `check:budget`      — bundle sizes + asset budgets within limits
7. `check:assets`      — every asset in manifest.yml, licence present, size under budget

## CI gates (GitHub Actions — runs on every PR and push to main)
| Gate | Tool | Threshold |
|---|---|---|
| Typecheck | tsc | 0 errors |
| Lint | Biome | 0 errors |
| Unit tests | Vitest | all pass |
| Content validation | validate:content | 0 errors |
| Build | next build | success |
| Bundle budget | check:budget | within limits |
| E2E smoke | Playwright | home + project + resume-forge + 404 + studio-404 pass |
| Accessibility | axe-core via Playwright | 0 serious/critical |
| Secret scan | gitleaks | 0 findings |
| Free-tier tripwire | check:budget | no paid bindings; Worker size < 3 MiB |

## Additional gates (main branch + weekly)
| Gate | Tool | Threshold |
|---|---|---|
| Lighthouse | lighthouse-ci | perf ≥ 90 (pro) / ≥ 80 (cinematic), a11y ≥ 95 |
| Resume PDFs | Playwright | page count ≤ target; headings present |
| Dependency audit | pnpm audit | no high/critical |

## Manual gates (before each release)
| Gate | Threshold |
|---|---|
| AI evals (docs/evals/ask-me.yml) | ≥ 90% correct; 0 invented employers/dates/projects |
| Real-device pass | Low-end Android + mid-range phone + laptop recorded |

## Definition of Done (every task)
- [ ] Acceptance criteria in the task file are met
- [ ] `pnpm check` is green
- [ ] DOM twin + keyboard path + reduced-motion path exist for any visual change
- [ ] New assets recorded in `assets/manifest.yml`
- [ ] Relevant ADR / runbook / docs updated if behaviour changed
- [ ] Screenshots (desktop + mobile) attached for any visual work
- [ ] No new dependency without a written justification in the task file

## Test file conventions
- Unit tests: co-located with source as `*.test.ts`
- E2E tests: `apps/web/tests/*.spec.ts` (Playwright)
- Fixtures: `packages/resume-engine/src/__fixtures__/`
- Snapshots: `__snapshots__/` directory next to the test file
- Never commit `.only` or `.skip` in test files on main

## Commit convention
`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `content:`, `perf:`, `refactor:`
Example: `feat: add journey scene with spline path`
Example: `content: add project craft-rl`
