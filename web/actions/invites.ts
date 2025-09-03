'use server';

import { api } from '@/config/axios';
import { ICreateInviteProps } from '@/services/invites';

import axios from 'axios';

export async function createInvite(data: ICreateInviteProps) {
  try {
    const response = await api.post(`/users/invites`, data);
    // console.log('Response 004 🤣🤣🤣:', response);

    // revalidatePath('/dashboard/users');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || 'Failed to create invite.';
      throw new Error(message);
    }
    throw error;
  }
}
