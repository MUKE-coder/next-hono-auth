import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { BaseInviteSchema, IdParamSchema } from "./invite.schema";

const tags = ["Invites"];

const ErrorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  code: z.string()
});

const ConflictErrorSchema = z.object({
  success: z.boolean().default(false),
  message: z.string(),
  code: z.string()
});

const inviteResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  error: z.string().optional(),
  data: z
    .object({
      id: z.string(),
      invitedBy: z.string()
    })
    .optional()
});

const InviteQuerySchema = z.object({
  email: z
    .string()
    .email()
    .openapi({
      param: {
        name: "email",
        in: "query"
      },
      example: "kiskayemoses.gmail.com"
    })
});

export const getInviteInfo = createRoute({
  path: "/users/invites/{code}",
  method: "get",
  tags,
  summary: "Get User Invite",
  description: "Retrieve a specific user invite by the invite code",
  request: {
    params: IdParamSchema,
    query: InviteQuerySchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(BaseInviteSchema, "Invite details"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      ErrorResponseSchema,
      "Invite Info not found"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      ErrorResponseSchema,
      "Internal server error"
    )
  }
});

export const invite = createRoute({
  path: "/users/invites",
  method: "post",
  tags,
  summary: "Create a new invite",
  description: "Create a new invite with required fields",
  request: {
    body: jsonContentRequired(BaseInviteSchema, "Invite data")
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      inviteResponseSchema,
      "Invite sent successfully to the email address"
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      ConflictErrorSchema,
      "Code already exists"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      ErrorResponseSchema,
      "Invalid input data"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      ErrorResponseSchema,
      "Internal server error"
    ),
    [HttpStatusCodes.NETWORK_AUTHENTICATION_REQUIRED]: jsonContent(
      ErrorResponseSchema,
      "Failed to send email using resend"
    )
  }
});

export type GetInviteRoute = typeof getInviteInfo;
export type CreateInviteRoute = typeof invite;
