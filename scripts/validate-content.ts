/**
 * scripts/validate-content.ts
 *
 * Validates every file in content/ against the Zod schemas in packages/schema.
 *
 * Phase 0: stub — exits 0 (no content to validate yet).
 * Phase 1: implement Zod validation for all entity types.
 * Phase 3: add broken-link checking, duplicate ID detection, alt-text validation,
 *          orphan tag detection (tags used but not in content/tags.yml).
 *
 * Usage: pnpm validate:content
 */

console.log(
  "validate:content — Phase 0 stub. No content to validate yet.\n" +
  "Phase 1 will implement full validation of content/ against packages/schema.",
);
process.exit(0);
