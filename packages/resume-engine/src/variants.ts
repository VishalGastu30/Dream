import type { ResumeProfile } from "@dream/schema";

export interface BulletItem {
  text: string;
  tags?: string[];
  variants?: Record<string, string>;
}

/**
 * Resolves the correct variant of a bullet point based on the resume profile.
 *
 * Logic:
 * 1. If `bullet.variants` has a key exactly matching `profile.id`, use it.
 * 2. If it has a key matching `profile.summaryVariant`, use that.
 * 3. Fallback to `bullet.text`.
 */
export function resolveBulletVariant(bullet: BulletItem, profile: ResumeProfile): string {
  if (bullet.variants) {
    if (bullet.variants[profile.id] !== undefined) {
      return bullet.variants[profile.id] as string;
    }

    if (profile.summaryVariant && bullet.variants[profile.summaryVariant] !== undefined) {
      return bullet.variants[profile.summaryVariant] as string;
    }
  }

  return bullet.text;
}

/**
 * Resolves all bullets for a given item. Optionally filters out bullets
 * that are highly irrelevant to the profile (e.g. if the bullet has tags but none match).
 * Currently just resolves text for all bullets.
 */
export function resolveAllBullets(
  bullets: BulletItem[] | undefined,
  profile: ResumeProfile,
): string[] {
  if (!bullets || bullets.length === 0) return [];

  return bullets.map((b) => resolveBulletVariant(b, profile));
}
