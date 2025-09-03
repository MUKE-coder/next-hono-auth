"use server";

import { API_BASE_URL } from "@/config/axios";

// Server action to fetch user details
export async function getUserDetails(userId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/profile/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add any auth headers if needed
        // 'Authorization': `Bearer ${token}`,
      },
      // Enable caching for better performance
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch user details: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch user details");
    }

    return {
      success: true,
      data: data.user,
      message: data.message,
    };
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while fetching user details"
    );
  }
}

// Types based on the API response
export interface UserProfile {
  id: string;
  userId: string;
  gender: "MALE" | "FEMALE";
  dateOfBirth: string;
  ninNumber: string;
  homeAddress: string;
  workplaceAddress: string;
  district: string;
  title: string;
  employeeNo: string;
  computerNumber: string;
  presentSalary: number;
  category:
    | "PUBLIC_SERVICE"
    | "PRIVATE_SECTOR"
    | "NON_PROFIT"
    | "RETIRED"
    | "CLINICS";
  memberNumber: string;
  trackingNumber: string;
  voteNameId: string;
  regionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserDetail {
  id: string;
  surname: string;
  otherNames: string;
  name: string;
  nin: string | null;
  phone: string;
  email: string;
  image: string;
  role: "MEMBER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";
  isVerified: boolean;
  token: string | null;
  resetExpiry: string | null;
  createdAt: string;
  updatedAt: string;
  profile: UserProfile;
}

export interface UserDetailResponse {
  success: boolean;
  data: UserDetail;
  message: string;
}
