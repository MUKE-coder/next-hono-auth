import { getSingleUserData, updateUserService } from "@/actions/users";
import {
  getUsersData,
  PaginationParams,
  QueriesUsersDataResponse,
} from "@/actions/users-data";
import { UpdateUserAndProfileInput } from "@/types";

interface UsersDataServiceProps {
  // getAll: () => Promise<MinUsersDataProps[]>;
  getUsers: (pagination: PaginationParams) => Promise<QueriesUsersDataResponse>;
  getUser: (id: string) => any;
  // createUser: (data: CreateUser) => Promise<MutationUsersResponse>;
  updateUser: (data: UpdateUserAndProfileInput, id: string) => any;
}

export const usersDataServices: UsersDataServiceProps = {
  // getAll: async () => {
  //   const res = await getMinUsersData();
  //   const usersData = res.data;
  //   if (!usersData) {
  //     return [];
  //   }
  //   return usersData;
  // },
  getUsers: async (pagination: PaginationParams) => {
    const res = await getUsersData(pagination);
    if (!res || !res.data) {
      return {
        success: false,
        data: {
          users: [],
          pagination: {
            page: 1,
            totalPages: 1,
            total: 0,
            limit: 10,
            hasNext: false,
            hasPrev: false,
          },
        },
      };
    }
    return {
      success: res.success ?? true,
      data: res.data,
    };
  },

  getUser: async (userId: string) => {
    const res = await getSingleUserData(userId);
    // console.log('Response 🟩🟩🟩', res);

    if (!res) {
      return {
        success: false,
        data: null,
      };
    }

    // console.log('Response 🟩🟩🟩', res);

    return {
      success: true,
      data: res.data,
    };
  },

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

  updateUser: async (data: UpdateUserAndProfileInput, id: string) => {
    const res = await updateUserService(data, id);
    if (!res || !res.data) {
      return {
        success: false,
        data: null,
      };
    }
    return {
      success: res.success ?? true,
      data: res.data,
    };
  },
};
