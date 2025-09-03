"use server";
import axios from "axios";
import { api } from "@/config/axios";
import { PaginationParams } from "./users-data";
import { RegionFormTypes } from "@/schemas/region.schema";
import { MutationCreateRegionResponse, MutationUpdateRegionResponse, QueriesRegionsResponse, SingleQueryRegionResponse, UpdateRegionFormTypes } from "@/types/region";

// Types for the data models
export interface Region {
  id: string;
  name: string;
  coordinator: string;
  contact: string | null;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface VoteName {
  id: string;
  code: number;
  name: string;
  regionId: string;
  createdAt: string;
  updatedAt: string;
}

// Server Action Response types
export interface ServerActionSuccess<T> {
  success: true;
  data: T;
}

export interface ServerActionError {
  success: false;
  error: string;
}

export type ServerActionResponse<T> =
  | ServerActionSuccess<T>
  | ServerActionError;

export interface RegionsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Server Action: Get Regions
export async function getRegions(pagination: PaginationParams): Promise<QueriesRegionsResponse> {
  try {
    const regions = await api.get(`regions?page=${pagination.page || 1 }&limit=${pagination.limit || 10 }&search=${pagination.search||""}`);

    return {
      data: regions.data.regions,
      pagination: regions.data.pagination,
      error: null,
      message: "Regions Fetched Successfully...!!!✅",
    };
  } catch (error) {
    console.error(error);
    return {
      data: [],
      message: "Failed To Fetch Regions...!!!🥺",
      error: "❌ Error! Something went wrong while processing your request. Please try again or contact support. ⚠️",
    };
  }
}

// Server Action: Create Region
export async function createRegionAction(
  regionDetails: RegionFormTypes,
): Promise<MutationCreateRegionResponse> {
  try {
    const createRegion = await api.post("/regions", regionDetails);
    return {
      success: true,
      data: createRegion.data,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      error:
        '❌ Error! Something went wrong while processing your request. Please try again or contact support. ⚠️',
    };
  }
}

// Server Action: Get Single Region
export async function getRegionAction(
  id: string,
): Promise<SingleQueryRegionResponse> {
  try {
    const region = await api.get(`/regions/${id}`);
    console.log(
      region.data,
      'Finally Region Has Reached The Frontend.....!!!',
    );
    return {
      data: region.data,
      error: null,
      message: 'Region Has Been Fetched Successfully...✅',
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      error:
        '❌ Error! Something went wrong while processing your request. Please try again or contact support. ⚠️',
      message: 'Failed To Fetch Category From The Database...!!!🥺',
    };
  }
}

// Server Action: Update Region
export async function updateRegionAction(
  regionDetails: UpdateRegionFormTypes, id: string
): Promise<MutationUpdateRegionResponse> {
  try {
    const updateRegion = await api.patch(`/regions/${id}`, regionDetails);
    return {
      success: true,
      data: updateRegion.data,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      error:
        '❌ Error! Something went wrong while processing your request. Please try again or contact support. ⚠️',
    };
  }
}

// Server Action: Delete Region
export async function deleteRegionAction(
  id: string
): Promise<SingleQueryRegionResponse> {
  try {
    const deleteRegion = await api.delete(`/regions/${id}`);
    return {
      data: deleteRegion.data,
      error: null,
      message: "Region deleted successfully...!!!✅",
    };
  } catch (error) {
    console.log(error);
    return {
      message: "Failed to delete Region...!!!🥺",
      data: null,
      error:
        '❌ Error! Something went wrong while processing your request. Please try again or contact support. ⚠️',
    };
  }
}

// Server Action: Get Vote Names by Region
export async function getVoteNamesByRegion(regionId: string) {
  try {
    console.log("Getting vote names for region:", regionId);

    // Make API call to get vote names by region
    const response = await api.get(`/vote-names/region/${regionId}`);

    if (response.status != 200) {
      return {
        success: false,
        error: response.data.message || "Failed to fetch vote names",
      };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Get vote names by region error:", error);

    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      return {
        success: false,
        error: responseData?.message || "Failed to fetch vote names.",
      };
    }

    return {
      success: false,
      error: "Failed to fetch vote names.",
    };
  }
}
