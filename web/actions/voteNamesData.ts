"use server";

import { API_BASE_URL } from "@/config/axios";

// Types based on the API response
export interface VoteNameRegion {
  id           :string;
  name         :string;
  coordinator  :string;
  contact      :string;
  email        :string;
  createdAt    :Date | string;
  updatedAt    :Date | string;
}

export interface VoteName {
  id: string;
  code: number;
  name: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  regionId: string;
  region: VoteNameRegion;
}

export interface VoteNamesResponse {
  success: boolean;
  data: VoteName[];
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface VoteNamesParams {
  page?: number;
  limit?: number;
  search?: string;
  regionId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Server action to fetch vote names
export async function getVoteNames(params: VoteNamesParams = {}) {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      regionId = "",
      sortBy = "name",
      sortOrder = "asc",
    } = params;

    const response = await fetch(`${API_BASE_URL}/api/vote-names`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add any auth headers if needed
        // 'Authorization': `Bearer ${token}`,
      },
      // Enable caching for better performance
      next: { revalidate: 600 }, // Cache for 10 minutes
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch vote names: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Since API returns a simple array, handle it directly
    if (!Array.isArray(data)) {
      throw new Error(
        "Invalid response format: expected an array of vote names"
      );
    }

    const voteNames = data as VoteName[];

    // Filter on client side
    let filteredVoteNames = voteNames;

    // Apply search filter
    if (search.trim()) {
      const searchTerm = search.toLowerCase();
      filteredVoteNames = filteredVoteNames.filter(
        (voteName) =>
          voteName.name.toLowerCase().includes(searchTerm) ||
          voteName.code.toString().includes(searchTerm) ||
          voteName.region.name.toLowerCase().includes(searchTerm)
      );
    }

    // Apply region filter
    if (regionId.trim()) {
      filteredVoteNames = filteredVoteNames.filter(
        (voteName) => voteName.regionId === regionId
      );
    }

    // Sort on client side
    const sortedVoteNames = [...filteredVoteNames].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case "code":
          aValue = a.code;
          bValue = b.code;
          break;
        case "region":
          aValue = a.region.name.toLowerCase();
          bValue = b.region.name.toLowerCase();
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default: // name
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        const comparison = aValue - bValue;
        return sortOrder === "asc" ? comparison : -comparison;
      } else {
        const comparison = aValue.toString().localeCompare(bValue.toString());
        return sortOrder === "asc" ? comparison : -comparison;
      }
    });

    // Implement pagination on client side
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedVoteNames = sortedVoteNames.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedVoteNames,
      pagination: {
        page,
        limit,
        total: sortedVoteNames.length,
        totalPages: Math.ceil(sortedVoteNames.length / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching vote names:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while fetching vote names"
    );
  }
}

// Server action to create a new vote name
export async function createVoteName(
  voteNameData: Omit<VoteName, "id" | "createdAt" | "updatedAt" | "region"> & {
    regionId: string;
  }
) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vote-names`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(voteNameData),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create vote name: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return {
      success: true,
      data: data,
      message: "Vote name created successfully",
    };
  } catch (error) {
    console.error("Error creating vote name:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while creating vote name"
    );
  }
}

// Server action to update a vote name
export async function updateVoteName(
  voteNameId: string,
  voteNameData: Partial<
    Omit<VoteName, "id" | "createdAt" | "updatedAt" | "region">
  >
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/vote-names/${voteNameId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(voteNameData),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to update vote name: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return {
      success: true,
      data: data,
      message: "Vote name updated successfully",
    };
  } catch (error) {
    console.error("Error updating vote name:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while updating vote name"
    );
  }
}

// Server action to delete a vote name
export async function deleteVoteName(voteNameId: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/vote-names/${voteNameId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to delete vote name: ${response.status} ${response.statusText}`
      );
    }

    // Delete might return empty response or simple confirmation
    let data = null;
    const text = await response.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        // If response is not JSON, that's okay for delete
      }
    }

    return {
      success: true,
      message: "Vote name deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting vote name:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while deleting vote name"
    );
  }
}
