import { z } from "zod";
import { Id, DateRange, Visibility } from "./shared.js";

export const Certification = z.object({
  schemaVersion: z.literal(1),
  id: Id,
  title: z.string().min(2),
  issuer: z.string().min(2),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url().optional(),
  period: DateRange,
  status: z.enum(["draft", "published", "archived"]),
  tags: z.array(z.string()).default([]),
  visibility: Visibility,
  resumeWeight: z.number().min(0).max(5).default(1),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type Certification = z.infer<typeof Certification>;
