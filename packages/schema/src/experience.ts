import { z } from "zod";
import { Id, DateRange, Visibility, Bullet } from "./shared.js";

export const Experience = z.object({
  schemaVersion: z.literal(1),
  id: Id,
  title: z.string().min(2),
  organization: z.string().min(2),
  organizationUrl: z.string().url().optional(),
  location: z.string().min(2),
  type: z.enum(["internship", "full-time", "part-time", "contract", "freelance"]),
  period: DateRange,
  status: z.enum(["draft", "published", "archived"]),
  tags: z.array(z.string()).default([]),
  visibility: Visibility,
  resumeWeight: z.number().min(0).max(5).default(1),
  bullets: z.array(Bullet).default([]),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type Experience = z.infer<typeof Experience>;
