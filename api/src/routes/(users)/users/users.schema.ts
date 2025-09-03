import { z } from "zod";
import { GENDER, UserCategory, UserRole, UserStatus } from "@prisma/client";

// ====================
// REUSABLE BASE SCHEMAS
// ====================

// Common field validations
const requiredString = (minLength = 1, fieldName = "Field") =>
  z
    .string()
    .min(minLength, `${fieldName} must be at least ${minLength} characters`);

const optionalString = z.string().optional();
const nullableString = z.string().nullable().optional();
const cuidField = z.string().cuid();
const emailField = z
  .string()
  .email("Invalid email address")
  .nullable()
  .optional();
const urlField = z.string().url("Must be a valid URL").nullable().optional();

// NIN validation (14 characters or empty)
const ninField = z
  .string()
  .refine((val) => !val || val.length === 14, {
    message: "NIN must be either empty or exactly 14 characters"
  })
  .optional();

// Phone validation
const phoneField = z
  .string()
  .min(10, "Phone must be at least 10 digits")
  .max(15, "Phone cannot exceed 15 digits")
  .regex(/^[+]?[\d\s()-]+$/, "Invalid phone number format");

// Password validation
const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain uppercase, lowercase, and number"
  );

// Date preprocessing for Prisma dates
const datePreprocessor = z.preprocess((arg) => {
  if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
  return null;
}, z.date().nullable());

const isoDateString = z.string().datetime().optional();

// ====================
// ENUM SCHEMAS
// ====================

export const UserRoleEnum = z.nativeEnum(UserRole);
export const UserStatusEnum = z.nativeEnum(UserStatus);
export const GenderEnum = z.nativeEnum(GENDER);
export const UserCategoryEnum = z.nativeEnum(UserCategory);

// ====================
// PARAMETER SCHEMAS
// ====================

export const IdParamSchema = z.object({
  id: cuidField.openapi({
    param: { name: "id", in: "path" },
    example: "clx123abc"
  })
});

export const TrackingNumberParamSchema = z.object({
  trackingNumber: requiredString(1, "Tracking number").openapi({
    param: { name: "trackingNumber", in: "path" },
    example: "TRK001"
  })
});

// ====================
// PAGINATION SCHEMA
// ====================

export const PaginationSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive().max(100),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative()
});

export const PaginationQuerySchema = z.object({
  page: z
    .string()
    .default("1")
    .transform(Number)
    .pipe(z.number().int().positive()),
  limit: z
    .string()
    .default("10")
    .transform(Number)
    .pipe(z.number().int().positive().max(100))
});

// ====================
// USER PROFILE SCHEMAS
// ====================

// Base profile schema (for responses)
export const BaseUserProfileSchema = z.object({
  id: cuidField,
  userId: cuidField,
  gender: GenderEnum.nullable(),
  dateOfBirth: datePreprocessor,
  ninNumber: nullableString,
  homeAddress: nullableString,
  workplaceAddress: nullableString,
  district: nullableString,
  title: nullableString,
  employeeNo: nullableString,
  computerNumber: nullableString,
  presentSalary: z.number().positive().nullable(),
  category: UserCategoryEnum.default(UserCategory.PUBLIC_SERVICE),
  memberNumber: nullableString,
  trackingNumber: nullableString,
  lastStep: z.number().int().nonnegative().nullable(),
  createdAt: datePreprocessor,
  updatedAt: datePreprocessor
});

// Profile input schema (for create/update)
export const UserProfileInputSchema = z.object({
  gender: GenderEnum.optional(),
  dateOfBirth: isoDateString,
  ninNumber: ninField,
  homeAddress: optionalString,
  workplaceAddress: optionalString,
  district: optionalString,
  title: optionalString,
  employeeNo: optionalString,
  computerNumber: optionalString,
  presentSalary: z.number().positive().optional(),
  category: UserCategoryEnum.optional(),
  memberNumber: optionalString,
  trackingNumber: optionalString,
  lastStep: z.number().int().nonnegative().optional()
});

// ====================
// USER SCHEMAS
// ====================

