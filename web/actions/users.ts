'use server';

import { api } from '@/config/axios';
import {
  UpdateUserAndProfileInput,
  UpdateUserErrorResponse,
  UpdateUserSuccessResponse,
} from '@/types';
import { UserCreateProps } from '@/types/auth';

import axios from 'axios';

import { revalidatePath } from 'next/cache';

export interface QueriesSingleUserDataResponse {
  success: boolean;
  data: {
    users: any[];
  } | null;
}

interface APIResponse<TSuccess, TError> {
  data: TSuccess | null;
  error: TError | null;
  success: boolean;
}

export async function createUser(data: UserCreateProps) {
  try {
    const response = await api.post('/register', data);
    revalidatePath('/dashboard/users');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Type-safe error handling
      const message = error.response?.data?.message || 'Failed to create User';
      throw new Error(message);
    }
    throw error;
  }
}
export async function getProfileId(userId: string) {
  try {
    const response = await api.get(`/users/${userId}`);
    console.log(response);
    const profileData = response.data;
    return profileData.id as string;
  } catch (error) {
    console.log(error);
  }
}

export async function getProfileByTrackingNumber(trackingNumber: string) {
  try {
    const response = await api.get(`/members/${trackingNumber}`);
    console.log(response);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Profile not found';
    }
  }
}

export async function getSingleUserData(userId: string) {
  try {
    const response = await api.get(`/users/${userId}`);
    // console.log('Response Actions 🟩🟩🟩', response.data);

    return {
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Type-safe error handling
      const message = error.response?.data?.message || 'Failed to fetch User';
      throw new Error(message);
    }
    throw error;
  }
}

export const updateUserService = async (
  data: UpdateUserAndProfileInput,
  id: string
): Promise<APIResponse<UpdateUserSuccessResponse, UpdateUserErrorResponse>> => {
  try {
    const response = await api.patch(`/users/full-update/${id}`, data);

    const response_data = response.data;
    return { data: response_data.data, error: null, success: true };
  } catch (err) {
    console.error('Network or unexpected error  ❌:', err);
    return {
      data: null,
      error: {
        success: false,
        message: 'Network error or API is unreachable  ❌.',
      },
      success: false,
    };
  }
};
