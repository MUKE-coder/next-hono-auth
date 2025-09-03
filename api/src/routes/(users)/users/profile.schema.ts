import { z } from "zod";

// Enum definitions (adjust these based on your actual enum values)
const GenderEnum = z.enum(["MALE", "FEMALE"]);
const UserCategoryEnum = z.enum([
  "PUBLIC_SERVICE",
  "PRIVATE_SECTOR",
  "NON_PROFIT",
  "RETIRED",
  "CLINICS"
]);

// Base UserProfile schema for creation
export const CreateUserProfileSchema = z.object({
  userId: z.string().min(1, "User ID is required"),

  // Personal Information
  gender: GenderEnum.optional(),
  dateOfBirth: z.coerce.date().optional(),
  ninNumber: z.string().min(1, "NIN number cannot be empty").optional(),

  // Address Information
  homeAddress: z.string().optional(),
  workplaceAddress: z.string().optional(),
  district: z.string().optional(),

  // Employment Information
  title: z.string().optional(),
  employeeNo: z.string().min(1, "Employee number cannot be empty").optional(),
  computerNumber: z.string().optional(),
  presentSalary: z.number().positive("Salary must be positive").optional(),
  category: UserCategoryEnum.default("PUBLIC_SERVICE"),

  // Membership Information
  memberNumber: z.string().min(1, "Member number cannot be empty").optional(),
  trackingNumber: z.string().optional(),

  // Location Relations
  voteNameId: z.string().optional(),
  regionId: z.string().optional()
});

// Complete UserProfile schema (includes generated fields)
export const UserProfileSchema = CreateUserProfileSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Enums (you'll need to define these based on your actual enums)
export const UserRoleEnum = z.enum(["ADMIN", "MEMBER"]); // Adjust based on your actual roles
export const UserStatusEnum = z.enum([
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
  "PENDING"
]); // Adjust based on your actual statuses

// Base User Schema (your existing schema with some adjustments)
export const BaseUserSchema = z.object({
  id: z.string(),
  surname: z.string().min(2, "Surname must be at least 2 characters"),
  otherNames: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  nin: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().email("Invalid email address"),
  image: z.string().url("Image must be a valid URL").nullable().optional(),
  role: UserRoleEnum,
  password: z.string().nullable().optional(),
  status: UserStatusEnum,
  isVerified: z.boolean(),
  token: z.string().nullable().optional(),
  resetExpiry: z.string().datetime().nullable().optional(), // ISO DateTime string
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

// User Profile Schema
export const MemberProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),

  // Personal Information
  gender: GenderEnum.nullable().optional(),
  dateOfBirth: z.string().datetime().nullable().optional(),
  ninNumber: z.string().nullable().optional(),

  // Address Information
  homeAddress: z.string().nullable().optional(),
  workplaceAddress: z.string().nullable().optional(),
  district: z.string().nullable().optional(),

  // Employment Information
  title: z.string().nullable().optional(),
  employeeNo: z.string().nullable().optional(),
  computerNumber: z.string().nullable().optional(),
  presentSalary: z
    .number()
    .positive("Salary must be positive")
    .nullable()
    .optional(),
  category: UserCategoryEnum,

  // Membership Information
  memberNumber: z.string().nullable().optional(),
  trackingNumber: z.string().nullable().optional(),

  // Location Relations (assuming these are IDs)
  voteNameId: z.string().nullable().optional(),
  regionId: z.string().nullable().optional(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

// Combined User with Profile Schema
export const UserWithProfileSchema = BaseUserSchema.extend({
  profile: MemberProfileSchema.nullable().optional()
});
export const UserWithProfileResponseSchema = z.object({
  user: UserWithProfileSchema
});

// Update schema (all fields optional except id)
export const UpdateUserProfileSchema = z
  .object({
    // Personal Information
    gender: GenderEnum.optional(),
    dateOfBirth: z.coerce.date().optional(),
    ninNumber: z.string().min(1, "NIN number cannot be empty").optional(),
    lastStep: z.number().nullable().optional(),

    // Address Information
    homeAddress: z.string().optional(),
    workplaceAddress: z.string().optional(),
    district: z.string().optional(),

    // Employment Information
    title: z.string().optional(),
    employeeNo: z.string().min(1, "Employee number cannot be empty").optional(),
    computerNumber: z.string().optional(),
    presentSalary: z.number().positive("Salary must be positive").optional(),
    category: UserCategoryEnum.optional(),

    // Membership Information
    memberNumber: z.string().min(1, "Member number cannot be empty").optional(),
    trackingNumber: z.string().optional(),

    // Location Relations
    voteNameId: z.string().optional(),
    regionId: z.string().optional()
  })
  .partial();

export const profileUpdateResponse = z.object({
  success: z.boolean(),
  data: z
    .object({
      id: z.string()
    })
    .optional(),
  message: z.string().optional()
});
