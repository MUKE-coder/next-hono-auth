export type ReactQueryVoteNameFormTypes = {
  id           :string;
  name         :string;
  code         :number;
  region       :{
    id           :string;
    name         :string;
    coordinator  :string;
    contact      :string;
    email        :string;
    createdAt    :Date | string;
    updatedAt    :Date | string;
  }
  regionId     :string;
  createdAt    :Date | string;
  updatedAt    :Date | string;
};

export interface CreateVoteNameFormTypes extends Omit<ReactQueryVoteNameFormTypes, "id" | "region" | "createdAt" | "updatedAt"> {}

export interface UpdateVoteNameFormTypes extends Partial<CreateVoteNameFormTypes> {}

// For All Vote Response
export type QueriesVoteNamesResponse = {
  data: ReactQueryVoteNameFormTypes[] | [];
  error: string | null;
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// For Single VoteName Query Response
export type SingleQueryNameResponse = {
  data: ReactQueryVoteNameFormTypes | null;
  error: string | null;
  message: string;
};

// For create mutation operations Response Or For Creating Product
export type MutationCreateVoteNameResponse = {
  success: boolean;
  data: CreateVoteNameFormTypes | null;
  error: string | null;
  message: string;
};

// For Updating Vote Mutation Operations Response
export type MutationUpdateVoteNameResponse = {
  success: boolean;
  data: UpdateVoteNameFormTypes | null;
  error: string | null;
};
