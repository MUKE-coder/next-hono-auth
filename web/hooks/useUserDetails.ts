"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserDetails, type UserDetailResponse } from "@/actions/user-detail";

// React Query hook for fetching user details
export function useUserDetails(userId: string) {
  return useQuery<UserDetailResponse, Error>({
    queryKey: ["userDetails", userId],
    queryFn: () => getUserDetails(userId),
    enabled: !!userId, // Only run query if userId is provided
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

// Hook with additional utilities
export function useUserDetailsWithUtils(userId: string) {
  const query = useUserDetails(userId);

  const user = query.data?.data;

  // Utility functions
  const getFullName = () => {
    if (!user) return "";
    return user.name || `${user.surname} ${user.otherNames}`.trim();
  };

  const getAge = () => {
    if (!user?.profile?.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(user.profile.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const getFormattedSalary = () => {
    if (!user?.profile?.presentSalary) return "Not specified";
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(user.profile.presentSalary);
  };

  const getMembershipDuration = () => {
    if (!user?.createdAt) return null;
    const createdDate = new Date(user.createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? "s" : ""}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} year${years > 1 ? "s" : ""}${
        remainingMonths > 0
          ? ` ${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`
          : ""
      }`;
    }
  };

  const getStatusColor = () => {
    if (!user) return "gray";
    switch (user.status) {
      case "ACTIVE":
        return "green";
      case "PENDING":
        return "yellow";
      case "SUSPENDED":
        return "red";
      case "INACTIVE":
        return "gray";
      default:
        return "gray";
    }
  };

  const getCategoryLabel = () => {
    if (!user?.profile?.category) return "Not specified";
    const labels = {
      PUBLIC_SERVICE: "Public Service",
      PRIVATE_SECTOR: "Private Sector",
      NON_PROFIT: "Non-Profit Organization",
      RETIRED: "Retired",
      CLINICS: "Private Clinics",
    };
    return labels[user.profile.category] || user.profile.category;
  };

  const getTitleLabel = () => {
    if (!user?.profile?.title) return "Not specified";
    return user.profile.title
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return {
    ...query,
    user,
    utils: {
      getFullName,
      getAge,
      getFormattedSalary,
      getMembershipDuration,
      getStatusColor,
      getCategoryLabel,
      getTitleLabel,
    },
  };
}
