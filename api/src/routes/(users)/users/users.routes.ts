import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";

// Import optimized schemas
import {
  CreateUserSchema,
  UpdateUserSchema,
  UpdateUserAndProfileSchema,
  UserListQuerySchema,
  UserListResponseSchema,
  UserResponseSchema,
  UserWithProfileSchema,
  UserProfileInputSchema,
  IdParamSchema,
  TrackingNumberParamSchema,
  BulkUserActionSchema
} from "./users.schema";

const tags = ["Users"];

// ====================
// STANDARDIZED RESPONSE SCHEMAS
// ====================

// Generic success response
const SuccessResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z
    .object({
      id: z.string().cuid()
    })
    .optional()
});

// Member creation success response
const MemberCreationResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({
    userId: z.string().cuid(),
    profileId: z.string().cuid(),
    trackingNumber: z.string(),
    memberNumber: z.string().optional()
  })
});

// Generic error response
const ErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  errors: z.array(z.string()).optional()
});

// Specific error schemas
const ValidationErrorSchema = ErrorResponseSchema;

const NotFoundErrorSchema = ErrorResponseSchema;

const ConflictErrorSchema = ErrorResponseSchema;

const ForbiddenErrorSchema = ErrorResponseSchema.extend({
  code: z.literal("FORBIDDEN")
});

const UnauthorizedErrorSchema = ErrorResponseSchema.extend({
  code: z.literal("UNAUTHORIZED")
});

// ====================
// USER LISTING ROUTES
// ====================

export const listUsers = createRoute({
  path: "/users",
  method: "get",
  tags,
  summary: "List all users",
  description:
    "Retrieve a paginated list of users with optional filtering and sorting",
  request: {
    query: UserListQuerySchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      UserListResponseSchema,
      "Users retrieved successfully"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      ValidationErrorSchema,
      "Invalid query parameters"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      UnauthorizedErrorSchema,
      "Authentication required"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      ForbiddenErrorSchema,
      "Insufficient permissions"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      ErrorResponseSchema,
      "Internal server error"
    )
  }
});

export const listAdmins = createRoute({
  path: "/users/admins",
  method: "get",
  tags,
  summary: "List administrators",
  description: "Retrieve a paginated list of users with admin role",
  request: {
    query: UserListQuerySchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      UserListResponseSchema,
      "Administrators retrieved successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      UnauthorizedErrorSchema,
      "Authentication required"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      ForbiddenErrorSchema,
      "Admin access required"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      ErrorResponseSchema,
      "Internal server error"
    )
  }
});

export const listMembers = createRoute({
  path: "/users/members",
  method: "get",
  tags,
  summary: "List union members",
  description: "Retrieve a paginated list of verified union members",
  request: {
    query: UserListQuerySchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      UserListResponseSchema,
      "Members retrieved successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      UnauthorizedErrorSchema,
      "Authentication required"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      ForbiddenErrorSchema,
      "Insufficient permissions"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      ErrorResponseSchema,
      "Internal server error"
    )
  }
});

// ====================
// INDIVIDUAL USER ROUTES
// ====================

export const getUserById = createRoute({
  path: "/users/{id}",
  method: "get",
  tags,
  summary: "Get user by ID",
  description: "Retrieve detailed information about a specific user",
  request: {
    params: IdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      UserResponseSchema,
      "User retrieved successfully"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      ValidationErrorSchema,
      "Invalid user ID format"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      NotFoundErrorSchema,
      "User not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      UnauthorizedErrorSchema,
      "Authentication required"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      ForbiddenErrorSchema,
      "Access denied to this user's information"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      ErrorResponseSchema,
      "Internal server error"
    )
  }
});

export const getUserWithProfile = createRoute({
  path: "/users/{id}/profile",
  method: "get",
  tags,
  summary: "Get user with full profile",
  description: "Retrieve user information including complete profile details",
  request: {
    params: IdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      UserResponseSchema,
      "User with profile retrieved successfully"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      ValidationErrorSchema,
      "Invalid user ID format"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      NotFoundErrorSchema,
      "User not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      UnauthorizedErrorSchema,
      "Authentication required"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      ForbiddenErrorSchema,
      "Access denied to profile information"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      ErrorResponseSchema,
      "Internal server error"
    )
  }
});

