import { createInvite } from '@/actions/invites';
import { fetchUserInvite } from '@/actions/tracking';

export type ICreateInviteProps = {
  code: string;
  email: string;
  role: string;
  invitedBy: string;
};

export const inviteService = {
  getInvite: async (code: string, email: string) => {
    const res = await fetchUserInvite(code, email);

    if (!res) {
      return {
        success: false,
        data: null,
      };
    }

    return {
      success: true,
      data: res,
    };
  },

  create: async (data: ICreateInviteProps) => {
    const res = await createInvite(data);

    if (!res) {
      return {
        success: false,
        data: null,
      };
    }

    return {
      success: true,
      data: res,
    };
  },
};
