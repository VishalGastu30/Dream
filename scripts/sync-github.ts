/**
 * scripts/sync-github.ts
 *
 * Fetches public repo metadata from the GitHub API and writes
 * content/generated/github.json for use by the GitHub Galaxy scene (Phase 5).
 *
 * Phase 0: stub.
 * Phase 6: implement using the GitHub REST API with a read-only GITHUB_TOKEN.
 *   Fields collected: name, description, languages, stars, forks, topics,
 *                     pushed_at, homepage, is_fork, is_archived.
 *   Repos excluded by content/github-exclude.yml are filtered out.
 *
 * Usage: pnpm tsx scripts/sync-github.ts
 * CI: runs on a weekly schedule via .github/workflows/sync-github.yml
 */

console.log(
  "sync:github — Phase 0 stub.\n" +
  "Phase 6 will implement GitHub API sync → content/generated/github.json.",
);
process.exit(0);