export const getUserByTrackingNumber = createRoute({
  path: "/users/tracking/{trackingNumber}",
  method: "get",
  tags,
  summary: "Get user by tracking number",
  description: "Retrieve user information using their unique tracking number",
  request: {
    params: TrackingNumberParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      UserResponseSchema,
      "User retrieved successfully"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      ValidationErrorSchema,
      "Invalid tracking number format"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      NotFoundErrorSchema,
      "User with tracking number not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      UnauthorizedErrorSchema,
      "Authentication required"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      ErrorResponseSchema,
      "Internal server error"
    )
  }
});

// ====================
// USER CREATION ROUTES
// ====================

export const createUser = createRoute({
  path: "/users",
  method: "post",
  tags,
  summary: "Create new user",
  description: "Create a new user account with basic information",
  request: {
    body: jsonContentRequired(CreateUserSchema, "User creation data")
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      SuccessResponseSchema,
      "User created successfully"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      ValidationErrorSchema,
      "Invalid input data"
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      ConflictErrorSchema,
      "User with email/phone/NIN already exists"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      UnauthorizedErrorSchema,
      "Authentication required"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      ForbiddenErrorSchema,
      "Insufficient permissions to create user"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      ErrorResponseSchema,
      "Internal server error"
    )
  }
});

export const createMember = createRoute({
  path: "/members",
  method: "post",
  tags,
  summary: "Create new union member",
  description:
    "Create a new union member with profile information and generate tracking number",
  request: {
    body: jsonContentRequired(
      CreateUserSchema.extend({
        profile: UserProfileInputSchema.optional()
      }),
      "Member creation data"
    )
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      MemberCreationResponseSchema,
      "Member created successfully"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      ValidationErrorSchema,
      "Invalid input data"
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      ConflictErrorSchema,
      "Member with email/phone/NIN/employee number already exists"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      UnauthorizedErrorSchema,
      "Authentication required"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      ForbiddenErrorSchema,
      "Insufficient permissions to create member"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      ErrorResponseSchema,
      "Internal server error"
    )
  }
});

// ====================
// USER UPDATE ROUTES
// ====================

export const updateUser = createRoute({
  path: "/users/{id}",
  method: "patch",
  tags,
  summary: "Update user information",
  description: "Update basic user information (excluding profile)",
  request: {
    params: IdParamSchema,
    body: jsonContentRequired(UpdateUserSchema, "User update data")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      UserResponseSchema,
      "User updated successfully"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      ValidationErrorSchema,
      "Invalid input data"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      NotFoundErrorSchema,
      "User not found"
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      ConflictErrorSchema,
      "Email/phone/NIN already exists"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      UnauthorizedErrorSchema,
      "Authentication required"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      ForbiddenErrorSchema,
      "Access denied to update this user"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      ErrorResponseSchema,
      "Internal server error"
    )
  }
});

export const updateUserProfile = createRoute({
  path: "/users/{id}/profile",
  method: "patch",
  tags,
  summary: "Update user profile",
  description: "Update user profile information only",
  request: {
    params: IdParamSchema,
    body: jsonContentRequired(UserProfileInputSchema, "Profile update data")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      UserResponseSchema,
      "Profile updated successfully"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      ValidationErrorSchema,
      "Invalid profile data"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      NotFoundErrorSchema,
      "User not found"
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      ConflictErrorSchema,
      "Employee number/NIN already exists"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      UnauthorizedErrorSchema,
      "Authentication required"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      ForbiddenErrorSchema,
      "Access denied to update this profile"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      ErrorResponseSchema,
      "Internal server error"
    )
  }
});

