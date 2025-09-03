import { z } from "zod";

export const resourceResponseSchema = z.object({
  id: z.string(),
});
