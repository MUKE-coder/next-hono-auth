import { trackingInfoServices } from '@/services/tracking';
import { useQuery } from '@tanstack/react-query';

export const trackingInfoKeys = {
  all: ['info'] as const,
  lists: () => [...trackingInfoKeys.all, 'list'] as const,
  list: (trackingNumber: string) =>
    [...trackingInfoKeys.lists(), { trackingNumber }] as const,
};

export function useTrackingData(trackingNumber: string | null) {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: trackingInfoKeys.list(trackingNumber ?? ''),
    queryFn: () => trackingInfoServices.getTrackingInfo(trackingNumber ?? ''),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!trackingNumber, // only enabled if trackingNumber is truthy
  });

  return {
    data: data?.data,
    isLoading,
    isFetching,
    error: error || '',
    refetch,
  };
}
