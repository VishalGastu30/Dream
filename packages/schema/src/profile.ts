import { z } from "zod";
import { Id } from "./shared.js";

export const Profile = z.object({
  schemaVersion: z.literal(1),
  id: Id,
  name: z.string().min(2),
  displayName: z.string().min(2),
  title: z.string().min(2),
  email: z.string().email(),
  location: z.string().min(2),
  openToOpportunities: z.boolean().default(true),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().url().optional(),
  tagline: z.string().min(10),
  summaries: z.record(z.string(), z.string().min(10)),
  bio: z.object({
    short: z.string().min(10),
    long: z.string().min(10),
  }),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type Profile = z.infer<typeof Profile>;
