import { CreateVoteNameFormTypes, MutationCreateVoteNameResponse, MutationUpdateVoteNameResponse, QueriesVoteNamesResponse, SingleQueryNameResponse, UpdateVoteNameFormTypes } from "@/types/vote-name";
import { PaginationParams } from "./users-data";
import { api } from "@/config/axios";

// Server Action: Get VoteNames
export async function getVoteNamesAction(pagination: PaginationParams): Promise<QueriesVoteNamesResponse> {
  try {
    const voteNames = await api.get(`votenames?page=${pagination.page || 1 }&limit=${pagination.limit || 10 }&search=${pagination.search||""}`);

    return {
      data: voteNames.data.voteNames,
      pagination: voteNames.data.pagination,
      error: null,
      message: "VoteNames Fetched Successfully...!!!✅",
    };
  } catch (error) {
    console.error(error);
    return {
      data: [],
      message: "Failed To Fetch VoteNames...!!!🥺",
      error: "❌ Error! Something went wrong while processing your request. Please try again or contact support. ⚠️",
    };
  }
}

// Server Action: Create Vote-Name
export async function createVoteNamesAction(
  voteNameDetails: CreateVoteNameFormTypes,
): Promise<MutationCreateVoteNameResponse> {
  try {
    const createVoteName = await api.post("/vote-names", voteNameDetails);
    return {
      success: true,
      data: createVoteName.data,
      message: "Vote-Name Has Been Saved Successfully...✅",
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      message: "Failed To Save Vote-Name...🥺😔",
      error:
        "❌ Error! Something went wrong while processing your request. Please try again or contact support. ⚠️",
    };
  }
}

// Server Action: Get Single Vote Name
export async function getVoteNameAction(
  id: string,
): Promise<SingleQueryNameResponse> {
  try {
    const voteName = await api.get(`/vote-names/${id}`);
    console.log(
      voteName.data,
      'Finally Vote-Name Has Reached The Frontend.....!!!⚛️⚛️⚛️',
    );
    return {
      data: voteName.data,
      error: null,
      message: 'Vote-Name Has Been Fetched Successfully...✅',
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      error:
        '❌ Error! Something went wrong while processing your request. Please try again or contact support. ⚠️',
      message: 'Failed To Fetch Vote-Name From The Database...!!!🥺😔',
    };
  }
}

// Server Action: Update Vote-Name
export async function updateVoteNameAction(
  voteNameDetails: UpdateVoteNameFormTypes, id: string
): Promise<MutationUpdateVoteNameResponse> {
  try {
    const updateVoteName = await api.patch(`/vote-names/${id}`, voteNameDetails);
    return {
      success: true,
      data: updateVoteName.data,
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

// Server Action: Delete VoteName Action
export async function deleteVoteNameAction(
  id: string
): Promise<SingleQueryNameResponse> {
  try {
    const deleteVoteName = await api.delete(`/vote-names/${id}`);
    return {
      data: deleteVoteName.data,
      error: null,
      message: "Vote-Name deleted successfully...!!!✅",
    };
  } catch (error) {
    console.log(error);
    return {
      message: "Failed to delete Vote-Name...!!!🥺",
      data: null,
      error:
        '❌ Error! Something went wrong while processing your request. Please try again or contact support. ⚠️',
    };
  }
}
