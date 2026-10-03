/**
 * scripts/build-resumes.ts
 *
 * Uses Playwright to render each resume preset to a PDF and validate:
 *   - Page count does not exceed the preset's targetPages limit
 *   - All standard section headings are present in the PDF text
 *   - Exported PDFs are saved to apps/web/public/resume/<preset>.pdf
 *
 * Also generates JSON Resume and plain-text exports.
 *
 * Phase 0: stub.
 * Phase 4: implement after resume-engine and templates are built.
 *   Routes rendered: /resume/render/<preset>?mode=pro  (PDF)
 *                    /resume/render/<preset>?mode=sig  (Signature PDF)
 *
 * Usage: pnpm build:resumes
 * CI: runs on push to main
 */

console.log(
  "build:resumes — Phase 0 stub.\n" +
  "Phase 4 will implement Playwright-based PDF generation for all presets.",
);
process.exit(0);
