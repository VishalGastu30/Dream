# Rule 20 — Content Schema & Data Rules

## Entities
`Profile` · `StoryChapter` · `Experience` · `Education` · `Project` · `Skill`
`Certification` · `Hackathon` · `Publication` · `Achievement` · `ResumeProfile`
`Testimonial` · `Link` · `Media` · *(reserved)* `Post`

## Universal field rules
| Field | Rule |
|---|---|
| `id` | kebab-case, unique per entity type, **permanent — never rename** (URLs and resume presets depend on it) |
| `schemaVersion` | integer; breaking changes require a migration in `packages/schema/migrations/` |
| `status` | `"draft"` \| `"published"` \| `"archived"` — only `"published"` appears in builds |
| `period.start` | `"YYYY-MM"` or `"YYYY-MM-DD"` |
| `period.end` | same format as start; `null` means present |
| `tags` | lowercase kebab-case; must exist in `content/tags.yml`; unknown tags fail `validate:content` |
| `visibility` | `{ website, resume, timeline, featured }` booleans |
| `resumeWeight` | 0–5 float (default 1) |
| `bullets[].text` | 10–220 chars |
| `bullets[].variants` | keyed by role preset id; same length limit as text |
| `media[].alt` | mandatory — empty alt text fails validation |
| `updatedAt` | ISO date; set by tooling, not by hand |

## ID rules
- Never reuse a retired ID
- Renaming a title is fine; renaming an ID is a **breaking change** requiring a migration + ADR entry

## Tag vocabulary
- Managed in `content/tags.yml` — this is the controlled vocabulary
- Tags not in `tags.yml` fail `validate:content`
- Add a new tag to `tags.yml` FIRST, then use it in content files

## Truthfulness rule (🔒)
Numbers in bullets must be defensible in an interview. Validation cannot check this — the human must.
Agents must never invent or embellish metrics.

## Empty collection rule
A collection with 0–1 published entries renders nothing (or a teaser) on the site.
Threshold configurable per collection in `apps/web/src/config/collections.ts`.

## Schema versioning workflow
1. Increment `schemaVersion` in the Zod schema
2. Write `packages/schema/migrations/v<N>-to-v<N+1>.ts`
3. Add a one-line ADR entry in the relevant `docs/adr/` file
4. Run the migration on all existing content files and commit

## Portability rule
The build emits a JSON Resume-compatible export. Data must never be trapped in a proprietary format.

## LinkedIn import
Never scrape LinkedIn. Use their official "get a copy of your data" export (ZIP of CSVs),
then run `scripts/import-linkedin.ts` to produce *draft* YAML for manual review.
