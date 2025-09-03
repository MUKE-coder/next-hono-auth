'use server';

import { api } from '@/config/axios';

import axios from 'axios';

export async function fetchTrackingInfo(trackingNumber: string) {
  try {
    const response = await api.get(`/users/tracking/${trackingNumber}`);
    // console.log('Response 004 🤣🤣🤣:', response.data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        'Failed to fetch back trracking information for the user';
      throw new Error(message);
    }
    throw error;
  }
}

export async function fetchUserInvite(code: string, email: string) {
  try {
    const response = await api.get(`/users/invites/${code}?email=${email}`);
    // console.log('Response 004 🤣🤣🤣:', response);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        'Failed to fetch back user invite information.';
      throw new Error(message);
    }
    throw error;
  }
}
