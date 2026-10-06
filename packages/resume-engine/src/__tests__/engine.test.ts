import type { ResumeProfile } from "@dream/schema";
import { describe, expect, it } from "vitest";
import { scoreItem } from "../score.js";
import { selectItems } from "../select.js";
import { resolveBulletVariant } from "../variants.js";

describe("Resume Engine: Scoring", () => {
  const profile = {
    id: "ai-engineer",
    tagWeights: { ai: 1.0, backend: 0.5 },
  } as unknown as ResumeProfile;

  it("scores items based on tags", () => {
    expect(scoreItem({ id: "1", tags: ["ai"] }, profile)).toBe(1.0);
    expect(scoreItem({ id: "2", tags: ["backend"] }, profile)).toBe(0.5);
    expect(scoreItem({ id: "3", tags: ["ai", "backend"] }, profile)).toBe(1.5);
  });

  it("multiplies by resumeWeight", () => {
    expect(scoreItem({ id: "1", tags: ["ai"], resumeWeight: 2 }, profile)).toBe(2.0);
  });

  it("gives small baseline to items with no matching tags", () => {
    expect(scoreItem({ id: "1", tags: ["frontend"] }, profile)).toBe(0.05);
  });
});

describe("Resume Engine: Selection", () => {
  const profile = {
    id: "ai-engineer",
    tagWeights: { ai: 1.0, backend: 0.5 },
    pin: ["item-4"],
    exclude: ["item-5"],
  } as unknown as ResumeProfile;

  const items = [
    { id: "item-1", tags: ["backend"] }, // score 0.5
    { id: "item-2", tags: ["ai"] }, // score 1.0
    { id: "item-3", tags: ["ai", "backend"] }, // score 1.5
    { id: "item-4", tags: ["unrelated"] }, // score 0.05 (pinned)
    { id: "item-5", tags: ["ai", "backend"] }, // score 1.5 (excluded)
  ];

  it("selects and sorts correctly respecting pins and excludes", () => {
    const selected = selectItems(items, profile);

    // item-5 is excluded, so length should be 4
    expect(selected).toHaveLength(4);

    // Pinned item should be first
    expect(selected[0]?.id).toBe("item-4");

    // The rest should be sorted by score descending
    expect(selected[1]?.id).toBe("item-3"); // 1.5
    expect(selected[2]?.id).toBe("item-2"); // 1.0
    expect(selected[3]?.id).toBe("item-1"); // 0.5
  });

  it("limits output", () => {
    const selected = selectItems(items, profile, 2);
    expect(selected).toHaveLength(2);
    expect(selected[0]?.id).toBe("item-4");
    expect(selected[1]?.id).toBe("item-3");
  });
});

describe("Resume Engine: Variants", () => {
  const profile = {
    id: "ai-engineer",
    summaryVariant: "backend-engineer",
  } as unknown as ResumeProfile;

  it("uses specific profile match first", () => {
    const bullet = {
      text: "Default text",
      variants: {
        "ai-engineer": "AI text",
        "backend-engineer": "Backend text",
      },
    };
    expect(resolveBulletVariant(bullet, profile)).toBe("AI text");
  });

  it("falls back to summaryVariant if specific match missing", () => {
    const bullet = {
      text: "Default text",
      variants: {
        "backend-engineer": "Backend text",
      },
    };
    expect(resolveBulletVariant(bullet, profile)).toBe("Backend text");
  });

  it("falls back to default text if no variants match", () => {
    const bullet = {
      text: "Default text",
      variants: {
        "frontend-engineer": "Frontend text",
      },
    };
    expect(resolveBulletVariant(bullet, profile)).toBe("Default text");
  });
});
