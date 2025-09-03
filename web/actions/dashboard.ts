"use server";

import prisma from "@/prisma/db";
import { UserStatus, GENDER } from "@prisma/client";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";
import { revalidatePath } from "next/cache";

// ===== METRICS ACTIONS =====

export async function getTotalMembers() {
  try {
    const currentCount = await prisma.user.count({
      where: {
        role: "MEMBER",
      },
    });

    // Get last month's count for trend calculation
    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

    const lastMonthCount = await prisma.user.count({
      where: {
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
        role: "MEMBER",
      },
    });

    // Calculate trend
    const trend =
      lastMonthCount > 0
        ? ((currentCount - lastMonthCount) / lastMonthCount) * 100
        : 0;

    return {
      count: currentCount,
      trend: {
        value: Math.round(trend * 100) / 100,
        isPositive: trend >= 0,
        period: "last month",
      },
    };
  } catch (error) {
    console.error("Error fetching total members:", error);
    throw new Error("Failed to fetch total members");
  }
}

export async function getActiveMembers() {
  try {
    const currentCount = await prisma.user.count({
      where: { status: UserStatus.ACTIVE, role: "MEMBER" },
    });

    // Get last month's active count
    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

    const lastMonthCount = await prisma.user.count({
      where: {
        status: UserStatus.ACTIVE,
        updatedAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
        role: "MEMBER",
      },
    });

    const trend =
      lastMonthCount > 0
        ? ((currentCount - lastMonthCount) / lastMonthCount) * 100
        : 0;

    return {
      count: currentCount,
      trend: {
        value: Math.round(trend * 100) / 100,
        isPositive: trend >= 0,
        period: "last month",
      },
    };
  } catch (error) {
    console.error("Error fetching active members:", error);
    throw new Error("Failed to fetch active members");
  }
}

export async function getPendingApprovals() {
  try {
    const currentCount = await prisma.user.count({
      where: { status: UserStatus.PENDING, role: "MEMBER" },
    });

    // Get last week's pending count for trend
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const lastWeekCount = await prisma.user.count({
      where: {
        status: UserStatus.PENDING,
        createdAt: { lte: lastWeek },
        role: "MEMBER",
      },
    });

    const trend =
      lastWeekCount > 0
        ? ((currentCount - lastWeekCount) / lastWeekCount) * 100
        : 0;

    return {
      count: currentCount,
      trend: {
        value: Math.round(trend * 100) / 100,
        isPositive: trend <= 0, // Lower pending is better
        period: "last week",
      },
    };
  } catch (error) {
    console.error("Error fetching pending approvals:", error);
    throw new Error("Failed to fetch pending approvals");
  }
}

export async function getNewRegistrationsThisMonth() {
  try {
    const currentMonth = new Date();
    const startOfCurrentMonth = startOfMonth(currentMonth);

    const currentCount = await prisma.user.count({
      where: {
        createdAt: { gte: startOfCurrentMonth },
        role: "MEMBER",
      },
    });

    // Get last month's registrations
    const lastMonthStart = startOfMonth(subMonths(currentMonth, 1));
    const lastMonthEnd = endOfMonth(subMonths(currentMonth, 1));

    const lastMonthCount = await prisma.user.count({
      where: {
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
        role: "MEMBER",
      },
    });

    const trend =
      lastMonthCount > 0
        ? ((currentCount - lastMonthCount) / lastMonthCount) * 100
        : 0;

    return {
      count: currentCount,
      trend: {
        value: Math.round(trend * 100) / 100,
        isPositive: trend >= 0,
        period: "last month",
      },
    };
  } catch (error) {
    console.error("Error fetching new registrations:", error);
    throw new Error("Failed to fetch new registrations");
  }
}

export async function getSuspendedInactiveMembers() {
  try {
    const currentCount = await prisma.user.count({
      where: {
        status: {
          in: [UserStatus.SUSPENDED, UserStatus.INACTIVE],
        },
        role: "MEMBER",
      },
    });

    // Get last month's count
    const lastMonth = subMonths(new Date(), 1);
    const lastMonthCount = await prisma.user.count({
      where: {
        status: {
          in: [UserStatus.SUSPENDED, UserStatus.INACTIVE],
        },
        role: "MEMBER",
        updatedAt: { lte: lastMonth },
      },
    });

    const trend =
      lastMonthCount > 0
        ? ((currentCount - lastMonthCount) / lastMonthCount) * 100
        : 0;

    return {
      count: currentCount,
      trend: {
        value: Math.round(trend * 100) / 100,
        isPositive: trend <= 0, // Lower suspended/inactive is better
        period: "last month",
      },
    };
  } catch (error) {
    console.error("Error fetching suspended/inactive members:", error);
    throw new Error("Failed to fetch suspended/inactive members");
  }
}

