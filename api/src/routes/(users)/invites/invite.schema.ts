import { z } from "zod";

export const UserRole = z.enum(["ADMIN", "USER"]);

export const UserStatusEnum = z.enum([
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
  "PENDING"
]);

export const UserRoleEnum = z.enum(["ADMIN", "USER"]);

export const IdParamSchema = z.object({
  code: z
    .string()
    .min(1, "Invite Code is required")
    .openapi({
      param: { name: "code", in: "path" },
      example: "clx123abc"
    })
});

export const IUSerSchema = z.object({
  isVerified: z.boolean(),
  email: z.string().nullable().optional(),

  name: z.string().nullable().optional(),
  status: UserStatusEnum
});

export const BaseInviteSchema = z.object({
  email: z.string(),
  code: z.string(),
  role: UserRole,
  // createdAt: z.string().optional(),
  // updatedAt: z.string().optional(),
  invitedBy: z.string()
  // user: IUSerSchema.nullable().optional()
});

// export const InviteCreationSchema = BaseInviteSchema.extend({
//   link: z.string()
// });
