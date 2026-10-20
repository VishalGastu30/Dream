/**
 * packages/schema/src/github.ts
 * Zod schema for GitHub repository metadata fetched by scripts/sync-github.ts
 */
import { z } from "zod";

export const GithubRepoSchema = z.object({
  /** Repo slug (e.g. "Dream") */
  name: z.string(),
  /** GitHub full name (e.g. "VishalGastu30/Dream") */
  full_name: z.string(),
  description: z.string().nullable(),
  /** Language breakdown: { TypeScript: 12345, CSS: 4321 } (bytes) */
  languages: z.record(z.string(), z.number()).default({}),
  /** Primary language (most bytes) */
  primary_language: z.string().nullable(),
  stargazers_count: z.number().default(0),
  forks_count: z.number().default(0),
  topics: z.array(z.string()).default([]),
  pushed_at: z.string().nullable(),
  homepage: z.string().nullable(),
  html_url: z.string(),
  /** Whether the repo matches a project entry in career.json */
  is_featured: z.boolean().default(false),
});

export type GithubRepo = z.infer<typeof GithubRepoSchema>;

export const GithubDataSchema = z.object({
  updated_at: z.string(),
  repos: z.array(GithubRepoSchema),
});

export type GithubData = z.infer<typeof GithubDataSchema>;
