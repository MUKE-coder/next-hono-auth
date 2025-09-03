import { z } from "zod";

// Enums matching Prisma schema
export const UserStatusEnum = z.enum([
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
  "PENDING",
]);

export const UserRoleEnum = z.enum(["ADMIN", "MEMBER"]);

// User schemas - Updated to match User model only
export const BaseUserSchema = z.object({
  id: z.string(),
  surname: z.string().min(2, "Surname must be at least 2 characters"),
  otherNames: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  email: z.string().email("Invalid email address"),
  image: z.string().url("Image must be a valid URL").nullable().optional(),
  role: UserRoleEnum,
  password: z.string().nullable().optional(),
  status: UserStatusEnum,
  isVerified: z.boolean(),
  token: z.string().nullable().optional(),
  resetExpiry: z.string().nullable().optional(), // DateTime as ISO string
});

export const UserResponseSchema = BaseUserSchema.extend({
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Create user schema
export const CreateUserSchema = z.object({
  surname: z.string().min(2, "Surname must be at least 2 characters"),
  otherNames: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
  image: z.string().url().optional(),
  role: UserRoleEnum.default("MEMBER"),
  status: UserStatusEnum.default("ACTIVE"),
});

// Update schemas
export const UpdateUserSchema = CreateUserSchema.partial();

// List query schemas
export const UserListQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().min(1)).default("1"),
  limit: z
    .string()
    .transform(Number)
    .pipe(z.number().int().min(1).max(100))
    .default("10"),
  role: UserRoleEnum.optional(),
  status: UserStatusEnum.optional(),
  search: z.string().optional(),
});

// Response schemas
export const UserListResponseSchema = z.object({
  users: z.array(UserResponseSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

// Type exports
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UserListQuery = z.infer<typeof UserListQuerySchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
