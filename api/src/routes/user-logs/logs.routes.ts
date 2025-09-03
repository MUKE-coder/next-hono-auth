/* eslint-disable style/comma-dangle */
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import {
  createErrorSchema,
  createMessageObjectSchema
} from "stoker/openapi/schemas";

import { NotFoundSchema } from "@/lib/constants";

import {
  CreateUserLogSchema,
  UserIdParamSchema,
  UserLogQuerySchema,
  UserLogSchema
} from "./logs.schema";

const tags = ["User Logs"];

export const create = createRoute({
  path: "/user-logs",
  method: "post",
  tags,
  summary: "Create a user log",
  description: "Create a new user activity log entry",
  request: {
    body: jsonContentRequired(CreateUserLogSchema, "User log data to create")
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      createMessageObjectSchema("Log Created successfully"),
      "The created user log"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("User not found"),
      "User not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(CreateUserLogSchema),
      "Validation errors"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema("Failed to create user log"),
      "Internal server error"
    )
  }
});

export const list = createRoute({
  path: "/user-logs/{userId}",
  method: "get",
  tags,
  summary: "Get user logs for a specific user",
  description:
    "Retrieve user activity logs for a specific user for the specified period (default: last 90 days)",
  request: {
    params: UserIdParamSchema,
    query: UserLogQuerySchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(UserLogSchema),
      "List of user logs for the specified user"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(NotFoundSchema, "User not found"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema("Failed to fetch user logs"),
      "Internal server error"
    )
  }
});

export type CreateRoute = typeof create;
export type ListRoute = typeof list;