// Base user schema (for responses)
export const BaseUserSchema = z.object({
  id: cuidField,
  surname: requiredString(2, "Surname"),
  otherNames: nullableString,
  name: nullableString,
  nin: ninField,
  phone: phoneField.nullable(),
  email: emailField,
  image: urlField,
  role: UserRoleEnum.default(UserRole.USER),
  status: UserStatusEnum.default(UserStatus.PENDING),
  isVerified: z.boolean().default(false),
  token: nullableString,
  resetExpiry: datePreprocessor,
  createdAt: datePreprocessor,
  updatedAt: datePreprocessor
});

// User with profile
export const UserWithProfileSchema = BaseUserSchema.extend({
  profile: BaseUserProfileSchema.nullable()
});

// ====================
// INPUT SCHEMAS
// ====================

// Create user input
export const CreateUserSchema = z.object({
  surname: requiredString(2, "Surname"),
  otherNames: optionalString,
  name: optionalString,
  email: emailField,
  phone: phoneField,
  nin: ninField,
  password: passwordField.optional(),
  image: urlField,
  role: UserRoleEnum.default(UserRole.USER),
  status: UserStatusEnum.default(UserStatus.ACTIVE)
});

// Update user input (all fields optional)
export const UpdateUserSchema = z.object({
  surname: requiredString(2, "Surname").optional(),
  otherNames: optionalString,
  name: optionalString,
  nin: ninField,
  phone: phoneField.optional(),
  email: emailField,
  image: urlField,
  role: UserRoleEnum.optional(),
  password: passwordField.optional(),
  status: UserStatusEnum.optional(),
  isVerified: z.boolean().optional(),
  token: nullableString,
  resetExpiry: isoDateString
});

// Combined user and profile update
export const UpdateUserAndProfileSchema = z
  .object({
    user: UpdateUserSchema.optional(),
    profile: UserProfileInputSchema.optional()
  })
  .refine((data) => data.user || data.profile, {
    message: "At least one of 'user' or 'profile' must be provided"
  });

// ====================
// QUERY SCHEMAS
// ====================

export const UserListQuerySchema = PaginationQuerySchema.extend({
  role: UserRoleEnum.optional(),
  status: UserStatusEnum.optional(),
  category: UserCategoryEnum.optional(),
  search: z.string().min(1).optional(),
  verified: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "surname", "email"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc")
});

// ====================
// RESPONSE SCHEMAS
// ====================

// Generic API response wrapper
const createApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string().optional(),
    data: dataSchema,
    errors: z.array(z.string()).optional()
  });

// Single user responses
export const UserResponseSchema = createApiResponseSchema(
  UserWithProfileSchema
);

// List responses
export const UserListResponseSchema = createApiResponseSchema(
  z.object({
    users: z.array(UserWithProfileSchema),
    pagination: PaginationSchema
  })
);

// ====================
// SPECIALIZED SCHEMAS
// ====================

// Authentication schemas
export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: requiredString(1, "Password")
});

export const ResetPasswordSchema = z.object({
  token: requiredString(1, "Reset token"),
  password: passwordField
});

export const ChangePasswordSchema = z.object({
  currentPassword: requiredString(1, "Current password"),
  newPassword: passwordField
});

// Invite schema
export const CreateInviteSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: UserRoleEnum.default(UserRole.USER)
});

// User verification
export const VerifyUserSchema = z.object({
  token: requiredString(1, "Verification token"),
  userId: cuidField
});

// Bulk operations
export const BulkUserActionSchema = z.object({
  userIds: z.array(cuidField).min(1, "At least one user ID required"),
  action: z.enum(["activate", "deactivate", "suspend", "verify", "delete"])
});

// ====================
// TYPE EXPORTS
// ====================

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UpdateUserAndProfileInput = z.infer<
  typeof UpdateUserAndProfileSchema
>;
export type UserListQuery = z.infer<typeof UserListQuerySchema>;
export type UserWithProfile = z.infer<typeof UserWithProfileSchema>;
export type UserProfileInput = z.infer<typeof UserProfileInputSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type CreateInviteInput = z.infer<typeof CreateInviteSchema>;
export type VerifyUserInput = z.infer<typeof VerifyUserSchema>;
export type BulkUserActionInput = z.infer<typeof BulkUserActionSchema>;

// ====================
// VALIDATION HELPERS
// ====================

export const validateUserInput = (data: unknown) =>
  CreateUserSchema.safeParse(data);
export const validateUserUpdate = (data: unknown) =>
  UpdateUserSchema.safeParse(data);
export const validateUserQuery = (data: unknown) =>
  UserListQuerySchema.safeParse(data);
