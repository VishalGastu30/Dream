/**
 * scripts/build-career.ts
 *
 * Merges all content/ entities into:
 *   - content/generated/career.json  (typed, used by apps/web at build time)
 *   - content/generated/llm-context.json  (used by apps/api for the AI assistant)
 *
 * Phase 0: stub.
 * Phase 3: implement full merge of profile, projects, experience, education,
 *          certifications, hackathons, achievements, skills, publications.
 *          Only "published" entities and "public" visibility fields are included.
 *          The llm-context.json must contain ONLY published public content.
 *
 * Usage: pnpm build:career
 */

console.log(
  "build:career — Phase 0 stub.\n" +
  "Phase 3 will implement the full career.json + llm-context.json merge.",
);
process.exit(0);
