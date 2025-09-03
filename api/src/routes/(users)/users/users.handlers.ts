import bcrypt from "bcryptjs";
import * as HttpStatusCodes from "stoker/http-status-codes";
import type { AppRouteHandler } from "@/lib/types";
import { getPrisma } from "prisma/db";
import { UserRole, UserStatus, UserCategory } from "@prisma/client";

// Import optimized route types
import type {
  ListUsersRoute,
  ListAdminsRoute,
  ListMembersRoute,
  GetUserByIdRoute,
  GetUserWithProfileRoute,
  CreateUserRoute,
  UpdateUserRoute,
  UpdateUserProfileRoute,
  UpdateUserAndProfileRoute,
  DeleteUserRoute
} from "./users.routes";

import { generateTrackingNumber } from "./user.helpers";

// ====================
// UTILITY FUNCTIONS
// ====================

interface ClientInfo {
  userAgent: string;
  ipAddress: string;
}

function getClientInfo(c: any): ClientInfo {
  const userAgent = c.req.header("User-Agent") || "Unknown";
  const ipAddress =
    c.req.header("X-Forwarded-For")?.split(",")[0]?.trim() ||
    c.req.header("X-Real-IP") ||
    c.req.header("CF-Connecting-IP") ||
    "Unknown";
  return { userAgent, ipAddress };
}

async function logUserActivity(
  prisma: any,
  userId: string,
  activity: string,
  ipAddress?: string,
  userAgent?: string,
  actorName?: string
): Promise<void> {
  try {
    await prisma.userLog.create({
      data: {
        name: actorName || "System",
        activity,
        time: new Date().toISOString(),
        ipAddress: ipAddress || "Unknown",
        device: userAgent || "Unknown",
        userId
      }
    });
  } catch (error) {
    console.error("Failed to log user activity:", error);
  }
}

