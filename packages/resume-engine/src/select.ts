import type { ResumeProfile } from "@dream/schema";
import { type ScorableItem, scoreItem } from "./score";

/**
 * Selects and orders the best items for a specific section based on the profile.
 *
 * Rules:
 * 1. Excludes items listed in `profile.exclude`.
 * 2. Pins items listed in `profile.pin` (they bypass limits and sorting, always appear first).
 * 3. Sorts the rest by their match score descending.
 * 4. Trims the final list to `limit` (if provided), ensuring pinned items are kept.
 */
export function selectItems<T extends ScorableItem>(
  items: T[],
  profile: ResumeProfile,
  limit?: number,
): T[] {
  const excludedIds = new Set(profile.exclude || []);
  const pinnedIds = new Set(profile.pin || []);

  // Filter out excludes
  const validItems = items.filter((item) => !excludedIds.has(item.id));

  const pinnedItems: T[] = [];
  const scorables: { item: T; score: number }[] = [];

  for (const item of validItems) {
    if (pinnedIds.has(item.id)) {
      pinnedItems.push(item);
    } else {
      scorables.push({
        item,
        score: scoreItem(item, profile),
      });
    }
  }

  // Sort by score descending
  scorables.sort((a, b) => b.score - a.score);

  const selectedUnpinned = scorables.map((s) => s.item);

  const combined = [...pinnedItems, ...selectedUnpinned];

  if (limit !== undefined && limit > 0) {
    return combined.slice(0, limit);
  }

  return combined;
}
