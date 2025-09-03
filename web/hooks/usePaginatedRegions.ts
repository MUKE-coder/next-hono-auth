// "use client";

// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
// import {
//   getRegions,
//   createRegion,
//   updateRegion,
//   deleteRegion,
//   type RegionsResponse,
//   type RegionsParams,
//   type Region,
// } from "@/actions/regions-data";
// import { ReactQueryRegionFormTypes } from "@/types/region";

// // Query keys for better cache management
// export const REGIONS_QUERY_KEYS = {
//   all: ["regions"] as const,
//   lists: () => [...REGIONS_QUERY_KEYS.all, "list"] as const,
//   list: (params: RegionsParams) =>
//     [...REGIONS_QUERY_KEYS.lists(), params] as const,
//   details: () => [...REGIONS_QUERY_KEYS.all, "detail"] as const,
//   detail: (id: string) => [...REGIONS_QUERY_KEYS.details(), id] as const,
// } as const;

// // Main hook for fetching regions with pagination and search
// export function useRegions(params: RegionsParams = {}) {
//   return useQuery<RegionsResponse, Error>({
//     queryKey: REGIONS_QUERY_KEYS.list(params),
//     queryFn: () => getRegions(params),
//     staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
//     gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
//     retry: 3,
//     retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
//     refetchOnWindowFocus: false,
//     refetchOnMount: true,
//     // Enable background refetching
//     refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
//   });
// }

// // Hook for creating a new region
// export function useCreateRegion() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: createRegion,
//     onSuccess: (data) => {
//       // Invalidate and refetch regions queries
//       queryClient.invalidateQueries({ queryKey: REGIONS_QUERY_KEYS.lists() });

//       toast.success("Region created successfully!", {
//         description: `${data.data?.name} has been added to the system.`,
//       });
//     },
//     onError: (error: Error) => {
//       toast.error("Failed to create region", {
//         description: error.message,
//       });
//     },
//   });
// }

// // Hook for updating a region
// export function useUpdateRegion() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       id,
//       data,
//     }: {
//       id: string;
//       data: Partial<Omit<Region, "id" | "createdAt" | "updatedAt">>;
//     }) => updateRegion(id, data),
//     onSuccess: (data, variables) => {
//       // Invalidate and refetch regions queries
//       queryClient.invalidateQueries({ queryKey: REGIONS_QUERY_KEYS.lists() });
//       queryClient.invalidateQueries({
//         queryKey: REGIONS_QUERY_KEYS.detail(variables.id),
//       });

//       toast.success("Region updated successfully!", {
//         description: `${data.data?.name} has been updated.`,
//       });
//     },
//     onError: (error: Error) => {
//       toast.error("Failed to update region", {
//         description: error.message,
//       });
//     },
//   });
// }

// // Hook for deleting a region
// export function useDeleteRegion() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: deleteRegion,
//     onSuccess: (data, regionId) => {
//       // Invalidate and refetch regions queries
//       queryClient.invalidateQueries({ queryKey: REGIONS_QUERY_KEYS.lists() });
//       queryClient.removeQueries({
//         queryKey: REGIONS_QUERY_KEYS.detail(regionId),
//       });

//       toast.success("Region deleted successfully!", {
//         description: "The region has been removed from the system.",
//       });
//     },
//     onError: (error: Error) => {
//       toast.error("Failed to delete region", {
//         description: error.message,
//       });
//     },
//   });
// }

// // Enhanced hook with additional utilities
// export function useRegionsWithUtils(params: RegionsParams = {}) {
//   const query = useRegions(params);
//   const createMutation = useCreateRegion();
//   const updateMutation = useUpdateRegion();
//   const deleteMutation = useDeleteRegion();

//   // Utility functions
//   const getRegionById = (id: string) => {
//     return query.data?.data.find((region) => region.id === id);
//   };

//   const getRegionByName = (name: string) => {
//     return query.data?.data.find(
//       (region) => region.name.toLowerCase() === name.toLowerCase()
//     );
//   };

//   const getTotalRegions = () => {
//     return query.data?.pagination?.total || 0;
//   };

//   const getCurrentPage = () => {
//     return query.data?.pagination?.page || 1;
//   };

//   const getTotalPages = () => {
//     return query.data?.pagination?.totalPages || 1;
//   };

//   const hasNextPage = () => {
//     const current = getCurrentPage();
//     const total = getTotalPages();
//     return current < total;
//   };

//   const hasPreviousPage = () => {
//     return getCurrentPage() > 1;
//   };

//   const getRegionStats = () => {
//     const regions = query.data?.data || [];
//     const totalRegions = regions.length;
//     const regionsWithContact = regions.filter((r) => r.contact).length;
//     const regionsWithEmail = regions.filter((r) => r.email).length;

//     return {
//       total: totalRegions,
//       withContact: regionsWithContact,
//       withEmail: regionsWithEmail,
//       contactPercentage:
//         totalRegions > 0
//           ? Math.round((regionsWithContact / totalRegions) * 100)
//           : 0,
//       emailPercentage:
//         totalRegions > 0
//           ? Math.round((regionsWithEmail / totalRegions) * 100)
//           : 0,
//     };
//   };

//   const formatRegionForDisplay = (region: ReactQueryRegionFormTypes) => {
//     return {
//       ...region,
//       displayName: region.name,
//       coordinatorName: region.coordinator,
//       contactInfo: region.contact || region.email || "No contact info",
//       createdDate: new Date(region.createdAt).toLocaleDateString("en-GB", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//       }),
//       updatedDate: new Date(region.updatedAt).toLocaleDateString("en-GB", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//       }),
//       hasContact: !!(region.contact || region.email),
//     };
//   };

//   // Action helpers
//   const createRegion = (
//     regionData: Omit<Region, "id" | "createdAt" | "updatedAt">
//   ) => {
//     return createMutation.mutate(regionData);
//   };

//   const updateRegion = (
//     id: string,
//     regionData: Partial<Omit<Region, "id" | "createdAt" | "updatedAt">>
//   ) => {
//     return updateMutation.mutate({ id, data: regionData });
//   };

//   const deleteRegion = (id: string) => {
//     return deleteMutation.mutate(id);
//   };

//   return {
//     // Query data
//     ...query,
//     regions: query.data?.data || [],
//     pagination: query.data?.pagination,

//     // Mutations
//     createMutation,
//     updateMutation,
//     deleteMutation,

//     // Utility functions
//     utils: {
//       getRegionById,
//       getRegionByName,
//       getTotalRegions,
//       getCurrentPage,
//       getTotalPages,
//       hasNextPage,
//       hasPreviousPage,
//       getRegionStats,
//       formatRegionForDisplay,
//     },

//     // Action helpers
//     actions: {
//       createRegion,
//       updateRegion,
//       deleteRegion,
//     },
//   };
// }

// // Simple hook for just getting regions data (useful for dropdowns, etc.)
// export function useRegionsData(params: RegionsParams = {}) {
//   const { data, isLoading, error } = useRegions(params);

//   return {
//     regions: data?.data || [],
//     pagination: data?.pagination,
//     isLoading,
//     error,
//   };
// }
