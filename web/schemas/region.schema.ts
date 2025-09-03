import { z } from "zod";

// List query schemas
export const regionSchema = z.object({
  name         :z.string(),
  coordinator  :z.string(),
  contact      :z.string().optional(),
  email        :z.string().optional(),
});

export type RegionFormTypes = z.infer<typeof regionSchema>;