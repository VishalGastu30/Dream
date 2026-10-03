import { z } from "zod";

// All IDs: kebab-case, lowercase, never reused
export const Id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
  message: "ID must be kebab-case lowercase (e.g. 'my-project')",
});

export const YearMonth = z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, {
  message: "Date must be YYYY-MM or YYYY-MM-DD",
});

export const DateRange = z.object({
  start: YearMonth,
  end: YearMonth.nullable().default(null),
});

export const Visibility = z.object({
  website: z.boolean().default(true),
  resume: z.boolean().default(true),
  timeline: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export const Link = z.object({
  label: z.string().min(1),
  url: z.string().url(),
});

export const Media = z.object({
  type: z.enum(["image", "video"]),
  src: z.string().startsWith("/"),   // must be a local path, typically /images/...
  alt: z.string().min(10),           // non-trivial alt text required
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const Bullet = z.object({
  text: z.string().min(10).max(220),
  tags: z.array(z.string()).default([]),
  variants: z.record(z.string(), z.string().max(220)).default({}),
});
