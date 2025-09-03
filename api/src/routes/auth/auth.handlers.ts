/* eslint-disable style/operator-linebreak */
/* eslint-disable style/indent */
/* eslint-disable perfectionist/sort-named-imports */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable style/comma-dangle */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable style/brace-style */
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { v4 as uuidv4 } from "uuid";

import type { AppRouteHandler } from "@/lib/types";
import { getPrisma } from "prisma/db";

import type {
  LoginRoute,
  LogoutRoute,
  RefreshTokenRoute,
  ForgotPasswordRoute,
  ResetPasswordRoute,
  VerifyTokenRoute
} from "./auth.routes";

import type {
  TokenPayload,
  LoginResponse,
  UserData,
  SessionInfo
} from "./auth.schema";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from "./auth.middleware";

// Types for enhanced login response
interface LoginAttemptLog {
  email: string;
  success: boolean;
  ipAddress?: string;
  userAgent?: string;
  failureReason?: string;
  timestamp: Date;
}

interface OptimizedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  isVerified: boolean;
  image: string | null;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
}
// Enhanced refresh token handler
export const login: AppRouteHandler<LoginRoute> = async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const { identifier, loginMethod, password } = c.req.valid("json");
  console.log(identifier, loginMethod, password);

  try {
    // Build where clause based on login method
    let whereClause: { email?: string; phone?: string } = {};

    if (loginMethod === "email") {
      whereClause.email = identifier;
    } else if (loginMethod === "phone") {
      whereClause.phone = identifier;
    } else {
      return c.json(
        {
          message: "Invalid login method. Please use email or NIN.",
          code: "INVALID_LOGIN_METHOD"
        },
        HttpStatusCodes.BAD_REQUEST
      );
    }

    const user = (await prisma.user.findUnique({
      where: whereClause as any,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        nin: true, // Added NIN to selection
        role: true,
        status: true,
        isVerified: true,
        image: true,
        password: true,
        createdAt: true,
        updatedAt: true
      }
    })) as OptimizedUser | null;

    console.log(user);
    // Check if user exists
    if (!user) {
      return c.json(
        {
          message: `Invalid ${
            loginMethod === "email" ? "email" : "NIN"
          } or password`,
          code: "INVALID_CREDENTIALS"
        },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    // Check if user has a password
    if (!user.password) {
      return c.json(
        {
          message: "This account cannot be accessed with password login",
          code: "NO_PASSWORD"
        },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      return c.json(
        {
          message: `Invalid ${
            loginMethod === "email" ? "email" : "NIN"
          } or password`,
          code: "INVALID_CREDENTIALS"
        },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    // Check user status
    if (user.status !== "ACTIVE") {
      return c.json(
        {
          message: "Your Account is not active. Please contact administrator.",
          code: "ACCOUNT_INACTIVE",
          status: user.status
        },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    // Create enhanced token payload
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      sub: user.id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
    };

    // Generate tokens
    const accessToken = await generateAccessToken(
      tokenPayload,
      c.env.ACCESS_TOKEN_SECRET
    );
    const refreshToken = await generateRefreshToken(
      tokenPayload,
      c.env.REFRESH_TOKEN_SECRET
    );

    // Store refresh token in database with transaction for consistency
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    });

    // Build simplified response data (NO PROFILE DATA)
    const userData: UserData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role as any,
      status: user.status as any,
      isVerified: user.isVerified,
      image: user.image,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };

    const sessionInfo: SessionInfo = {
      expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 Day
      refreshExpiresAt: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString() // 30 days
    };

    const response: LoginResponse = {
      user: userData,
      accessToken,
      refreshToken,
      session: sessionInfo
    };

    return c.json(response, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Login error:", error);

    return c.json(
      {
        message: "Something went wrong during login",
        code: "SYSTEM_ERROR"
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
export const refreshToken: AppRouteHandler<RefreshTokenRoute> = async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const { refreshToken } = c.req.valid("json");

  try {
    // Verify refresh token
    const decoded = await verifyRefreshToken(
      refreshToken,
      c.env.REFRESH_TOKEN_SECRET
    );

    // Check if refresh token exists in database and is not revoked
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            status: true
          }
        }
      }
    });

    if (!storedToken || storedToken.revoked) {
      return c.json(
        {
          message: "Invalid refresh token",
          code: "INVALID_REFRESH_TOKEN"
        },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    // Check if token is expired
    if (storedToken.expiresAt < new Date()) {
      // Remove expired token
      await prisma.refreshToken.delete({
        where: { id: storedToken.id }
      });

      return c.json(
        {
          message: "Refresh token expired",
          code: "REFRESH_TOKEN_EXPIRED"
        },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    // Check if user is still active
    if (storedToken.user.status !== "ACTIVE") {
      return c.json(
        {
          message: "User account is not active",
          code: "ACCOUNT_INACTIVE"
        },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    // Create new token payload
    const tokenPayload: TokenPayload = {
      userId: storedToken.user.id,
      email: storedToken.user.email || "",
      role: storedToken.user.role,
      sub: storedToken.user.id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
    };

    // Generate new tokens
    const newAccessToken = await generateAccessToken(
      tokenPayload,
      c.env.ACCESS_TOKEN_SECRET
    );
    const newRefreshToken = await generateRefreshToken(
      tokenPayload,
      c.env.REFRESH_TOKEN_SECRET
    );

    // Update refresh token in database
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: {
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    });

    return c.json(
      {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Refresh token error:", error);
    return c.json(
      {
        message: "Invalid refresh token",
        code: "INVALID_REFRESH_TOKEN"
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }
};

export const logout: AppRouteHandler<LogoutRoute> = async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const { refreshToken } = c.req.valid("json");

  try {
    // Find and revoke the refresh token
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken }
    });

    if (storedToken) {
      await prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revoked: true }
      });
    }

    return c.json(
      {
        message: "Logged out successfully"
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Logout error:", error);
    return c.json(
      {
        message: "Error during logout",
        code: "LOGOUT_ERROR"
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const forgotPassword: AppRouteHandler<ForgotPasswordRoute> = async (
  c
) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const { email } = c.req.valid("json");

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true
      }
    });

    // Check if user exists, but don't reveal this information in the response
    if (!user) {
      // Still return success to prevent email enumeration attacks
      return c.json(
        {
          message:
            "If your email is registered, you will receive a password reset link shortly"
        },
        HttpStatusCodes.OK
      );
    }

    // Generate a unique reset token
    const resetToken = uuidv4();
    const resetExpiry = new Date(Date.now() + 3600000); // Token expires in 1 hour

    // Save the token to the user record
    await prisma.user.update({
      where: { id: user.id },
      data: {
        token: resetToken,
        resetExpiry
      }
    });

    // Construct the reset URL
    const resetUrl = `${
      c.env.FRONTEND_URL
    }/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(
      email
    )}`;

    console.log("Reset Link ✅✅✅✅✅✅✅✅✅:", resetUrl);

    const resend = new Resend(c.env.RESEND_API_KEY || "");

    // Send email with reset link using Resend
    await resend.emails.send({
      from: "Password <invite@desishub.com>",
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Reset Your Password</h1>
          <p>Hello ${user.name},</p>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="background-color: #FF0000; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          <p style="margin-top: 20px;">This link is valid for 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    });

    return c.json(
      {
        message:
          "If your email is registered, you will receive a password reset link shortly"
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error sending reset email:", error);
    return c.json(
      {
        message: "Failed to send reset email. Please try again later.",
        code: "EMAIL_SEND_ERROR"
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const resetPassword: AppRouteHandler<ResetPasswordRoute> = async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const { token, password } = c.req.valid("json");

  try {
    // Find user by reset token
    const user = await prisma.user.findFirst({
      where: {
        token,
        resetExpiry: {
          gt: new Date() // Token must not be expired
        }
      }
    });

    // Check if user exists and token is valid
    if (!user) {
      return c.json(
        {
          message: "Invalid or expired token",
          code: "INVALID_RESET_TOKEN"
        },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(12); // Increased salt rounds for better security
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user password and clear the token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        token: null,
        resetExpiry: null
      }
    });

    // Revoke all existing refresh tokens for security
    await prisma.refreshToken.updateMany({
      where: { userId: user.id },
      data: { revoked: true }
    });

    return c.json(
      {
        message: "Password has been updated successfully"
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return c.json(
      {
        message: "Something went wrong during password reset",
        code: "RESET_PASSWORD_ERROR"
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const verifyToken: AppRouteHandler<VerifyTokenRoute> = async (c) => {
  // The actual token verification is done by the auth middleware
  // If we got here, the token is valid
  const user = c.get("currentUser");

  if (!user) {
    return c.json(
      {
        message: "Unauthorized - User not found in context",
        code: "USER_NOT_IN_CONTEXT"
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  return c.json(
    {
      message: "Token is valid",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        isVerified: user.isVerified,
        image: user.image,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      }
    },
    HttpStatusCodes.OK
  );
};
