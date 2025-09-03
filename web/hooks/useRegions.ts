"use client";
import {
  getVoteNamesByRegion,
  VoteName,
} from "@/actions/regions";
import { PaginationParams } from "@/actions/users-data";

// Updated query keys that include pagination parameters
export const queryKeys = {
  regions: (params?: PaginationParams) => 
    params ? ["Regions", params] : ["Regions"] as const,
  voteNamesByRegion: (regionId: string) =>
    ["vote-names", "region", regionId] as const,
};

import { RegionFormTypes } from '@/schemas/region.schema';
import { handleRegion } from '@/services/regions';
import { UpdateRegionFormTypes } from "@/types/region";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useRegions(pagination: PaginationParams = {}) {
  const queryClient = useQueryClient();
  
  // Query for fetching all regions - NOW INCLUDES PAGINATION IN KEY
  const getRegionsQuery = useQuery({
    queryKey: queryKeys.regions(pagination), // This is the crucial fix!
    queryFn: () => {
      const data = handleRegion.handleGetAllRegionsService(pagination);
      console.log("Query key:", queryKeys.regions(pagination)); // Debug log
      return data;
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  const createRegionMutation = useMutation({
    mutationFn: async (regionDetails: RegionFormTypes) => {
      return handleRegion.handleCreateRegionService(regionDetails);
    },
    onSuccess: () => {
      // Invalidate all regions queries (all pages)
      queryClient.invalidateQueries({ 
        queryKey: ['Regions'],
        exact: false // This invalidates all queries starting with ['Regions']
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // Update Region
  const updateRegionMutation = useMutation({
    mutationFn: async ({ id, regionDetails }: { id: string; regionDetails: Partial<UpdateRegionFormTypes> }) => {
      return handleRegion.handleUpdateRegionService(regionDetails, id);
    },
    onSuccess: () => {
      // Invalidate all regions queries
      queryClient.invalidateQueries({ 
        queryKey: ['Regions'],
        exact: false 
      });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  // Delete region mutation
  const deleteRegionMutation = useMutation({
    mutationFn: async (id: string) => {
      const deleteRegion = handleRegion.handleDeleteRegionService(id);
      return deleteRegion;
    },
    onSuccess: () => {
      // Invalidate all regions queries
      queryClient.invalidateQueries({ 
        queryKey: ['Regions'],
        exact: false 
      });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  return {
    // Queries
    getRegions: getRegionsQuery.data?.data || [],
    pagination: getRegionsQuery.data?.pagination,
    isLoading: getRegionsQuery.isLoading,
    error: getRegionsQuery.error,

    // Mutations
    createRegion: createRegionMutation.mutate,
    isCreating: createRegionMutation.isPending,
    updateRegion: updateRegionMutation.mutate,
    deleteRegion: deleteRegionMutation,

    // Mutation states
    isUpdating: updateRegionMutation.isPending,
    isDeleting: deleteRegionMutation.isPending,
    
    // Add refetch function
    refetch: getRegionsQuery.refetch,
  };
}

// Hook for fetching a single region
export function useSingleRegionQuery(id: string) {
  const singleRegionQuery = useQuery({
    queryKey: ['Regions', 'single', id], /* More specific key */
    queryFn: () => {
      const responseData = handleRegion.handleGetRegionService(id);
      return responseData;
    },
    enabled: !!id, /* Only run if id exists */
  });
  
  return {
    singleRegion: singleRegionQuery.data,
    error: singleRegionQuery.error,
    isLoading: singleRegionQuery.isLoading,
  };
}

// Hook to get vote names by region
export function useVoteNamesByRegion(regionId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.voteNamesByRegion(regionId),
    queryFn: async () => {
      const result = await getVoteNamesByRegion(regionId);
      return result.data as VoteName[];
    },
    enabled: enabled && !!regionId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}