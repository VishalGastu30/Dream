import { z } from "zod";

export const TagVocabulary = z.record(z.string(), z.array(z.string()));

export type TagVocabulary = z.infer<typeof TagVocabulary>;
