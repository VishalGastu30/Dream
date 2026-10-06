/**
 * scripts/check-budget.ts
 *
 * Verifies bundle sizes and free-tier constraints are within limits.
 *
 * Phase 0: stub — exits 0.
 * Phase 3: implement checks:
 *   - Next.js JS bundle size (gzip) per page
 *   - Initial 3D payload ≤ 3 MB
 *   - Cloudflare Worker bundle size < 3 MiB (gzip) — free tier limit
 *   - No Cloudflare bindings beyond the approved list (D1 only in v1)
 *   - No new service in wrangler.toml without a row in docs/verified-facts.md
 * Phase 5: add 3D asset size checks per scene.
 *
 * Usage: pnpm check:budget
 * See .agents/rules/80-free-tier-guardrails.md for the full spec.
 */

console.log(
  "check:budget — Phase 0 stub. All budgets assumed OK.\n" +
    "Phase 3 will implement full bundle + free-tier tripwire checks.",
);
process.exit(0);