function buildSearchWhereClause(search?: string) {
  if (!search) return {};

  return {
    OR: [
      { name: { contains: search, mode: "insensitive" } },
      { surname: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      {
        profile: {
          memberNumber: { contains: search, mode: "insensitive" }
        }
      },
      {
        profile: {
          trackingNumber: { contains: search, mode: "insensitive" }
        }
      }
    ]
  };
}

async function checkUniqueFields(
  prisma: any,
  data: { email?: string | null; phone?: string; nin?: string },
  excludeUserId?: string
) {
  const checks: Promise<any>[] = [];

  if (data.email) {
    checks.push(
      prisma.user
        .findFirst({
          where: {
            email: data.email,
            ...(excludeUserId && { NOT: { id: excludeUserId } })
          },
          select: { id: true }
        })
        .then((user: any) => ({ field: "email", exists: !!user }))
    );
  }

  if (data.phone) {
    checks.push(
      prisma.user
        .findFirst({
          where: {
            phone: data.phone,
            ...(excludeUserId && { NOT: { id: excludeUserId } })
          },
          select: { id: true }
        })
        .then((user: any) => ({ field: "phone", exists: !!user }))
    );
  }

  if (data.nin) {
    checks.push(
      prisma.user
        .findFirst({
          where: {
            nin: data.nin,
            ...(excludeUserId && { NOT: { id: excludeUserId } })
          },
          select: { id: true }
        })
        .then((user: any) => ({ field: "nin", exists: !!user }))
    );
  }

  if (checks.length === 0) return null;

  const results = await Promise.all(checks);
  return results.find((result) => result.exists) || null;
}

function transformUserResponse(user: any) {
  return {
    ...user,
    resetExpiry: user.resetExpiry?.toISOString() || null,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    profile: user.profile
      ? {
          ...user.profile,
          dateOfBirth: user.profile.dateOfBirth?.toISOString() || null,
          createdAt: user.profile.createdAt?.toISOString() || null,
          updatedAt: user.profile.updatedAt?.toISOString() || null
        }
      : null
  };
}

// ====================
// LIST HANDLERS
// ====================

export const listUsers: AppRouteHandler<ListUsersRoute> = async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const query = c.req.valid("query");

  try {
    const {
      page,
      limit,
      role,
      status,
      category,
      search,
      verified,
      sortBy,
      sortOrder
    } = query;
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    // Apply filters
    if (role) whereClause.role = role;
    if (status) whereClause.status = status;
    if (verified !== undefined) whereClause.isVerified = verified;

    // Category filter (through profile)
    if (category) {
      whereClause.profile = { category };
    }

    // Search functionality
    Object.assign(whereClause, buildSearchWhereClause(search));

    // Build orderBy
    const orderBy: any = {};
    if (sortBy === "surname" || sortBy === "email") {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy[sortBy] = sortOrder;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        include: {
          profile: {
            select: {
              id: true,
              category: true,
              memberNumber: true,
              trackingNumber: true,
              title: true,
              district: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.user.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(total / limit);

    return c.json(
      {
        success: true,
        message: "Users retrieved successfully",
        data: {
          users: users.map(transformUserResponse),
          pagination: {
            page,
            limit,
            total,
            totalPages
          }
        }
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error listing users:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch users",
        code: "FETCH_ERROR"
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const listAdmins: AppRouteHandler<ListAdminsRoute> = async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const query = c.req.valid("query");

  try {
    const { page, limit, status, search, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const whereClause: any = {
      role: UserRole.ADMIN
    };

    if (status) whereClause.status = status;
    Object.assign(whereClause, buildSearchWhereClause(search));

    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        include: {
          profile: {
            select: {
              id: true,
              title: true,
              district: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.user.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(total / limit);

    return c.json(
      {
        success: true,
        message: "Administrators retrieved successfully",
        data: {
          users: users.map(transformUserResponse),
          pagination: {
            page,
            limit,
            total,
            totalPages
          }
        }
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error listing admins:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch administrators",
        code: "FETCH_ERROR"
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const listMembers: AppRouteHandler<ListMembersRoute> = async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const query = c.req.valid("query");

  try {
    const {
      page,
      limit,
      status,
      category,
      search,
      verified,
      sortBy,
      sortOrder
    } = query;
    const skip = (page - 1) * limit;

    const whereClause: any = {
      role: UserRole.USER,
      profile: { isNot: null }
    };

    if (status) whereClause.status = status;
    if (verified !== undefined) whereClause.isVerified = verified;
    if (category) whereClause.profile.category = category;

    Object.assign(whereClause, buildSearchWhereClause(search));

    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        include: {
          profile: true
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.user.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(total / limit);

    return c.json(
      {
        success: true,
        message: "Members retrieved successfully",
        data: {
          users: users.map(transformUserResponse),
          pagination: {
            page,
            limit,
            total,
            totalPages
          }
        }
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error listing members:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch members",
        code: "FETCH_ERROR"
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// ====================
// INDIVIDUAL USER HANDLERS
// ====================

export const getUserById: AppRouteHandler<GetUserByIdRoute> = async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const { id } = c.req.valid("param");

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true
      }
    });

    if (!user) {
      return c.json(
        {
          success: false,
          message: "User not found"
        },
        HttpStatusCodes.NOT_FOUND
      );
    }

    return c.json(
      {
        success: true,
        message: "User retrieved successfully",
        data: transformUserResponse(user)
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch user",
        code: "FETCH_ERROR"
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const getUserWithProfile: AppRouteHandler<
  GetUserWithProfileRoute
> = async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const { id } = c.req.valid("param");

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        logs: {
          orderBy: { createdAt: "desc" },
          take: 10
        }
      }
    });

    if (!user) {
      return c.json(
        {
          success: false,
          message: "User not found",
          code: "NOT_FOUND"
        },
        HttpStatusCodes.NOT_FOUND
      );
    }

    return c.json(
      {
        success: true,
        message: "User with profile retrieved successfully",
        data: transformUserResponse(user)
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error fetching user with profile:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch user profile",
        code: "FETCH_ERROR"
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// ====================
// CREATE HANDLERS
// ====================

export const createUser: AppRouteHandler<CreateUserRoute> = async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const data = c.req.valid("json");
  const { userAgent, ipAddress } = getClientInfo(c);

  try {
    // Check for conflicts
    const conflict = await checkUniqueFields(prisma, data);
    if (conflict) {
      const messages = {
        email: "Email already exists",
        phone: "Phone number already exists",
        nin: "NIN already exists"
      };

      return c.json(
        {
          success: false,
          message: messages[conflict.field as keyof typeof messages]
        },
        HttpStatusCodes.CONFLICT
      );
    }

    // Hash password if provided
    const hashedPassword = data.password
      ? await bcrypt.hash(data.password, 12)
      : null;

    // Create user
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
      },
      include: {
        profile: true
      }
    });

    // Log activity
    await logUserActivity(
      prisma,
      user.id,
      "User account created",
      ipAddress,
      userAgent
    );

    return c.json(
      {
        success: true,
        message: "User created successfully",
        data: { id: user.id }
      },
      HttpStatusCodes.CREATED
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return c.json(
      {
        success: false,
        message: "Failed to create user",
        code: "CREATE_ERROR"
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// ====================
// UPDATE HANDLERS
// ====================

export const updateUser: AppRouteHandler<UpdateUserRoute> = async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const { id } = c.req.valid("param");
  const data = c.req.valid("json");
  const { userAgent, ipAddress } = getClientInfo(c);
  const currentUser = c.get("currentUser");

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, phone: true, nin: true }
    });

    if (!existingUser) {
      return c.json(
        {
          success: false,
          message: "User not found",
          code: "NOT_FOUND"
        },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Check for conflicts on changed fields
    const fieldsToCheck: any = {};
    if (data.email && data.email !== existingUser.email)
      fieldsToCheck.email = data.email;
    if (data.phone && data.phone !== existingUser.phone)
      fieldsToCheck.phone = data.phone;
    if (data.nin && data.nin !== existingUser.nin) fieldsToCheck.nin = data.nin;

    if (Object.keys(fieldsToCheck).length > 0) {
      const conflict = await checkUniqueFields(prisma, fieldsToCheck, id);
      if (conflict) {
        const messages = {
          email: "Email already exists",
          phone: "Phone number already exists",
          nin: "NIN already exists"
        };

        return c.json(
          {
            success: false,
            message: messages[conflict.field as keyof typeof messages],
            code: "CONFLICT"
          },
          HttpStatusCodes.CONFLICT
        );
      }
    }

    // Prepare update data
    const updateData: any = data;
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 12);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        profile: true
      }
    });

    // Log activity
    await logUserActivity(
      prisma,
      id,
      "User updated",
      ipAddress,
      userAgent,
      currentUser?.name || "Unknown"
    );

    return c.json(
      {
        success: true,
        message: "User updated successfully",
        data: transformUserResponse(updatedUser)
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return c.json(
      {
        success: false,
        message: "Failed to update user",
        code: "UPDATE_ERROR"
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const updateUserProfile: AppRouteHandler<
  UpdateUserProfileRoute
> = async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const { id } = c.req.valid("param");
  const data = c.req.valid("json");
  const { userAgent, ipAddress } = getClientInfo(c);

  try {
    // Find user by ID (not profile ID)
    const user = await prisma.user.findUnique({
      where: { id },
      include: { profile: true }
    });

    if (!user) {
      return c.json(
        {
          success: false,
          message: "User not found"
        },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Check for employee number conflicts
    if (data.employeeNo && data.employeeNo !== user.profile?.employeeNo) {
      const existingProfile = await prisma.userProfile.findFirst({
        where: {
          employeeNo: data.employeeNo,
          NOT: { userId: id }
        }
      });

      if (existingProfile) {
        return c.json(
          {
            success: false,
            message: "Employee number already exists",
            code: "CONFLICT"
          },
          HttpStatusCodes.CONFLICT
        );
      }
    }

    // Update or create profile
    const updatedProfile = await prisma.userProfile.upsert({
      where: { userId: id },
      update: data,
      create: {
        userId: id,
        ...data,
        trackingNumber: generateTrackingNumber(),
        category: data.category || UserCategory.PUBLIC_SERVICE
      },
      include: {
        user: true
      }
    });

    // Log activity
    await logUserActivity(prisma, id, "Profile updated", ipAddress, userAgent);

    return c.json(
      {
        success: true,
        message: "Profile updated successfully",
        data: transformUserResponse({
          ...updatedProfile.user,
          profile: updatedProfile
        })
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return c.json(
      {
        success: false,
        message: "Failed to update profile",
        code: "UPDATE_ERROR"
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// ====================
// DELETE HANDLER
// ====================

export const deleteUser: AppRouteHandler<DeleteUserRoute> = async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const { id } = c.req.valid("param");
  const { userAgent, ipAddress } = getClientInfo(c);
  const currentUser = c.get("currentUser");

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        surname: true,
        role: true,
        _count: {
          select: {
            invites: true
          }
        }
      }
    });

    if (!existingUser) {
      return c.json(
        {
          success: false,
          message: "User not found",
          code: "NOT_FOUND"
        },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Check for dependencies that might prevent deletion
    if (existingUser._count.invites > 0) {
      return c.json(
        {
          success: false,
          message: "Cannot delete user with existing invitations",
          code: "CONFLICT"
        },
        HttpStatusCodes.CONFLICT
      );
    }

    // Prevent deletion of the last admin
    if (existingUser.role === UserRole.ADMIN) {
      const adminCount = await prisma.user.count({
        where: { role: UserRole.ADMIN }
      });

      if (adminCount <= 1) {
        return c.json(
          {
            success: false,
            message: "Cannot delete the last administrator",
            code: "CONFLICT"
          },
          HttpStatusCodes.CONFLICT
        );
      }
    }

    // Delete user and related data in transaction
    await prisma.$transaction(async (tx) => {
      // Delete related data first (cascade should handle most of this, but being explicit)
      await tx.userLog.deleteMany({ where: { userId: id } });
      await tx.refreshToken.deleteMany({ where: { userId: id } });

      // Delete user (profile will be deleted by cascade)
      await tx.user.delete({ where: { id } });
    });

    // Log the deletion (create a system log since user is deleted)
    console.log(
      `User deleted: ${existingUser.name || existingUser.surname} (${id}) by ${
        currentUser?.name || "System"
      }`
    );

    return c.json(
      {
        success: true,
        message: "User deleted successfully",
        data: { id }
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return c.json(
      {
        success: false,
        message: "Failed to delete user",
        code: "DELETE_ERROR"
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// ====================
// ADDITIONAL HELPER HANDLERS
// ====================

/**
 * Helper handler for user statistics
 */
export const getUserStats = async (c: any) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  try {
    const [
      totalUsers,
      activeUsers,
      verifiedUsers,
      totalMembers,
      totalAdmins,
      recentUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
      prisma.user.count({ where: { isVerified: true } }),
      prisma.user.count({
        where: { role: UserRole.USER, profile: { isNot: null } }
      }),
      prisma.user.count({ where: { role: UserRole.ADMIN } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      })
    ]);

    return c.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        verifiedUsers,
        totalMembers,
        totalAdmins,
        recentUsers,
        inactiveUsers: totalUsers - activeUsers,
        unverifiedUsers: totalUsers - verifiedUsers
      }
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch user statistics",
        code: "FETCH_ERROR"
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Helper handler for user activity logs
 */
export const getUserActivityLogs = async (c: any) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const { id } = c.req.valid("param");
  const query = c.req.valid("query");

  try {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.userLog.findMany({
        where: { userId: id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.userLog.count({ where: { userId: id } })
    ]);

    const totalPages = Math.ceil(total / limit);

    return c.json({
      success: true,
      data: {
        logs: logs.map((log) => ({
          ...log,
          createdAt: log.createdAt.toISOString(),
          updatedAt: log.updatedAt.toISOString()
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      }
    });
  } catch (error) {
    console.error("Error fetching user activity logs:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch activity logs",
        code: "FETCH_ERROR"
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
