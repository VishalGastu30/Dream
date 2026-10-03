import { z } from "zod";

export const StoryChapter = z.object({
  schemaVersion: z.literal(1),
  chapter: z.number().int().min(0).max(7),
  slug: z.string().min(1),
  title: z.string().min(1),
  tagline: z.string().max(120),
  status: z.enum(["draft", "published", "archived"]),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type StoryChapter = z.infer<typeof StoryChapter>;
