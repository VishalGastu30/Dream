import { z } from "zod";
import { Id } from "./shared.js";

export const ResumeProfile = z.object({
  schemaVersion: z.literal(1),
  id: Id,
  label: z.string().min(2),
  targetPages: z.number().int().positive().default(1),
  tagWeights: z.record(z.string(), z.number()),
  sectionLimits: z.object({
    projects: z.number().int().min(0).optional(),
    experience: z.number().int().min(0).optional(),
    certifications: z.number().int().min(0).optional(),
    achievements: z.number().int().min(0).optional(),
    skills: z.number().int().min(0).optional(),
  }),
  pin: z.array(z.string()).default([]),
  exclude: z.array(z.string()).default([]),
  summaryVariant: z.string(),
});

export type ResumeProfile = z.infer<typeof ResumeProfile>;