export const updateUserAndProfile = createRoute({
  path: "/users/{id}/complete",
  method: "patch",
  tags,
  summary: "Update user and profile together",
  description: "Update both user information and profile in a single request",
  request: {
    params: IdParamSchema,
    body: jsonContentRequired(
      UpdateUserAndProfileSchema,
      "Complete user update data"
    )
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      UserResponseSchema,
      "User and profile updated successfully"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      ValidationErrorSchema,
      "Invalid input data or no data provided"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      NotFoundErrorSchema,
      "User not found"
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      ConflictErrorSchema,
      "Duplicate data conflicts"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      UnauthorizedErrorSchema,
      "Authentication required"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      ForbiddenErrorSchema,
      "Access denied to update this user"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      ErrorResponseSchema,
      "Internal server error"
    )
  }
});

export const finalizeUserProfile = createRoute({
  path: "/members/{id}/finalize",
  method: "patch",
  tags,
  summary: "Finalize member registration",
  description: "Complete member registration and generate member number",
  request: {
    params: IdParamSchema,
    body: jsonContentRequired(UserProfileInputSchema, "Final profile data")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      MemberCreationResponseSchema,
      "Member registration finalized successfully"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      ValidationErrorSchema,
      "Invalid or incomplete profile data"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      NotFoundErrorSchema,
      "Member not found"
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      ConflictErrorSchema,
      "Member already finalized or data conflicts"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      UnauthorizedErrorSchema,
      "Authentication required"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      ForbiddenErrorSchema,
      "Access denied to finalize this member"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      ErrorResponseSchema,
      "Internal server error"
    )
  }
});

// ====================
// BULK OPERATIONS
// ====================

export const bulkUserActions = createRoute({
  path: "/users/bulk",
  method: "patch",
  tags,
  summary: "Bulk user operations",
  description:
    "Perform bulk actions on multiple users (activate, deactivate, etc.)",
  request: {
    body: jsonContentRequired(BulkUserActionSchema, "Bulk action data")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        success: z.literal(true),
        message: z.string(),
        data: z.object({
          processed: z.number().int().nonnegative(),
          failed: z.number().int().nonnegative(),
          errors: z.array(z.string()).optional()
        })
      }),
      "Bulk operation completed"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      ValidationErrorSchema,
      "Invalid bulk operation data"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      UnauthorizedErrorSchema,
      "Authentication required"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      ForbiddenErrorSchema,
      "Insufficient permissions for bulk operations"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      ErrorResponseSchema,
      "Internal server error"
    )
  }
});

// ====================
// USER DELETION
// ====================

export const deleteUser = createRoute({
  path: "/users/{id}",
  method: "delete",
  tags,
  summary: "Delete user",
  description: "Permanently delete a user and their associated data",
  request: {
    params: IdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      SuccessResponseSchema,
      "User deleted successfully"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      ValidationErrorSchema,
      "Invalid user ID format"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      NotFoundErrorSchema,
      "User not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      UnauthorizedErrorSchema,
      "Authentication required"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      ForbiddenErrorSchema,
      "Insufficient permissions to delete user"
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      ConflictErrorSchema,
      "Cannot delete user with existing dependencies"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      ErrorResponseSchema,
      "Internal server error"
    )
  }
});

// ====================
// TYPE EXPORTS
// ====================

export type ListUsersRoute = typeof listUsers;
export type ListAdminsRoute = typeof listAdmins;
export type ListMembersRoute = typeof listMembers;
export type GetUserByIdRoute = typeof getUserById;
export type GetUserWithProfileRoute = typeof getUserWithProfile;
export type GetUserByTrackingNumberRoute = typeof getUserByTrackingNumber;
export type CreateUserRoute = typeof createUser;
export type CreateMemberRoute = typeof createMember;
export type UpdateUserRoute = typeof updateUser;
export type UpdateUserProfileRoute = typeof updateUserProfile;
export type UpdateUserAndProfileRoute = typeof updateUserAndProfile;
export type FinalizeUserProfileRoute = typeof finalizeUserProfile;
export type BulkUserActionsRoute = typeof bulkUserActions;
export type DeleteUserRoute = typeof deleteUser;
