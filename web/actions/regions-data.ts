// "use server";

// import { API_BASE_URL } from "@/config/axios";
// import { ReactQueryRegionFormTypes } from "@/types/region";

// // Types based on the API response
// export interface Region {
//   id: string;
//   name: string;
//   coordinator: string;
//   contact: string | null;
//   email: string | null;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface RegionsResponse {
//   success: boolean;
//   data: Region[];
//   message?: string;
//   pagination?: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
// }

// export interface RegionsParams {
//   page?: number;
//   limit?: number;
//   search?: string;
//   sortBy?: string;
//   sortOrder?: "asc" | "desc";
// }

// // Server action to fetch regions
// export async function getRegions(params: RegionsParams = {}) {
//   try {
//     const {
//       page = 1,
//       limit = 20,
//       search = "",
//       sortBy = "name",
//       sortOrder = "asc",
//     } = params;

//     const response = await fetch(`${API_BASE_URL}/api/regions`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         // Add any auth headers if needed
//         // 'Authorization': `Bearer ${token}`,
//       },
//       // Enable caching for better performance
//       next: { revalidate: 600 }, // Cache for 10 minutes
//     });

//     if (!response.ok) {
//       throw new Error(
//         `Failed to fetch regions: ${response.status} ${response.statusText}`
//       );
//     }

//     const data = await response.json();

//     // Since API returns a simple array, handle it directly
//     if (!Array.isArray(data)) {
//       throw new Error("Invalid response format: expected an array of regions");
//     }

//     const regions = data as Region[];

//     // Filter on client side if search is provided
//     const filteredRegions = search.trim()
//       ? regions.filter(
//           (region) =>
//             region.name.toLowerCase().includes(search.toLowerCase()) ||
//             region.coordinator.toLowerCase().includes(search.toLowerCase()) ||
//             (region.email &&
//               region.email.toLowerCase().includes(search.toLowerCase()))
//         )
//       : regions;

//     // Sort on client side
//     const sortedRegions = [...filteredRegions].sort((a, b) => {
//       const aValue = (a[sortBy as keyof Region] || "").toString().toLowerCase();
//       const bValue = (b[sortBy as keyof Region] || "").toString().toLowerCase();

//       const comparison = aValue.localeCompare(bValue);
//       return sortOrder === "asc" ? comparison : -comparison;
//     });

//     // Implement pagination on client side
//     const startIndex = (page - 1) * limit;
//     const endIndex = startIndex + limit;
//     const paginatedRegions = sortedRegions.slice(startIndex, endIndex);

//     return {
//       success: true,
//       data: paginatedRegions,
//       pagination: {
//         page,
//         limit,
//         total: sortedRegions.length,
//         totalPages: Math.ceil(sortedRegions.length / limit),
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching regions:", error);
//     throw new Error(
//       error instanceof Error
//         ? error.message
//         : "An unexpected error occurred while fetching regions"
//     );
//   }
// }

// // Server action to create a new region
// export async function createRegion(
//   regionData: Omit<Region, "id" | "createdAt" | "updatedAt">
// ) {
//   try {
//     const response = await fetch(`${API_BASE_URL}/api/regions`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(regionData),
//     });

//     if (!response.ok) {
//       throw new Error(
//         `Failed to create region: ${response.status} ${response.statusText}`
//       );
//     }

//     const data = await response.json();

//     // Handle simple response - might return the created region directly or an array
//     return {
//       success: true,
//       data: data,
//       message: "Region created successfully",
//     };
//   } catch (error) {
//     console.error("Error creating region:", error);
//     throw new Error(
//       error instanceof Error
//         ? error.message
//         : "An unexpected error occurred while creating region"
//     );
//   }
// }

// // Server action to update a region
// export async function updateRegion(
//   regionId: string,
//   regionData: Partial<Omit<Region, "id" | "createdAt" | "updatedAt">>
// ) {
//   try {
//     const response = await fetch(`${API_BASE_URL}/api/regions/${regionId}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(regionData),
//     });

//     if (!response.ok) {
//       throw new Error(
//         `Failed to update region: ${response.status} ${response.statusText}`
//       );
//     }

//     const data = await response.json();

//     // Handle simple response
//     return {
//       success: true,
//       data: data,
//       message: "Region updated successfully",
//     };
//   } catch (error) {
//     console.error("Error updating region:", error);
//     throw new Error(
//       error instanceof Error
//         ? error.message
//         : "An unexpected error occurred while updating region"
//     );
//   }
// }

// // Server action to delete a region
// export async function deleteRegion(regionId: string) {
//   try {
//     const response = await fetch(`${API_BASE_URL}/api/regions/${regionId}`, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       throw new Error(
//         `Failed to delete region: ${response.status} ${response.statusText}`
//       );
//     }

//     // Delete might return empty response or simple confirmation
//     let data = null;
//     const text = await response.text();
//     if (text) {
//       try {
//         data = JSON.parse(text);
//       } catch {
//         // If response is not JSON, that's okay for delete
//       }
//     }

//     return {
//       success: true,
//       message: "Region deleted successfully",
//     };
//   } catch (error) {
//     console.error("Error deleting region:", error);
//     throw new Error(
//       error instanceof Error
//         ? error.message
//         : "An unexpected error occurred while deleting region"
//     );
//   }
// }
