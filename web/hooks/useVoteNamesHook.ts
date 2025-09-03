import { PaginationParams } from "@/actions/users-data";
import { handleVoteName } from "@/services/vote-names";
import { CreateVoteNameFormTypes, UpdateVoteNameFormTypes } from "@/types/vote-name";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useVoteNames } from "./useVoteNames";

// Updated query keys that include pagination parameters
export const queryKeys = {
  voteNames: (params?: PaginationParams) => 
    params ? ["VoteNames", params] : ["VoteNames"] as const,
  voteNamesByRegion: (regionId: string) =>
    ["vote-names", "region", regionId] as const,
  
};

export function useVoteNamesQuery(pagination: PaginationParams = {}) {
  const queryClient = useQueryClient();
  
  // Query for fetching all regions with Pagination
  const getVoteNamesQuery = useQuery({
    queryKey: queryKeys.voteNames(pagination), // This is the crucial fix!
    queryFn: () => {
      const data = handleVoteName.handleGetAllVoteNamesService(pagination);
      console.log("Query key:", queryKeys.voteNames(pagination)); // Debug log
      return data;
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  const createVoteNameMutation = useMutation({
    mutationFn: async (voteNameDetails: CreateVoteNameFormTypes) => {
      return handleVoteName.handleCreateVoteNameService(voteNameDetails);
    },
    onSuccess: () => {
      // Invalidate all votenames queries (all pages)
      queryClient.invalidateQueries({ 
        queryKey: ["VoteNames"],
        exact: false // This invalidates all queries starting with ['Vote-Names']
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // Update Vote-Name
  const updateVoteNameMutation = useMutation({
    mutationFn: async ({ id, voteNameDetails }: { id: string; voteNameDetails: Partial<UpdateVoteNameFormTypes> }) => {
      return handleVoteName.handleUpdateVoteNameService(voteNameDetails, id);
    },
    onSuccess: () => {
      // Invalidate all vote-names queries
      queryClient.invalidateQueries({ 
        queryKey: ["VoteNames"],
        exact: false 
      });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  // Delete vote-name mutation
  const deleteVoteNameMutation = useMutation({
    mutationFn: async (id: string) => {
      const deleteVoteName = handleVoteName.handleDeleteVoteNameService(id);
      return deleteVoteName;
    },
    onSuccess: () => {
      // Invalidate all regions queries
      queryClient.invalidateQueries({ 
        queryKey: ["VoteNames"],
        exact: false 
      });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  return {
    // Queries
    getVoteNames: getVoteNamesQuery.data?.data || [],
    pagination: getVoteNamesQuery.data?.pagination,
    isLoading: getVoteNamesQuery.isLoading,
    error: getVoteNamesQuery.error,

    // Mutations
    createVoteName: createVoteNameMutation.mutate,
    isCreating: createVoteNameMutation.isPending,
    updateVoteName: updateVoteNameMutation.mutate,
    deleteVoteName: deleteVoteNameMutation,

    // Mutation states
    isUpdating: updateVoteNameMutation.isPending,
    isDeleting: deleteVoteNameMutation.isPending,
    
    // Add refetch function
    refetch: getVoteNamesQuery.refetch,
  };
}

// Hook for fetching a single vote-name
export function useSingleVoteNameQuery(id: string) {
  const singleVoteNameQuery = useQuery({
    queryKey: ["VoteNames", "singleVoteName", id], /* More specific key */
    queryFn: () => {
      const responseData = handleVoteName.handleGetVoteNameService(id);
      return responseData;
    },
    enabled: !!id, /* Only run if id exists */
  });
  
  return {
    singleVoteName: singleVoteNameQuery.data,
    error: singleVoteNameQuery.error,
    isLoading: singleVoteNameQuery.isLoading,
  };
}