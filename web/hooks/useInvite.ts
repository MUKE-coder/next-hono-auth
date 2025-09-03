import { ICreateInviteProps, inviteService } from '@/services/invites';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const inviteKeys = {
  all: ['invite'], // remove `as const`
  lists: () => [...inviteKeys.all, 'list'] as const,
  list: (code: string) => [...inviteKeys.lists(), { code }] as const,
};

export function verifyInviteQuery(code: string, email: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: inviteKeys.list(code ?? ''),
    queryFn: () => inviteService.getInvite(code, email),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!email && !!code,
  });
  //   console.log('Data From DB 🟩', data);
  return {
    data: data,
    isLoading,
    error: error || '',
    refetch,
  };
}

export function useCreateInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateInviteProps) => inviteService.create(data),
    onSuccess: (_, variables) => {
      toast.success('Invite initiated successfully');
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';

      toast.error(`Invite failed to create: ${message}`);
    },
  });
}
