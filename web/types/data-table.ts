import type React from "react";

export interface School {
  id: string;
  name: string;
  code: string;
  logo?: string;
  students: number;
  teachers: number;
  applications: number;
  status: "active" | "inactive" | "pending" | "suspended";
  type: "public" | "private" | "charter";
  district: string;
  established: string;
  rating: number;
  location: string;
}

export interface DataTableColumn<T = any> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  className?: string;
}

export interface DataTableFilter {
  id: string;
  label: string;
  options: { label: string; value: string; count?: number }[];
  defaultValue?: string;
}

export interface DataTableAction<T = any> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  variant?: "default" | "destructive" | "secondary";
  href?: string;
  className?: string;
}

export interface DataTableConfig<T = any> {
  columns: DataTableColumn<T>[];
  data: T[];
  filters?: DataTableFilter[];
  actions?: DataTableAction<T>[];
  searchPlaceholder?: string;
  showAddButton?: boolean;
  addButtonLabel?: string;
  addButtonHref?: string;
  onAddClick?: () => void;
  showViewToggle?: boolean;
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  pageSize?: number;
}

export type ViewMode = "table" | "grid";

export interface FilterState {
  [key: string]: string;
}
