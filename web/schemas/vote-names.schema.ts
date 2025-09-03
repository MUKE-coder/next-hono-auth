import { z } from "zod";

// List query schemas
export const voteNamesSchema = z.object({
  name         :z.string(),
  code         :z.number(),
  regionId     :z.string(),
});

export type VoteNameFormTypes = z.infer<typeof voteNamesSchema>;