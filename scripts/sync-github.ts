/**
 * scripts/sync-github.ts
 *
 * Fetches public repository metadata from GitHub and writes
 * content/generated/github.json.
 *
 * Usage: pnpm sync:github
 * Requires: GITHUB_TOKEN env var (read-only, public repos only)
 *           GITHUB_USERNAME env var (or falls back to "VishalGastu30")
 *
 * Scheduled: every Monday at 02:00 UTC via .github/workflows/sync-github.yml
 */

import { writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import type { GithubData, GithubRepo } from "../packages/schema/src/github.ts";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? "VishalGastu30";
const OUT_PATH = join(
  import.meta.dirname,
  "../content/generated/github.json",
);
const EXCLUDE_PATH = join(
  import.meta.dirname,
  "../content/github-exclude.yml",
);
const CAREER_PATH = join(
  import.meta.dirname,
  "../content/generated/career.json",
);

if (!GITHUB_TOKEN) {
  console.error(
    "❌  GITHUB_TOKEN is not set. Export it before running this script.",
  );
  process.exit(1);
}

const headers: Record<string, string> = {
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "dream-portfolio-sync/1.0",
};

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText} — ${url}`);
  }
  return res.json() as Promise<T>;
}

type RawRepo = {
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  pushed_at: string | null;
  homepage: string | null;
  html_url: string;
  fork: boolean;
  archived: boolean;
  private: boolean;
};

async function fetchLanguages(fullName: string): Promise<Record<string, number>> {
  try {
    return await fetchJson<Record<string, number>>(
      `https://api.github.com/repos/${fullName}/languages`,
    );
  } catch {
    return {};
  }
}

function primaryLanguage(langs: Record<string, number>): string | null {
  const entries = Object.entries(langs);
  if (entries.length === 0) return null;
  return entries.sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

function loadExcludeList(): string[] {
  try {
    const raw = readFileSync(EXCLUDE_PATH, "utf8");
    const parsed = parseYaml(raw) as { repos_to_exclude?: string[] };
    return parsed?.repos_to_exclude ?? [];
  } catch {
    return [];
  }
}

function loadFeaturedRepos(): Set<string> {
  try {
    const career = JSON.parse(readFileSync(CAREER_PATH, "utf8")) as {
      projects?: Array<{ repo?: string }>;
    };
    const featured = new Set<string>();
    for (const p of career.projects ?? []) {
      if (p.repo) featured.add(p.repo.toLowerCase());
    }
    return featured;
  } catch {
    return new Set();
  }
}

async function main() {
  console.log(`📡 Syncing GitHub repos for @${GITHUB_USERNAME}…`);

  const excludeList = loadExcludeList();
  const featuredRepos = loadFeaturedRepos();

  // Paginate — fetch up to 5 pages (500 repos max)
  const allRaw: RawRepo[] = [];
  for (let page = 1; page <= 5; page++) {
    const batch = await fetchJson<RawRepo[]>(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?type=public&per_page=100&page=${page}`,
    );
    allRaw.push(...batch);
    if (batch.length < 100) break;
  }

  console.log(`   Found ${allRaw.length} public repos.`);

  // Filter
  const filtered = allRaw.filter(
    (r) =>
      !r.private &&
      !excludeList.includes(r.name),
  );

  console.log(`   After exclusions: ${filtered.length} repos.`);

  // Enrich with languages (batched to avoid rate limits)
  const repos: GithubRepo[] = [];
  for (const raw of filtered) {
    const languages = await fetchLanguages(raw.full_name);

    repos.push({
      name: raw.name,
      full_name: raw.full_name,
      description: raw.description,
      languages,
      primary_language: primaryLanguage(languages) ?? raw.language,
      stargazers_count: raw.stargazers_count,
      forks_count: raw.forks_count,
      topics: raw.topics,
      pushed_at: raw.pushed_at,
      homepage: raw.homepage,
      html_url: raw.html_url,
      is_featured: featuredRepos.has(raw.full_name.toLowerCase()),
    });

    // Small delay to respect rate limits (5000 req/hr for authed requests)
    await new Promise((r) => setTimeout(r, 50));
  }

  // Sort: featured first, then by star count desc
  repos.sort((a, b) => {
    if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
    return b.stargazers_count - a.stargazers_count;
  });

  const output: GithubData = {
    updated_at: new Date().toISOString(),
    repos,
  };

  writeFileSync(OUT_PATH, JSON.stringify(output, null, 2), "utf8");
  console.log(`✅  Wrote ${repos.length} repos to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error("❌ ", err);
  process.exit(1);
});
