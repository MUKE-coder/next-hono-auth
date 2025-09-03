export type ReactQueryRegionFormTypes = {
  id           :string;
  name         :string;
  coordinator  :string;
  contact      :string;
  email        :string;
  createdAt    :Date;
  updatedAt    :Date;
};

export interface CreateRegionFormTypes extends Omit<ReactQueryRegionFormTypes, "id" | "createdAt" | "updatedAt"> {}

export interface UpdateRegionFormTypes extends Partial<CreateRegionFormTypes> {}

// For All Categories Response
export type QueriesRegionsResponse = {
  data: ReactQueryRegionFormTypes[] | [];
  error: string | null;
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// For Single Region Query Response
export type SingleQueryRegionResponse = {
  data: ReactQueryRegionFormTypes | null;
  error: string | null;
  message: string;
};

// For create mutation operations Response Or For Creating Product
export type MutationCreateRegionResponse = {
  success: boolean;
  data: CreateRegionFormTypes | null;
  error: string | null;
};

// For Updating Product Mutation Operations Response
export type MutationUpdateRegionResponse = {
  success: boolean;
  data: UpdateRegionFormTypes | null;
  error: string | null;
};
