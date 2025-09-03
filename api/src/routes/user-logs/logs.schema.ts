/* eslint-disable style/comma-dangle */
// user-logs.schema.ts
import { z } from "zod";

// Base UserLog schema for validation
export const UserLogSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  activity: z.string().min(1, "Activity is required"),
  time: z.string().min(1, "Time is required"),
  ipAddress: z.string().ip("Invalid IP address").optional().nullable(),
  device: z.string().optional().nullable(),
  userId: z.string().min(1, "User ID is required"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

// Simple response schema for create operation
export const CreateUserLogResponseSchema = z.object({
  id: z.string(),
  message: z.string()
});
export const UserIdParamSchema = z.object({
  userId: z
    .string()
    .min(1)
    .openapi({
      param: {
        name: "userId",
        in: "path"
      },
      example: "user123"
    })
});

// Query parameters for filtering (simple - only period in days)
export const UserLogQuerySchema = z
  .object({
    days: z.coerce.number().min(1).max(90).default(90).optional()
  })
  .openapi({
    param: {
      in: "query"
    }
  });

// Schema for creating a new user log (without id, createdAt, updatedAt)
export const CreateUserLogSchema = UserLogSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Type definitions derived from the schemas
export type UserLog = z.infer<typeof UserLogSchema>;
export type CreateUserLogInput = z.infer<typeof CreateUserLogSchema>;
export type CreateUserLogResponse = z.infer<typeof CreateUserLogResponseSchema>;
export type UserLogQuery = z.infer<typeof UserLogQuerySchema>;
export type UserIdParam = z.infer<typeof UserIdParamSchema>;
