"use server";

export interface QueriesUsersDataResponse {
  success: boolean;
  message?: string;
  error?: any;
  data: {
    users: User[];
    pagination: {
      page: number;
      totalPages: number;
      total: number;
      limit: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  } | null;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}
import { getServerUser } from "./auth";

import { api } from "@/config/axios";
import { User } from "@/types/auth2";

export async function getUsersData(
  pagination: PaginationParams
): Promise<QueriesUsersDataResponse> {
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
      `/users/admins?page=${pagination.page || 1}&& limit=${
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
