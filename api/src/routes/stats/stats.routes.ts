import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

import { NotAuthorizedSchema } from "@/lib/constants";

import {
  ItemBriefSchema,
  ItemsResponseSchema,
  StatsResponseSchema,
} from "./stats.schema";

// UserId parameter schema for filtering by user
export const UserIdParamSchema = z.object({
  userId: z
    .string()
    .min(24)
    .openapi({
      param: {
        name: "userId",
        in: "path",
      },
      example: "00b4766213f0732810a29d8a",
    }),
});

const tags = ["Stats"];
export const list = createRoute({
  path: "/stats",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(StatsResponseSchema, "Stats Object"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      NotAuthorizedSchema,
      "You need to be Authenticated to View Stats"
    ),
  },
});
export const briefItems = createRoute({
  path: "/stats/brief-items",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      ItemsResponseSchema,
      "Brief item Options"
    ),
  },
});
export type ListRoute = typeof list;
export type BriefItemsRoute = typeof briefItems;
