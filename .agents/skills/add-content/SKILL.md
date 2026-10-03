# Skill: add-content

Add or edit a content entity (project, experience, education, certification, hackathon,
publication, or achievement) without touching application code.

## Steps
1. Identify the entity type and pick a permanent kebab-case `id` (check for conflicts in `content/`).
2. Copy the relevant template from `docs/templates/<entity>.yml` or `docs/templates/<entity>.mdx`.
3. Fill all required fields per `packages/schema/src/<entity>.ts` (run `pnpm validate:content` to check).
4. Add media to `assets/images/<id>/` — WebP/AVIF, ≤ 300 KB each, alt text in frontmatter.
5. If the entity has bullets, write 1–3 variants (general / ai / backend / fullstack) for the top bullets.
6. For featured projects: write the full case study in MDX following the §5.5 structure in MASTER_PLAN.md.
7. Run `pnpm validate:content` — fix **ALL** errors before proceeding.
8. Run `pnpm dev` — verify the item appears in: cinematic view, professional view, Resume Forge (if applicable).
9. Run `pnpm check` — all gates must pass.
10. Open a PR: `content: add <entity-type> <id>`. Screenshot the item in both views.

## Validation checklist
- [ ] `id` is unique and permanent (kebab-case, no spaces, no uppercase)
- [ ] `schemaVersion` matches the current schema version in `packages/schema`
- [ ] `status` is `"published"` (not `"draft"`) if it should appear on the site
- [ ] All `tags` exist in `content/tags.yml`
- [ ] `period.start` and `period.end` in `"YYYY-MM"` format; `end` is `null` if present
- [ ] All `media[].alt` fields are non-empty
- [ ] All `bullets[].text` are 10–220 chars
- [ ] `resumeWeight` is 0–5
- [ ] No invented numbers — every metric is defensible in an interview
- [ ] New media files added to `assets/manifest.yml`
