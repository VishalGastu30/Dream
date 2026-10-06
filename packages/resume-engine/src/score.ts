import type { ResumeProfile } from "@dream/schema";

export interface ScorableItem {
  id: string;
  tags?: string[];
  resumeWeight?: number;
  [key: string]: unknown;
}

/**
 * Calculates a match score for an item against a specific resume profile.
 *
 * Logic:
 * 1. If the item has no tags, it gets a baseline score of 0.1 * resumeWeight.
 * 2. If it has tags, sum the weights from the profile for matching tags.
 * 3. Unrecognized tags add 0 to the sum.
 * 4. Multiply the total by the item's inherent `resumeWeight` (default 1.0).
 */
export function scoreItem(item: ScorableItem, profile: ResumeProfile): number {
  const baseWeight = item.resumeWeight ?? 1.0;

  if (!item.tags || item.tags.length === 0) {
    return 0.1 * baseWeight;
  }

  let tagSum = 0;
  for (const tag of item.tags) {
    if (profile.tagWeights[tag] !== undefined) {
      tagSum += profile.tagWeights[tag];
    }
  }

  // If tags exist but none match the profile, give a tiny score so it's not 0
  if (tagSum === 0) {
    return 0.05 * baseWeight;
  }

  return tagSum * baseWeight;
}
