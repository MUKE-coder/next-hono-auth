import { fetchTrackingInfo } from '@/actions/tracking';

export const trackingInfoServices = {
  getTrackingInfo: async (trackingNumber: string) => {
    const res = await fetchTrackingInfo(trackingNumber);

    if (!res) {
      return {
        success: false,
        data: null,
      };
    }

    return {
      data: res,
    };
  },
};
