"use client";
import { updateUserService } from "@/actions/users";
import { PaginationParams } from "@/actions/users-data";
import { usersDataServices } from "@/services/users";
import {
  UpdateUserAndProfileInput,
  UpdateUserErrorResponse,
  UpdateUserSuccessResponse,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateUserVariables {
  userId: string;
  data: UpdateUserAndProfileInput;
}

export const usersKeys = {
  all: ["users"] as const,
  lists: () => [...usersKeys.all, "list"] as const,
  list: (filters: any) => [...usersKeys.lists(), { filters }] as const,
};

// export function useMinUsersData() {
//   const allUsersQuery = useSuspenseQuery({
//     queryKey: ["minUsersData"],
//     queryFn: () => {
//       const data = usersDataServices.getAll();
//       return data;
//     },
//   });

//   return {
//     myUsers: allUsersQuery.data || [],
//     isFetching: allUsersQuery.isFetching,
//     error: allUsersQuery.error || "",
//   };
// }

export function useUsersData(pagination: PaginationParams = {}) {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: usersKeys.list({ pagination }),
    queryFn: () => usersDataServices.getUsers(pagination),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

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
  // console.log(data?.data);
  return {
    isLoading,
    refetch,
    error: data?.error || "",
    users: data?.data?.users || [],
    totalCount: data?.data?.pagination.total || 0,
    totalPages: data?.data?.pagination.totalPages || 0,
    currentPage: data?.data?.pagination.page || 1,
    // createUser: createUserQuery.mutateAsync,
    // isCreating: createUserQuery.isPending,
  };
}

export function useSingleUserData(userId: string | null) {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: usersKeys.list(userId ?? ""),
    queryFn: () => usersDataServices.getUser(userId ?? ""),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    // enabled: !!userId, // only enabled if trackingNumber is truthy
  });

  // console.log('Response 🟩🟩🟩', data);

  return {
    data: data?.data,
    isLoading,
    isFetching,
    error: error || "",
    refetch,
  };
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateUserSuccessResponse, // Data returned on success
    UpdateUserErrorResponse, // Data returned on error
    UpdateUserVariables // Variables passed to the mutate function
  >({
    mutationFn: async ({ data, userId }) => {
      const result = await updateUserService(data, userId);

      if (!result.success || !result.data) {
        throw result.error ?? new Error("No data returned");
      }

      return result.data;
    },
    onSuccess: (data, variables) => {
      // console.log('User updated successfully ✅:', data);
      toast.success("Successfull, User updated successfully");

      // Invalidate relevant queries to refetch data
      // For example, invalidate the user's detail query
      queryClient.invalidateQueries({
        queryKey: ["user", variables.userId],
      });
      // Or invalidate a list of users if the update affects it
      queryClient.invalidateQueries({ queryKey: ["users"] });

      // You might also want to directly update the cache
      // queryClient.setQueryData(["user", variables.userId], (oldData: UpdateUserSuccessResponse | undefined) => {
      //   return oldData ? { ...oldData, data: data.data } : data;
      // });
    },
    onError: (error) => {
      console.error("Error updating user ❌:", error);
      // You can also show a toast notification here
      // toast.error(`Failed to update user: ${error.message}`);
    },
  });
};

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
