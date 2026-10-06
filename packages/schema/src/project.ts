import { z } from "zod";
import { Bullet, DateRange, Id, Link, Media, Visibility } from "./shared.js";

export const Project = z.object({
  schemaVersion: z.literal(1),
  id: Id,
  title: z.string().min(2).max(80),
  tagline: z.string().max(120),
  status: z.enum(["draft", "published", "archived"]),
  period: DateRange,
  tags: z.array(z.string()).min(1),
  stack: z.array(z.string()).min(1),
  repo: z.string().optional(),
  links: z.array(Link).default([]),
  visibility: Visibility,
  resumeWeight: z.number().min(0).max(5).default(1),
  bullets: z.array(Bullet).default([]),
  scene: z
    .object({
      artifact: z.string(),
      accent: z.string().optional(),
    })
    .optional(),
  media: z.array(Media).default([]),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type Project = z.infer<typeof Project>;
