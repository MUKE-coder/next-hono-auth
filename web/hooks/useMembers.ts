import { PaginationParams } from "@/actions/users-data";
import { membersDataServices } from "@/services/members";
import { usersDataServices } from "@/services/users";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

// import { CreateUser, UpdateUserProps } from "@/types/types";
import { toast } from "sonner";

export const membersKeys = {
  all: ["members"] as const,
  lists: () => [...membersKeys.all, "list"] as const,
  list: (filters: any) => [...membersKeys.lists(), { filters }] as const,
};

export function useMembersData(pagination: PaginationParams = {}) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: membersKeys.list({ pagination }),
    queryFn: () => membersDataServices.getMembers(pagination),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  console.log(data?.data);
  // const createUserQuery = useMutation({
  //   mutationFn: (data: CreateUser) => usersDataServices.createUser(data),
  //   onSuccess: () => {
  //     toast.success("User created successfully");
  //     queryClient.invalidateQueries({ queryKey: usersKeys.all });
  //   },
  //   onError: (error: Error) => {
  //     toast.error("Failed to add user", {
  //       description: error.message || "Unknown error occurred",
  //     });
  //   },
  // });

  return {
    isLoading,
    refetch,
    error: data?.error || "",
    members: data?.data?.users || [],
    totalCount: data?.data?.pagination.totalCount || 0,
    totalPages: data?.data?.pagination.totalPages || 0,
    currentPage: data?.data?.pagination.currentPage || 1,
    // createUser: createUserQuery.mutateAsync,
    // isCreating: createUserQuery.isPending,
  };
}

// export function useUserData(id: string) {
//   const queryClient = useQueryClient();
//   const { data, isLoading, error, refetch } = useQuery({
//     queryKey: usersKeys.all,
//     queryFn: () => usersDataServices.getUser(id),
//     staleTime: 5 * 60 * 1000,
//     gcTime: 10 * 60 * 1000,
//   });

//   const updateUserQuery = useMutation({
//     mutationFn: (data: UpdateUserProps) =>
//       usersDataServices.updateUser(data, id),
//     onSuccess: () => {
//       toast.success("User updated successfully");
//       queryClient.invalidateQueries({ queryKey: usersKeys.all });
//     },
//     onError: (error: Error) => {
//       toast.error("Failed to update user", {
//         description: error.message || "Unknown error occurred",
//       });
//     },
//   });

//   return {
//     userData: data?.data || null,
//     isLoading,
//     error,
//     refetch,
//     updateUser: updateUserQuery.mutateAsync,
//     isUpdating: updateUserQuery.isPending,
//   };
// }
