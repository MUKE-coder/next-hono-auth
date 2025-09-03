import { PaginationParams } from '@/actions/users-data';
import { CreateVoteNameFormTypes, MutationUpdateVoteNameResponse, QueriesVoteNamesResponse, ReactQueryVoteNameFormTypes, SingleQueryNameResponse, UpdateVoteNameFormTypes } from '@/types/vote-name';
import { createVoteNamesAction, deleteVoteNameAction, getVoteNameAction, getVoteNamesAction, updateVoteNameAction } from '@/actions/voteNames';

type UseVoteNameState = {
  handleGetAllVoteNamesService: (
    pagination: PaginationParams,
  ) => Promise<QueriesVoteNamesResponse>;
  handleGetVoteNameService: (id: string) => Promise<ReactQueryVoteNameFormTypes>;
  handleCreateVoteNameService: (voteNameDetails: CreateVoteNameFormTypes) => void;
  handleUpdateVoteNameService: (
    voteNameDetails: UpdateVoteNameFormTypes,
    id: string,
  ) => Promise<MutationUpdateVoteNameResponse>;
  handleDeleteVoteNameService: (id: string) => Promise<SingleQueryNameResponse>;
};

export const handleVoteName: UseVoteNameState = {
  async handleCreateVoteNameService(voteNameDetails: CreateVoteNameFormTypes) {
    const createVoteName = await createVoteNamesAction(voteNameDetails);
    return createVoteName;
  },
  async handleGetAllVoteNamesService(pagination: PaginationParams) {
    const getAllVoteNames = await getVoteNamesAction(pagination);
    return {
        data:getAllVoteNames.data,
        pagination:getAllVoteNames.pagination,
        error:getAllVoteNames.error,
        message:getAllVoteNames.message
    };
  },
  async handleGetVoteNameService(id) {
    const getSingleVoteName = await getVoteNameAction(id);
    return getSingleVoteName.data as ReactQueryVoteNameFormTypes;
  },
  async handleUpdateVoteNameService(voteNameDetails, id) {
    const updateVoteName = await updateVoteNameAction(voteNameDetails, id);
    return updateVoteName;
  },
  async handleDeleteVoteNameService(id) {
    const deleteVoteName = await deleteVoteNameAction(id);
    return deleteVoteName;
  },
};
