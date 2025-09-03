"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getVoteNames,
  createVoteName,
  updateVoteName,
  deleteVoteName,
  type VoteNamesResponse,
  type VoteNamesParams,
  type VoteName,
} from "@/actions/voteNamesData";

// Query keys for better cache management
export const VOTE_NAMES_QUERY_KEYS = {
  all: ["voteNames"] as const,
  lists: () => [...VOTE_NAMES_QUERY_KEYS.all, "list"] as const,
  list: (params: VoteNamesParams) =>
    [...VOTE_NAMES_QUERY_KEYS.lists(), params] as const,
  details: () => [...VOTE_NAMES_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...VOTE_NAMES_QUERY_KEYS.details(), id] as const,
} as const;

// Main hook for fetching vote names with pagination and search
export function useVoteNames(params: VoteNamesParams = {}) {
  return useQuery<VoteNamesResponse, Error>({
    queryKey: VOTE_NAMES_QUERY_KEYS.list(params),
    queryFn: () => getVoteNames(params),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    // Enable background refetching
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

// Hook for creating a new vote name
export function useCreateVoteName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVoteName,
    onSuccess: (data) => {
      // Invalidate and refetch vote names queries
      queryClient.invalidateQueries({
        queryKey: VOTE_NAMES_QUERY_KEYS.lists(),
      });

      toast.success("Vote name created successfully!", {
        description: `${data.data?.name} has been added to the system.`,
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to create vote name", {
        description: error.message,
      });
    },
  });
}

// Hook for updating a vote name
export function useUpdateVoteName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<
        Omit<VoteName, "id" | "createdAt" | "updatedAt" | "region">
      >;
    }) => updateVoteName(id, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch vote names queries
      queryClient.invalidateQueries({
        queryKey: VOTE_NAMES_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: VOTE_NAMES_QUERY_KEYS.detail(variables.id),
      });

      toast.success("Vote name updated successfully!", {
        description: `${data.data?.name} has been updated.`,
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to update vote name", {
        description: error.message,
      });
    },
  });
}

// Hook for deleting a vote name
export function useDeleteVoteName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVoteName,
    onSuccess: (data, voteNameId) => {
      // Invalidate and refetch vote names queries
      queryClient.invalidateQueries({
        queryKey: VOTE_NAMES_QUERY_KEYS.lists(),
      });
      queryClient.removeQueries({
        queryKey: VOTE_NAMES_QUERY_KEYS.detail(voteNameId),
      });

      toast.success("Vote name deleted successfully!", {
        description: "The vote name has been removed from the system.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete vote name", {
        description: error.message,
      });
    },
  });
}

// Enhanced hook with additional utilities
export function useVoteNamesWithUtils(params: VoteNamesParams = {}) {
  const query = useVoteNames(params);
  const createMutation = useCreateVoteName();
  const updateMutation = useUpdateVoteName();
  const deleteMutation = useDeleteVoteName();

  // Utility functions
  const getVoteNameById = (id: string) => {
    return query.data?.data.find((voteName) => voteName.id === id);
  };

  const getVoteNameByCode = (code: number) => {
    return query.data?.data.find((voteName) => voteName.code === code);
  };

  const getVoteNamesByRegion = (regionId: string) => {
    return (
      query.data?.data.filter((voteName) => voteName.regionId === regionId) ||
      []
    );
  };

  const getTotalVoteNames = () => {
    return query.data?.pagination?.total || 0;
  };

  const getCurrentPage = () => {
    return query.data?.pagination?.page || 1;
  };

  const getTotalPages = () => {
    return query.data?.pagination?.totalPages || 1;
  };

  const hasNextPage = () => {
    const current = getCurrentPage();
    const total = getTotalPages();
    return current < total;
  };

  const hasPreviousPage = () => {
    return getCurrentPage() > 1;
  };

  const getVoteNameStats = () => {
    const voteNames = query.data?.data || [];
    const totalVoteNames = voteNames.length;

    // Group by region
    const regionStats = voteNames.reduce((acc, voteName) => {
      const regionName = voteName.region.name;
      if (!acc[regionName]) {
        acc[regionName] = {
          count: 0,
          regionId: voteName.regionId,
        };
      }
      acc[regionName].count++;
      return acc;
    }, {} as Record<string, { count: number; regionId: string }>);

    const uniqueRegions = Object.keys(regionStats).length;
    const averagePerRegion =
      uniqueRegions > 0 ? Math.round(totalVoteNames / uniqueRegions) : 0;

    // Find region with most vote names
    const topRegion = Object.entries(regionStats).reduce(
      (max, [regionName, stats]) => {
        return stats.count > max.count
          ? { name: regionName, count: stats.count }
          : max;
      },
      { name: "", count: 0 }
    );

    return {
      total: totalVoteNames,
      uniqueRegions,
      averagePerRegion,
      topRegion,
      regionStats,
    };
  };

  const formatVoteNameForDisplay = (voteName: VoteName) => {
    return {
      ...voteName,
      displayName: voteName.name,
      displayCode: `#${voteName.code}`,
      regionName: voteName.region.name,
      createdDate: new Date(voteName.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      updatedDate: new Date(voteName.updatedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      fullDescription: `${voteName.name} (Code: ${voteName.code}) - ${voteName.region.name}`,
    };
  };

  // Search utilities
  const searchVoteNames = (searchTerm: string) => {
    const voteNames = query.data?.data || [];
    const term = searchTerm.toLowerCase();
    return voteNames.filter(
      (voteName) =>
        voteName.name.toLowerCase().includes(term) ||
        voteName.code.toString().includes(term) ||
        voteName.region.name.toLowerCase().includes(term)
    );
  };

  // Action helpers
  const createVoteName = (
    voteNameData: Omit<
      VoteName,
      "id" | "createdAt" | "updatedAt" | "region"
    > & { regionId: string }
  ) => {
    return createMutation.mutate(voteNameData);
  };

  const updateVoteName = (
    id: string,
    voteNameData: Partial<
      Omit<VoteName, "id" | "createdAt" | "updatedAt" | "region">
    >
  ) => {
    return updateMutation.mutate({ id, data: voteNameData });
  };

  const deleteVoteName = (id: string) => {
    return deleteMutation.mutate(id);
  };

  return {
    // Query data
    ...query,
    voteNames: query.data?.data || [],
    pagination: query.data?.pagination,

    // Mutations
    createMutation,
    updateMutation,
    deleteMutation,

    // Utility functions
    utils: {
      getVoteNameById,
      getVoteNameByCode,
      getVoteNamesByRegion,
      getTotalVoteNames,
      getCurrentPage,
      getTotalPages,
      hasNextPage,
      hasPreviousPage,
      getVoteNameStats,
      formatVoteNameForDisplay,
      searchVoteNames,
    },

    // Action helpers
    actions: {
      createVoteName,
      updateVoteName,
      deleteVoteName,
    },
  };
}

// Simple hook for just getting vote names data (useful for dropdowns, etc.)
export function useVoteNamesData(params: VoteNamesParams = {}) {
  const { data, isLoading, error } = useVoteNames(params);

  return {
    voteNames: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
  };
}

// Hook to get vote names by region (useful for region-specific dropdowns)
export function useVoteNamesByRegion(regionId: string) {
  const { data, isLoading, error } = useVoteNames({ regionId });

  return {
    voteNames: data?.data || [],
    isLoading,
    error,
  };
}
