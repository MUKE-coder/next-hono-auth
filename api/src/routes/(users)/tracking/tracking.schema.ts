import { z } from "zod";

// Enums matching Prisma schema
export const UserStatusEnum = z.enum([
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
  "PENDING"
]);

export const GENDER = z.enum(["MALE", "FEMALE"]);

export const UserCategory = z.enum([
  "PUBLIC_SERVICE",
  "PRIVATE_SECTOR",
  "NON_PROFIT",
  "RETIRED",
  "CLINICS"
]);

export const UserRoleEnum = z.enum(["ADMIN", "MEMBER"]);

// Base schemas
export const IdParamSchema = z.object({
  trackingNumber: z
    .string()
    .min(1, "Tracking Number is required")
    .openapi({
      param: { name: "trackingNumber", in: "path" },
      example: "clx123abc"
    })
});

// VoteName schema (adjust to your actual model)
export const IUSerSchema = z.object({
  isVerified: z.boolean(),
  name: z.string().nullable().optional(),
  status: UserStatusEnum
});

export const IVoteNameSchema = z.object({
  name: z.string(),
  regionId: z.string()
});

// User profile schema
export const BaseUserProfileSchema = z.object({
  gender: GENDER.nullable().optional(),
  dateOfBirth: z.date().nullable().optional(),
  ninNumber: z.string().nullable().optional(),
  workplaceAddress: z.string().nullable().optional(),
  category: UserCategory,
  memberNumber: z.string().nullable().optional(),
  trackingNumber: z.string().nullable().optional(),
  user: IUSerSchema.nullable().optional(),
  voteName: IVoteNameSchema.nullable().optional(),
  updatedAt: z.string()
});

// export const TrackingInfoResponseSchema = BaseUserProfileSchema.extend({
//   createdAt: z.string(),
//   updatedAt: z.string()
// });
