/**
 * scripts/check-assets.ts
 *
 * Validates the assets/ directory against assets/manifest.yml.
 *
 * Phase 0: stub — exits 0 (no assets yet).
 * Phase 2: implement checks:
 *   - Every file in assets/ (except .gitkeep) has a manifest entry
 *   - Every manifest entry has: id, type, file, source_url, author, license, attribution
 *   - No CC-NC or CC-ND licences (unless explicitly documented exception)
 *   - File sizes within budgets (see .agents/rules/40-3d-performance.md)
 *   - Generates assets/ATTRIBUTIONS.md from manifest entries
 *
 * Usage: pnpm check:assets
 * See MASTER_PLAN.md §9 for the full asset rules.
 */

console.log(
  "check:assets — Phase 0 stub. No assets to check yet.\n" +
  "Phase 2 will implement manifest validation + attribution generation.",
);
process.exit(0);
