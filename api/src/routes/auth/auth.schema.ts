/* eslint-disable style/comma-dangle */
import { z } from "zod";

// Login schema
export const LoginSchema = z
  .object({
    loginMethod: z.enum(["email", "phone"], {
      required_error: "Please select a login method"
    }),
    identifier: z.string().min(1, "This field is required"),
    password: z.string().min(6, "Password must be at least 6 characters")
  })
  .refine(
    (data) => {
      // Validate identifier based on login method
      if (data.loginMethod === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(data.identifier);
      }
      return true;
    },
    {
      message: "Please enter a valid email address or Phone Number",
      path: ["identifier"] // Point error to the identifier field
    }
  );

// Schema for forgot password request
export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address")
});

// Schema for reset password
export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirmation password must be at least 6 characters")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

// Refresh token schema
export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required")
});

// Logout schema
export const LogoutSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required")
});

// Simplified user data schema for login response (NO PROFILE DATA)
export const UserDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  role: z.enum(["MEMBER", "ADMIN"]),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING"]),
  isVerified: z.boolean(),
  image: z.string().nullable().optional(),
  createdAt: z.string(), // Changed to string for JSON serialization
  updatedAt: z.string() // Changed to string for JSON serialization
});

// Session info schema
export const SessionInfoSchema = z.object({
  expiresAt: z.string(),
  refreshExpiresAt: z.string()
});

// Enhanced login response schema
export const LoginResponseSchema = z.object({
  user: UserDataSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
  session: SessionInfoSchema
});

// Refresh token response schema
export const RefreshTokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string()
});

// Error response schema
export const AuthErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  status: z.string().optional()
});

// Success message schema
export const SuccessMessageSchema = z.object({
  message: z.string()
});

// Token verification response schema (simplified)
export const TokenVerificationSchema = z.object({
  message: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    role: z.string(),
    status: z.string(),
    isVerified: z.boolean(),
    image: z.string().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string()
  })
});

// Change password schema
export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirmation password must be at least 6 characters")
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"]
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"]
  });

// Type definitions
export type LoginInput = z.infer<typeof LoginSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
export type LogoutInput = z.infer<typeof LogoutSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;
export type UserData = z.infer<typeof UserDataSchema>;

export type SessionInfo = z.infer<typeof SessionInfoSchema>;

// Enhanced token payload interface with school context
export interface TokenPayload extends Record<string, any> {
  userId: string;
  email: string;
  role: string;
  schoolId?: string | null;
  sub: string;
  iat: number;
  exp: number;
}

// Helper function to validate and convert JWTPayload to TokenPayload
export function validateTokenPayload(payload: any): TokenPayload {
  if (!payload.userId || !payload.email || !payload.role || !payload.sub) {
    throw new Error("Invalid token payload structure");
  }

  return {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    schoolId: payload.schoolId || null,
    sub: payload.sub,
    iat: payload.iat || Math.floor(Date.now() / 1000),
    exp: payload.exp || Math.floor(Date.now() / 1000) + 15 * 60
  };
}

// Create user schema for user creation/registration
export const CreateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "MEMBER"]),
  schoolId: z.string().optional(), // Optional for SUPER_ADMIN creation
  status: z
    .enum(["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING"])
    .default("PENDING")
});
// Update user schema
export const UpdateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .optional(),
  role: z.enum(["ADMIN", "MEMBER"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING"]).optional(),
  image: z.string().nullable().optional()
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
