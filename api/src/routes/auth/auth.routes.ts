import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

import {
  AuthErrorSchema,
  ForgotPasswordSchema,
  LoginResponseSchema,
  LoginSchema,
  LogoutSchema,
  RefreshTokenResponseSchema,
  RefreshTokenSchema,
  ResetPasswordSchema,
  SuccessMessageSchema,
  TokenVerificationSchema
} from "./auth.schema";

const tags = ["Authentication"];

import { z } from "zod";

// Enhanced error response schema with error codes
export const EnhancedErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  status: z.string().optional()
});

export const login = createRoute({
  path: "/auth/login",
  method: "post",
  tags,
  summary: "User login ",
  description: [
    "Authenticate user and return access token, refresh token, user data, ",
    "- Admin can login to admin dashboard"
  ].join(" "),
  request: {
    body: jsonContentRequired(LoginSchema, "Login credentials ")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      LoginResponseSchema,
      "User authenticated successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      EnhancedErrorSchema,
      "Authentication failed - various reasons "
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      EnhancedErrorSchema,
      "Invalid input data"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      EnhancedErrorSchema,
      "Internal Server error"
    )
  }
});

export const refreshToken = createRoute({
  path: "/auth/refresh",
  method: "post",
  tags,
  summary: "Refresh access token",
  description:
    "Generate new access and refresh tokens using a valid refresh token",
  request: {
    body: jsonContentRequired(RefreshTokenSchema, "Refresh token")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      RefreshTokenResponseSchema,
      "New tokens generated successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      AuthErrorSchema,
      "Invalid or expired refresh token"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(RefreshTokenSchema),
      "Validation errors"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      AuthErrorSchema,
      "Internal server error"
    )
  }
});

export const logout = createRoute({
  path: "/auth/logout",
  method: "post",
  tags,
  summary: "User logout",
  description: "Revoke refresh token and log out user",
  request: {
    body: jsonContentRequired(LogoutSchema, "Refresh token to revoke")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      SuccessMessageSchema,
      "Logged out successfully"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(LogoutSchema),
      "Validation errors"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      AuthErrorSchema,
      "Error during logout"
    )
  }
});

export const forgotPassword = createRoute({
  path: "/auth/forgot-password",
  method: "post",
  tags,
  summary: "Forgot Password",
  description:
    "Sends a password reset email to the user based on the provided email address.",
  request: {
    body: jsonContentRequired(
      ForgotPasswordSchema,
      "Email address for password reset"
    )
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      SuccessMessageSchema,
      "Password reset email sent"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(ForgotPasswordSchema),
      "Validation errors"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      AuthErrorSchema,
      "Failed to send email"
    )
  }
});

export const resetPassword = createRoute({
  path: "/auth/reset-password",
  method: "post",
  tags,
  summary: "Reset password",
  description: "Reset user password using reset token",
  request: {
    body: jsonContentRequired(ResetPasswordSchema, "Reset password data")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      SuccessMessageSchema,
      "Password updated successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      AuthErrorSchema,
      "Invalid or expired token"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(ResetPasswordSchema),
      "Validation errors"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      AuthErrorSchema,
      "Error during password reset"
    )
  }
});

export const verifyToken = createRoute({
  path: "/auth/verify",
  method: "get",
  tags,
  summary: "Verify access token",
  description: "Verify if the provided access token is valid",
  security: [{ Bearer: [] }],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      TokenVerificationSchema,
      "Token is valid"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      AuthErrorSchema,
      "Invalid or expired token"
    )
  }
});

export type LoginRoute = typeof login;
export type RefreshTokenRoute = typeof refreshToken;
export type LogoutRoute = typeof logout;
export type ForgotPasswordRoute = typeof forgotPassword;
export type ResetPasswordRoute = typeof resetPassword;
export type VerifyTokenRoute = typeof verifyToken;
