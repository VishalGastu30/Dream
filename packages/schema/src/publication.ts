import { z } from "zod";
import { DateRange, Id, Link, Visibility } from "./shared.js";

export const Publication = z.object({
  schemaVersion: z.literal(1),
  id: Id,
  title: z.string().min(2),
  publisher: z.string().min(2),
  period: DateRange,
  status: z.enum(["draft", "published", "archived"]),
  tags: z.array(z.string()).default([]),
  visibility: Visibility,
  resumeWeight: z.number().min(0).max(5).default(1),
  description: z.string().optional(),
  links: z.array(Link).default([]),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type Publication = z.infer<typeof Publication>;
