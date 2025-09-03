// import {
//   createUsersData,
//   getMinUsersData,
//   getSingleUserData,
//   getUsersData,
//   updateUsersData,
// } from "@/actions/users-data";
// import { PaginationParams } from "@/hooks/useDepartmentQueries";
// import {
//   CreateUser,
//   MinUsersDataProps,
//   MutationUsersResponse,
//   QueriesSingleUserDataResponse,
//   QueriesUsersDataResponse,
//   UpdateUserProps,
// } from "@/types/types";

import { getMembersData, QueriesMembersDataResponse } from "@/actions/members";
import {
  getUsersData,
  PaginationParams,
  QueriesUsersDataResponse,
} from "@/actions/users-data";

interface MembersDataServiceProps {
  // getAll: () => Promise<MinUsersDataProps[]>;
  getMembers: (
    pagination: PaginationParams
  ) => Promise<QueriesMembersDataResponse>;
  // getUser: (id: string) => Promise<QueriesSingleUserDataResponse>;
  // createUser: (data: CreateUser) => Promise<MutationUsersResponse>;
  // updateUser: (
  //   data: UpdateUserProps,
  //   id: string
  // ) => Promise<MutationUsersResponse>;
}

export const membersDataServices: MembersDataServiceProps = {
  // getAll: async () => {
  //   const res = await getMinUsersData();
  //   const usersData = res.data;
  //   if (!usersData) {
  //     return [];
  //   }
  //   return usersData;
  // },
  getMembers: async (pagination: PaginationParams) => {
    const res = await getMembersData(pagination);
    if (!res || !res.data) {
      return {
        success: false,
        data: {
          users: [],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalCount: 0,
            hasNext: false,
            hasPrev: false,
          },
        },
      };
    }
    // console.log(res.data);
    return {
      success: res.success ?? true,
      data: res.data,
    };
  },
  // getUser: async (id: string) => {
  //   const res = await getSingleUserData(id);
  //   if (!res || !res.data) {
  //     return {
  //       success: false,
  //       data: null,
  //     };
  //   }
  //   return {
  //     success: res.success ?? true,
  //     data: res.data,
  //   };
  // },
  // createUser: async (data: CreateUser) => {
  //   const res = await createUsersData(data);
  //   if (!res || !res.data) {
  //     return {
  //       success: false,
  //       data: null,
  //     };
  //   }
  //   return {
  //     success: res.success ?? true,
  //     data: res.data,
  //   };
  // },
  // updateUser: async (data: UpdateUserProps, id: string) => {
  //   const res = await updateUsersData(data, id);
  //   if (!res || !res.data) {
  //     return {
  //       success: false,
  //       data: null,
  //     };
  //   }
  //   return {
  //     success: res.success ?? true,
  //     data: res.data,
  //   };
  // },
};
