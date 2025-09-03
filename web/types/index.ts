import { z } from 'zod';

type UserRole = 'MEMBER' | 'ADMIN';
type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
type Gender = 'MALE' | 'FEMALE' | 'OTHER';
type Category = 'PRIVATE_SECTOR' | 'PUBLIC_SECTOR' | 'SELF_EMPLOYED';

export interface VoteName {
  name: string;
}

export interface Region {
  name: string;
}

export interface UserProfile {
  gender: Gender;
  dateOfBirth: Date;
  ninNumber: string;
  homeAddress: string;
  workplaceAddress: string;
  district: string;
  title: string;
  employeeNo: string;
  computerNumber: string;
  presentSalary: number;
  category: Category;
  memberNumber: string;
  trackingNumber: string;
  voteName: VoteName;
  region: Region;
}

export interface IUser {
  id: string;
  surname: string;
  otherNames: string;
  name: string;
  nin: string;
  phone: string;
  email: string;
  image: string;
  role: UserRole;
  status: UserStatus;
  isVerified: boolean;
  createdAt: Date;
  profile: UserProfile;
}

export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum IUserRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export enum IUserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

export enum UserCategory {
  PUBLIC_SERVICE = 'PUBLIC_SERVICE',
  PRIVATE_SECTOR = 'PRIVATE_SECTOR',
}

// Request Schema (same as your Hono schema for input validation)
const userUpdateSchema = z.object({
  surname: z.string().min(1, 'Surname is required').optional(),
  otherNames: z.string().optional(),
  name: z.string().optional(),
  nin: z.string().length(14, 'NIN must be 14 characters long').optional(),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number cannot exceed 15 digits')
    .optional(),
  email: z.string().email('Invalid email address').optional(),
  image: z.string().url('Invalid image URL').optional(),
  role: z.nativeEnum(IUserRole).optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .optional(),
  status: z.nativeEnum(IUserStatus).optional(),
  isVerified: z.boolean().optional(),
  token: z.string().optional(),
  resetExpiry: z.string().datetime().optional(), // Expect ISO string
});

const userProfileUpdateSchema = z.object({
  gender: z.nativeEnum(GENDER).optional(),
  dateOfBirth: z.string().datetime().optional(), // Expect ISO string
  ninNumber: z
    .string()
    .length(14, 'NIN Number must be 14 characters long')
    .optional(),

  homeAddress: z.string().optional(),
  workplaceAddress: z.string().optional(),
  district: z.string().optional(),

  title: z.string().optional(),
  employeeNo: z.string().optional(),
  computerNumber: z.string().optional(),
  presentSalary: z.number().positive('Salary must be positive').optional(),
  category: z.nativeEnum(UserCategory).optional(),

  memberNumber: z.string().optional(),
  trackingNumber: z.string().optional(),

  voteNameId: z.string().cuid().optional(),
  regionId: z.string().cuid().optional(),
});

export const updateUserAndProfileSchema = z.object({
  user: userUpdateSchema.optional(),
  profile: userProfileUpdateSchema.optional(),
});

export type UpdateUserAndProfileInput = z.infer<
  typeof updateUserAndProfileSchema
>;

// --- Response Schemas (copied/imported from your backend response schema) ---
// Make sure to match the types exactly as they come from your API
// Example: date fields might be strings on the client after JSON.parse
export const UserResponseSchema = z.object({
  id: z.string(),
  surname: z.string(),
  otherNames: z.string().nullable(),
  name: z.string().nullable(),
  nin: z.string().nullable(),
  phone: z.string(),
  email: z.string().email(),
  image: z.string().nullable(),
  role: z.nativeEnum(IUserRole),
  password: z.string().nullable(),
  status: z.nativeEnum(IUserStatus),
  isVerified: z.boolean(),
  token: z.string().nullable(),
  resetExpiry: z.string().datetime().nullable(), // Will be stringified Date from API
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const UserProfileResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  gender: z.nativeEnum(GENDER).nullable(),
  dateOfBirth: z.string().datetime().nullable(), // Will be stringified Date from API
  ninNumber: z.string().nullable(),
  homeAddress: z.string().nullable(),
  workplaceAddress: z.string().nullable(),
  district: z.string().nullable(),
  title: z.string().nullable(),
  employeeNo: z.string().nullable(),
  computerNumber: z.string().nullable(),
  presentSalary: z.number().nullable(),
  category: z.nativeEnum(UserCategory),
  memberNumber: z.string().nullable(),
  trackingNumber: z.string().nullable(),
  voteNameId: z.string().nullable(),
  regionId: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const UpdatedUserDataSchema = UserResponseSchema.extend({
  profile: UserProfileResponseSchema.nullable(),
});

export const UpdateUserSuccessResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: UpdatedUserDataSchema,
});

export const BaseErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
});

export const ZodValidationErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.union([z.string(), z.array(z.any())]), // Can be string or parsed array
});

export const UpdateUserErrorResponseSchema = z.union([
  BaseErrorResponseSchema,
  ZodValidationErrorResponseSchema,
]);

export type UpdateUserSuccessResponse = z.infer<
  typeof UpdateUserSuccessResponseSchema
>;
export type UpdateUserErrorResponse = z.infer<
  typeof UpdateUserErrorResponseSchema
>;