// ===== CHARTS ACTIONS =====

export async function getRegistrationTrends() {
  try {
    const currentDate = new Date();
    const monthsBack = 12;

    const trends = [];

    for (let i = monthsBack - 1; i >= 0; i--) {
      const monthDate = subMonths(currentDate, i);
      const startDate = startOfMonth(monthDate);
      const endDate = endOfMonth(monthDate);

      const count = await prisma.user.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          role: "MEMBER",
        },
      });

      trends.push({
        month: format(monthDate, "MMM yyyy"),
        registrations: count,
        period: format(monthDate, "yyyy-MM"),
      });
    }

    return { data: trends };
  } catch (error) {
    console.error("Error fetching registration trends:", error);
    throw new Error("Failed to fetch registration trends");
  }
}

export async function getStatusDistribution() {
  try {
    const statusCounts = await prisma.user.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
      where: {
        role: "MEMBER",
      },
    });

    const totalMembers = await prisma.user.count({
      where: {
        role: "MEMBER",
      },
    });

    const data = statusCounts.map((item: any) => ({
      status: item.status,
      count: item._count.status,
      percentage: Math.round((item._count.status / totalMembers) * 100),
      name: item.status.charAt(0) + item.status.slice(1).toLowerCase(),
    }));

    return { data };
  } catch (error) {
    console.error("Error fetching status distribution:", error);
    throw new Error("Failed to fetch status distribution");
  }
}

export async function getCategoryDistribution() {
  try {
    const categoryCounts = await prisma.userProfile.groupBy({
      by: ["category"],
      _count: {
        category: true,
      },
      // where: {
      //   category: { not: null },
      // },
    });

    const totalProfiles = await prisma.userProfile.count();

    const categoryLabels = {
      PUBLIC_SERVICE: "Public Service",
      PRIVATE_SECTOR: "Private Sector",
      NON_PROFIT: "Non-Profit",
      RETIRED: "Retired",
      CLINICS: "Clinics",
    };

    const data = categoryCounts.map((item: any) => ({
      category: item.category,
      count: item._count.category,
      percentage: Math.round((item._count.category / totalProfiles) * 100),
      name:
        categoryLabels[item.category as keyof typeof categoryLabels] ||
        item.category,
    }));

    return { data };
  } catch (error) {
    console.error("Error fetching category distribution:", error);
    throw new Error("Failed to fetch category distribution");
  }
}

export async function getRegionalDistribution() {
  try {
    const regionalCounts = await prisma.userProfile.groupBy({
      by: ["district"],
      _count: {
        district: true,
      },
      where: {
        district: { not: null },
      },
      orderBy: {
        _count: {
          district: "desc",
        },
      },
      take: 15, // Top 15 regions
    });

    const data = regionalCounts.map((item: any) => ({
      region: item.district,
      count: item._count.district,
      district: item.district,
    }));

    return { data };
  } catch (error) {
    console.error("Error fetching regional distribution:", error);
    throw new Error("Failed to fetch regional distribution");
  }
}

// ===== DEMOGRAPHIC ACTIONS =====

export async function getGenderDistribution() {
  try {
    const genderCounts = await prisma.userProfile.groupBy({
      by: ["gender"],
      _count: {
        gender: true,
      },
      where: {
        gender: { not: null },
      },
    });

    const totalProfiles = await prisma.userProfile.count({
      where: { gender: { not: null } },
    });

    const data = genderCounts.map((item: any) => ({
      gender: item.gender,
      count: item._count.gender,
      percentage: Math.round((item._count.gender / totalProfiles) * 100),
      name: item.gender === GENDER.MALE ? "Male" : "Female",
    }));

    return { data };
  } catch (error) {
    console.error("Error fetching gender distribution:", error);
    throw new Error("Failed to fetch gender distribution");
  }
}

export async function getAverageAge() {
  try {
    const profiles = await prisma.userProfile.findMany({
      where: {
        dateOfBirth: { not: null },
      },
      select: {
        dateOfBirth: true,
      },
    });

    if (profiles.length === 0) {
      return { averageAge: 0, totalMembers: 0 };
    }

    const currentDate = new Date();
    const ages = profiles.map((profile) => {
      const birthDate = new Date(profile.dateOfBirth!);
      let age = currentDate.getFullYear() - birthDate.getFullYear();
      const monthDiff = currentDate.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    });

    const averageAge = Math.round(
      ages.reduce((sum, age) => sum + age, 0) / ages.length
    );

    return {
      averageAge,
      totalMembers: profiles.length,
      ageRange: {
        min: Math.min(...ages),
        max: Math.max(...ages),
      },
    };
  } catch (error) {
    console.error("Error calculating average age:", error);
    throw new Error("Failed to calculate average age");
  }
}

