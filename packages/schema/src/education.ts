import { z } from "zod";
import { Id, DateRange, Visibility } from "./shared.js";

export const Education = z.object({
  schemaVersion: z.literal(1),
  id: Id,
  degree: z.string().min(2),
  institution: z.string().min(2),
  institutionUrl: z.string().url().optional(),
  location: z.string().min(2),
  period: DateRange,
  gpa: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  tags: z.array(z.string()).default([]),
  visibility: Visibility,
  highlights: z.array(z.string()).default([]),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type Education = z.infer<typeof Education>;
