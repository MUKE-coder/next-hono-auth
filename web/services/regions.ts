import { RegionFormTypes } from '@/schemas/region.schema';
import {
  MutationUpdateRegionResponse,
  QueriesRegionsResponse,
  ReactQueryRegionFormTypes,
  SingleQueryRegionResponse,
  UpdateRegionFormTypes,
} from '@/types/region';
import {
  createRegionAction,
  deleteRegionAction,
  getRegionAction,
  getRegions,
  updateRegionAction,
} from '@/actions/regions';
import { PaginationParams } from '@/actions/users-data';

type UseRegionState = {
  handleGetAllRegionsService: (
    pagination: PaginationParams,
  ) => Promise<QueriesRegionsResponse>;
  handleGetRegionService: (id: string) => Promise<ReactQueryRegionFormTypes>;
  handleCreateRegionService: (regionDetails: RegionFormTypes) => void;
  handleUpdateRegionService: (
    regionDetails: UpdateRegionFormTypes,
    id: string,
  ) => Promise<MutationUpdateRegionResponse>;
  handleDeleteRegionService: (id: string) => Promise<SingleQueryRegionResponse>;
};

export const handleRegion: UseRegionState = {
  async handleCreateRegionService(regionDetails: RegionFormTypes) {
    const createRegion = await createRegionAction(regionDetails);
    // console.log(createRegion, "Region Created Successfully👍🏾");
    return createRegion.data;
  },
  async handleGetAllRegionsService(pagination: PaginationParams) {
    const getAllRegions = await getRegions(pagination);
    return {
        data:getAllRegions.data,
        pagination:getAllRegions.pagination,
        error:getAllRegions.error,
        message:getAllRegions.message
    };
  },
  async handleGetRegionService(id) {
    const getSingleRegion = await getRegionAction(id);
    // console.log(getSingleRegion.data, "Region Fetched Successfully👍🏾");
    return getSingleRegion.data as ReactQueryRegionFormTypes;
  },
  async handleUpdateRegionService(regionDetails, id) {
    const updateRegion = await updateRegionAction(regionDetails, id);
    return updateRegion;
  },
  async handleDeleteRegionService(id) {
    const deleteRegion = await deleteRegionAction(id);
    return deleteRegion;
  },
};
