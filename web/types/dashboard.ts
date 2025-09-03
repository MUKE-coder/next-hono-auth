// ===== DASHBOARD TYPES & INTERFACES =====

import { UserStatus, UserCategory, GENDER } from "@prisma/client";

// ===== METRIC TYPES =====

export interface MetricTrend {
  value: number;
  isPositive: boolean;
  period: string;
}

export interface MetricData {
  count: number;
  trend?: MetricTrend;
}

export interface MetricCardData {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: MetricTrend;
  loading?: boolean;
  error?: string;
  gradient: string;
  iconBg: string;
}

// ===== CHART DATA TYPES =====

export interface RegistrationTrendData {
  month: string;
  registrations: number;
  period: string;
}

export interface RegistrationTrendsResponse {
  data: RegistrationTrendData[];
}

export interface StatusDistributionData {
  status: UserStatus;
  count: number;
  percentage: number;
  name: string;
}

export interface StatusDistributionResponse {
  data: StatusDistributionData[];
}

export interface CategoryDistributionData {
  category: UserCategory;
  count: number;
  percentage: number;
  name: string;
}

export interface CategoryDistributionResponse {
  data: CategoryDistributionData[];
}

export interface RegionalDistributionData {
  region: string;
  count: number;
  district: string;
}

export interface RegionalDistributionResponse {
  data: RegionalDistributionData[];
}

export interface GenderDistributionData {
  gender: GENDER;
  count: number;
  percentage: number;
  name: string;
}

export interface GenderDistributionResponse {
  data: GenderDistributionData[];
}

export interface AverageAgeData {
  averageAge: number;
  totalMembers: number;
  ageRange: {
    min: number;
    max: number;
  };
}

// ===== TABLE DATA TYPES =====

export interface MemberTableData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  registrationDate: string;
  status: UserStatus;
  category?: UserCategory;
  district?: string;
  trackingNumber?: string;
  dateOfBirth?: string;
}

export interface RecentRegistrationsResponse {
  data: MemberTableData[];
}

export interface PendingApprovalsResponse {
  data: MemberTableData[];
}

// ===== MEMBER MANAGEMENT TYPES =====

export interface MemberApprovalResponse {
  success: boolean;
  memberNumber?: string;
  user: {
    id: string;
    surname: string;
    otherNames?: string;
    email: string;
    status: UserStatus;
  };
}

export interface MemberRejectionResponse {
  success: boolean;
  user: {
    id: string;
    surname: string;
    otherNames?: string;
    email: string;
    status: UserStatus;
  };
}

// ===== DASHBOARD SUMMARY TYPES =====

export interface DashboardSummary {
  totalMembers: number;
  activeMembers: number;
  pendingMembers: number;
  thisMonthRegistrations: number;
  activationRate: number;
}

// ===== COMPONENT PROP TYPES =====

export interface DashboardMetricsProps {
  refreshInterval?: number;
}

export interface DashboardChartsProps {
  refreshInterval?: number;
}

export interface DashboardTablesProps {
  refreshInterval?: number;
  pageSize?: number;
}

// ===== CHART COMPONENT TYPES =====

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

export interface PieTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      percentage: number;
    };
  }>;
}

// ===== TABLE COMPONENT TYPES =====

export interface TableCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
  actions?: React.ReactNode;
}

export interface StatusBadgeProps {
  status: UserStatus;
}

export interface CategoryBadgeProps {
  category: UserCategory;
}

// ===== FILTER & SEARCH TYPES =====

