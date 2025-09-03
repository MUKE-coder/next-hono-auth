import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { BaseUserProfileSchema, IdParamSchema } from "./tracking.schema";

const tags = ["Users"];

const ErrorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  code: z.string()
});

export const getTrackingInfo = createRoute({
  path: "/users/tracking/{trackingNumber}",
  method: "get",
  tags,
  summary: "Track User Application",
  description: "Retrieve a specific user info by their trackingNumber",
  request: {
    params: IdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(BaseUserProfileSchema, "Info details"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      ErrorResponseSchema,
      "Tracking Info not found"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      ErrorResponseSchema,
      "Internal server error"
    )
  }
});

export type GetTrackingInfoRoute = typeof getTrackingInfo;
