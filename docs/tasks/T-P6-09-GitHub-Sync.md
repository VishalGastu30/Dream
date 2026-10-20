# T-P6-09 — GitHub Sync Workflow

Roadmap ref: P6-09
Branch: main

## Goal
Implement `scripts/sync-github.ts` to fetch public repo metadata and write
`content/generated/github.json`; wire up the scheduled GitHub Actions workflow.

## Acceptance criteria (testable)
- [ ] `pnpm sync:github` (with a real GITHUB_TOKEN) produces a valid `github.json`
- [ ] `GithubRepo` Zod schema added to `packages/schema`
- [ ] `content/github-exclude.yml` exists (can be empty list)
- [ ] `.github/workflows/sync-github.yml` implemented (schedule + workflow_dispatch)
- [ ] `pnpm check` green

## Allowed paths
scripts/sync-github.ts, packages/schema/src/github.ts, content/generated/github.json,
content/github-exclude.yml, .github/workflows/sync-github.yml

## Result
- Summary:
- Files changed:
- Follow-ups: P5-R1 (GitHub Galaxy scene) can now be built
