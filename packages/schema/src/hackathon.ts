import { z } from "zod";
import { Id, DateRange, Visibility, Link } from "./shared.js";

export const Hackathon = z.object({
  schemaVersion: z.literal(1),
  id: Id,
  name: z.string().min(2),
  organizer: z.string().min(2),
  result: z.enum(["Winner", "Runner-up", "Finalist", "Participant", "Other"]),
  teamSize: z.number().int().positive(),
  period: DateRange,
  status: z.enum(["draft", "published", "archived"]),
  tags: z.array(z.string()).default([]),
  projectTitle: z.string().optional(),
  links: z.array(Link).default([]),
  visibility: Visibility,
  resumeWeight: z.number().min(0).max(5).default(1),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type Hackathon = z.infer<typeof Hackathon>;
