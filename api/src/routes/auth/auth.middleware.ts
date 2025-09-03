/* eslint-disable style/comma-dangle */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable style/brace-style */
import type { Context, Next } from "hono";
import { sign, verify } from "hono/jwt";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppBindings, ContextUser } from "@/lib/types";
import { getPrisma } from "prisma/db";
import type { TokenPayload } from "./auth.schema";
import { validateTokenPayload } from "./auth.schema";

// Token configuration
const ACCESS_TOKEN_EXPIRY = 30 * 60; // 15 minutes
const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60; // 30 days

/**
 * Enhanced middleware to authenticate requests using JWT tokens
 */
export async function authMiddleware(c: Context<AppBindings>, next: Next) {
  const prisma = getPrisma(c.env.DATABASE_URL);

  // Get the authorization header
  const authHeader = c.req.header("Authorization");

  // Check if authorization header exists and has the right format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json(
      {
        message: "Unauthorized - No token provided",
        code: "NO_TOKEN"
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Extract the token
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    const rawDecoded = await verify(token, c.env.ACCESS_TOKEN_SECRET);
    const decoded = validateTokenPayload(rawDecoded);

    // Extract user ID from the token
    const userId = decoded.userId;

    // Optimized query to get user with minimal data needed for auth
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        isVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return c.json(
        {
          message: "Unauthorized - User not found",
          code: "USER_NOT_FOUND"
        },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    // Check if user is active
    if (user.status !== "ACTIVE") {
      return c.json(
        {
          message: "Unauthorized - Account is not active",
          code: "ACCOUNT_INACTIVE",
          status: user.status
        },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    // Add user to the request context for use in subsequent handlers
    c.set("currentUser", user as ContextUser);

    // Continue to the next middleware or route handler
    await next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return c.json(
      {
        message: "Unauthorized - Invalid token",
        code: "INVALID_TOKEN"
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }
}

/**
 * Middleware to check if a user has the required role
 * @param requiredRoles - Array of role strings required for the action
 */
export function checkRoles(requiredRoles: string[]) {
  return async (c: Context<AppBindings>, next: Next) => {
    // Get user from context (set by authMiddleware)
    const user = c.get("currentUser");

    if (!user) {
      return c.json(
        {
          message: "Unauthorized - Authentication required",
          code: "AUTH_REQUIRED"
        },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    // Check if user has one of the required roles
    const hasRequiredRole = requiredRoles.includes(user.role);

    if (!hasRequiredRole) {
      return c.json(
        {
          message: "Forbidden - Insufficient permissions",
          code: "INSUFFICIENT_PERMISSIONS",
          requiredRoles,
          userRole: user.role
        },
        HttpStatusCodes.FORBIDDEN
      );
    }

    // User has the required role, continue
    await next();
  };
}

/**
 * Generate an access token for a user
 * @param payload - The token payload
 * @param secret - JWT secret for access tokens
 * @returns The JWT access token string
 */
export async function generateAccessToken(
  payload: TokenPayload,
  secret: string
): Promise<string> {
  const accessTokenPayload = {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    schoolId: payload.schoolId,
    sub: payload.userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXPIRY
  };

  return await sign(accessTokenPayload, secret);
}

/**
 * Generate a refresh token for a user
 * @param payload - The token payload
 * @param secret - JWT secret for refresh tokens
 * @returns The JWT refresh token string
 */
export async function generateRefreshToken(
  payload: TokenPayload,
  secret: string
): Promise<string> {
  const refreshTokenPayload = {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    schoolId: payload.schoolId,
    sub: payload.userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + REFRESH_TOKEN_EXPIRY
  };

  return await sign(refreshTokenPayload, secret);
}

/**
 * Verify refresh token
 * @param token - The refresh token to verify
 * @param secret - JWT secret for refresh tokens
 * @returns The decoded token payload
 */
export async function verifyRefreshToken(
  token: string,
  secret: string
): Promise<TokenPayload> {
  try {
    const rawDecoded = await verify(token, secret);
    return validateTokenPayload(rawDecoded);
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
}