export interface TableFilters {
  status?: UserStatus[];
  category?: UserCategory[];
  district?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface SearchParams {
  query: string;
  filters: TableFilters;
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number;
  pageSize: number;
}

// ===== ACTION TYPES =====

export interface BulkMemberAction {
  memberIds: string[];
  action: "approve" | "reject" | "suspend" | "activate";
}

export interface BulkActionResponse {
  success: boolean;
  processedCount: number;
  failedCount: number;
  errors?: string[];
}

// ===== EXPORT TYPES =====

export interface ExportOptions {
  format: "csv" | "xlsx" | "pdf";
  includeFields: string[];
  filters?: TableFilters;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ExportResponse {
  success: boolean;
  downloadUrl?: string;
  fileName?: string;
  error?: string;
}

// ===== NOTIFICATION TYPES =====

export interface DashboardNotification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

// ===== SETTINGS TYPES =====

export interface DashboardSettings {
  refreshIntervals: {
    metrics: number;
    charts: number;
    tables: number;
  };
  defaultPageSize: number;
  autoRefresh: boolean;
  notifications: boolean;
  theme: "light" | "dark" | "system";
}

// ===== API RESPONSE TYPES =====

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// ===== ERROR TYPES =====

export interface DashboardError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

// ===== LOADING STATES =====

export interface LoadingState {
  metrics: boolean;
  charts: boolean;
  tables: boolean;
  actions: boolean;
}

// ===== UTILITY TYPES =====

export type SortDirection = "asc" | "desc";

export type ChartType = "line" | "bar" | "pie" | "donut" | "area";

export type MetricPeriod = "today" | "week" | "month" | "quarter" | "year";

export type MemberActionType =
  | "approve"
  | "reject"
  | "suspend"
  | "activate"
  | "view"
  | "edit"
  | "delete";

// ===== CONSTANTS =====

export const STATUS_COLORS = {
  ACTIVE: "#10b981",
  PENDING: "#f59e0b",
  SUSPENDED: "#ef4444",
  INACTIVE: "#6b7280",
} as const;

export const CATEGORY_COLORS = [
  "#3b82f6", // PUBLIC_SERVICE - Blue
  "#8b5cf6", // PRIVATE_SECTOR - Purple
  "#06b6d4", // NON_PROFIT - Cyan
  "#84cc16", // RETIRED - Green
  "#f97316", // CLINICS - Orange
] as const;

export const REGIONAL_COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
] as const;

export const STATUS_LABELS = {
  ACTIVE: "Active",
  PENDING: "Pending",
  SUSPENDED: "Suspended",
  INACTIVE: "Inactive",
} as const;

export const CATEGORY_LABELS = {
  PUBLIC_SERVICE: "Public Service",
  PRIVATE_SECTOR: "Private Sector",
  NON_PROFIT: "Non-Profit",
  RETIRED: "Retired",
  CLINICS: "Clinics",
} as const;

export const GENDER_LABELS = {
  MALE: "Male",
  FEMALE: "Female",
} as const;

// ===== QUERY KEYS =====

export const QUERY_KEYS = {
  // Metrics
  totalMembers: ["totalMembers"] as const,
  activeMembers: ["activeMembers"] as const,
  pendingApprovals: ["pendingApprovals"] as const,
  newRegistrationsThisMonth: ["newRegistrationsThisMonth"] as const,
  suspendedInactiveMembers: ["suspendedInactiveMembers"] as const,

  // Charts
  registrationTrends: ["registrationTrends"] as const,
  statusDistribution: ["statusDistribution"] as const,
  categoryDistribution: ["categoryDistribution"] as const,
  regionalDistribution: ["regionalDistribution"] as const,
  genderDistribution: ["genderDistribution"] as const,
  averageAge: ["averageAge"] as const,

  // Tables
  recentRegistrations: ["recentRegistrations"] as const,
  pendingApprovalsTable: ["pendingApprovalsTable"] as const,

  // Summary
  dashboardSummary: ["dashboardSummary"] as const,
} as const;

// ===== DEFAULT VALUES =====

export const DEFAULT_REFRESH_INTERVALS = {
  metrics: 30000, // 30 seconds
  charts: 300000, // 5 minutes
  tables: 15000, // 15 seconds for pending approvals
  recentRegistrations: 30000, // 30 seconds
} as const;

export const DEFAULT_PAGE_SIZE = 20;

export const DEFAULT_DASHBOARD_SETTINGS: DashboardSettings = {
  refreshIntervals: DEFAULT_REFRESH_INTERVALS,
  defaultPageSize: DEFAULT_PAGE_SIZE,
  autoRefresh: true,
  notifications: true,
  theme: "light",
};

// ===== TYPE GUARDS =====

export function isValidUserStatus(status: string): status is UserStatus {
  return Object.values(UserStatus).includes(status as UserStatus);
}

export function isValidUserCategory(
  category: string
): category is UserCategory {
  return Object.values(UserCategory).includes(category as UserCategory);
}

export function isValidGender(gender: string): gender is GENDER {
  return Object.values(GENDER).includes(gender as GENDER);
}

// ===== HELPER TYPES =====

export type ExtractArrayType<T> = T extends (infer U)[] ? U : never;

export type NonNullable<T> = T extends null | undefined ? never : T;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Required<T, K extends keyof T> = Omit<T, K> &
  RequiredFields<Pick<T, K>>;

type RequiredFields<T> = {
  [K in keyof T]-?: T[K];
};
