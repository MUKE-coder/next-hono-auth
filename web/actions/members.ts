"use server";

export interface QueriesMembersDataResponse {
  success: boolean;
  message?: string;
  error?: any;
  data: {
    users: User[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  } | null;
}

import { getServerUser } from "./auth";

import { api } from "@/config/axios";
import { User } from "@/types/auth2";
import { PaginationParams } from "./users-data";

export async function getMembersData(
  pagination: PaginationParams
): Promise<QueriesMembersDataResponse> {
  const user = await getServerUser();
  if (!user) {
    return {
      success: false,
      message: "User Not Available",
      data: null,
    };
  }
  try {
    const response = await api.get(
      `/users/members?page=${pagination.page || 1}&& limit=${
        pagination.limit || 10
      }&&${pagination.search && `search=${pagination.search}`}`
    );
    const users = response.data;
    console.log(users, response.data);

    return {
      success: true,
      message: "Users fetched successfully",
      data: users.data,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Something went wrong",
      data: null,
    };
  }
}