// ===== TABLE ACTIONS =====

export async function getRecentRegistrations() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentMembers = await prisma.user.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        role: "MEMBER",
      },
      include: {
        profile: {
          select: {
            category: true,
            district: true,
            trackingNumber: true,
            memberNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Limit to 50 most recent
    });

    const data = recentMembers.map((member) => ({
      id: member.id,
      name: `${member.surname}, ${member.otherNames || ""}`.trim(),
      email: member.email,
      phone: member.phone,
      registrationDate: member.createdAt.toISOString(),
      status: member.status,
      category: member.profile?.category,
      district: member.profile?.district,
      trackingNumber: member.profile?.trackingNumber,
      memberNumber: member.profile?.memberNumber,
    }));

    return { data };
  } catch (error) {
    console.error("Error fetching recent registrations:", error);
    throw new Error("Failed to fetch recent registrations");
  }
}

export async function getPendingApprovalsTable() {
  try {
    const pendingMembers = await prisma.user.findMany({
      where: {
        status: UserStatus.PENDING,
        role: "MEMBER",
      },
      include: {
        profile: {
          select: {
            category: true,
            district: true,
            trackingNumber: true,
            memberNumber: true,
            dateOfBirth: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc", // Oldest first for approval queue
      },
    });

    const data = pendingMembers.map((member) => ({
      id: member.id,
      name: `${member.surname}, ${member.otherNames || ""}`.trim(),
      email: member.email,
      phone: member.phone,
      registrationDate: member.createdAt.toISOString(),
      status: member.status,
      category: member.profile?.category,
      district: member.profile?.district,
      trackingNumber: member.profile?.trackingNumber,
      memberNumber: member.profile?.memberNumber,
      dateOfBirth: member.profile?.dateOfBirth?.toISOString(),
    }));

    return { data };
  } catch (error) {
    console.error("Error fetching pending approvals:", error);
    throw new Error("Failed to fetch pending approvals");
  }
}

// ===== MEMBER ACTIONS =====

export async function approveMember(memberId: string) {
  try {
    // Generate member number
    const currentYear = new Date().getFullYear();
    const memberCount = await prisma.user.count({
      where: { status: UserStatus.ACTIVE, role: "MEMBER" },
    });

    const memberNumber = `UNMU-${currentYear}-${String(
      memberCount + 1
    ).padStart(4, "0")}`;

    // Update user status and profile
    const updatedMember = await prisma.$transaction(async (tx) => {
      // Update user status
      const user = await tx.user.update({
        where: { id: memberId },
        data: {
          status: UserStatus.ACTIVE,
          isVerified: true,
        },
      });

      // Update profile with member number
      await tx.userProfile.upsert({
        where: { userId: memberId },
        update: { memberNumber },
        create: {
          userId: memberId,
          memberNumber,
        },
      });

      return user;
    });
    revalidatePath(`/dashboard/members/${memberId}`);
    return { success: true, memberNumber, user: updatedMember };
  } catch (error) {
    console.error("Error approving member:", error);
    throw new Error("Failed to approve member");
  }
}

export async function rejectMember(memberId: string) {
  try {
    const updatedMember = await prisma.user.update({
      where: { id: memberId, role: "MEMBER" },
      data: {
        status: UserStatus.INACTIVE,
      },
    });

    return { success: true, user: updatedMember };
  } catch (error) {
    console.error("Error rejecting member:", error);
    throw new Error("Failed to reject member");
  }
}

// ===== UTILITY ACTIONS =====

export async function getDashboardSummary() {
  try {
    const [
      totalMembers,
      activeMembers,
      pendingMembers,
      thisMonthRegistrations,
    ] = await Promise.all([
      prisma.user.count({
        where: {
          role: "MEMBER",
        },
      }),
      prisma.user.count({
        where: { status: UserStatus.ACTIVE, role: "MEMBER" },
      }),
      prisma.user.count({
        where: { status: UserStatus.PENDING, role: "MEMBER" },
      }),
      prisma.user.count({
        where: {
          createdAt: { gte: startOfMonth(new Date()) },
          role: "MEMBER",
        },
      }),
    ]);

    return {
      totalMembers,
      activeMembers,
      pendingMembers,
      thisMonthRegistrations,
      activationRate:
        totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0,
    };
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    throw new Error("Failed to fetch dashboard summary");
  }
}
