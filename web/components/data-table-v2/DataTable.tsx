"use client";

import { useState, useMemo } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  RefreshCw,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DataTableConfig, FilterState, ViewMode } from "./types";
import { StatusBadge } from "./StatusBadge";
import { DataTableHeader } from "./DataTableHeader";

interface EnhancedDataTableProps<T> extends DataTableConfig<T> {
  className?: string;
  title?: string;
  subtitle?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  enableSelection?: boolean;
  showActions?: boolean;
  actionsColumnWidth?: string;
  filterState?: FilterState;
  onFilterChange?: (filterId: string, value: string) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  maxVisibleColumns?: number; // New prop to control column visibility
  priorityColumns?: string[]; // New prop to specify which columns should always be visible
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  filters = [],
  actions = [],
  searchPlaceholder = "Search...",
  showAddButton = true,
  addButtonLabel = "Add Item",
  onAddClick,
  showViewToggle = true,
  isLoading = false,
  error = null,
  onRefresh,
  pageSize = 10,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  enableSelection = true,
  showActions = true,
  actionsColumnWidth = "100px",
  className,
  title = "Data Management",
  subtitle = "Manage your data efficiently with advanced filtering and sorting capabilities.",
  filterState: externalFilterState,
  onFilterChange: externalOnFilterChange,
  searchValue: externalSearchValue,
  onSearchChange: externalOnSearchChange,
  maxVisibleColumns = 6,
  priorityColumns = [],
}: EnhancedDataTableProps<T>) {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [internalGlobalFilter, setInternalGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [internalFilterState, setInternalFilterState] = useState<FilterState>(
    {}
  );
  const [showAllColumns, setShowAllColumns] = useState(false);

  // Use external state if provided, otherwise use internal state
  const globalFilter =
    externalSearchValue !== undefined
      ? externalSearchValue
      : internalGlobalFilter;
  const setGlobalFilter = externalOnSearchChange || setInternalGlobalFilter;
  const filterState = externalFilterState || internalFilterState;
  const setFilterState = externalOnFilterChange
    ? (filterId: string, value: string) =>
        externalOnFilterChange(filterId, value)
    : (filterId: string, value: string) =>
        setInternalFilterState((prev) => ({ ...prev, [filterId]: value }));

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    return Object.values(filterState).filter(
      (value) => value && value !== "all"
    ).length;
  }, [filterState]);

  // Determine which columns to show based on screen space and priorities
  const visibleColumns = useMemo(() => {
    if (showAllColumns || columns.length <= maxVisibleColumns) {
      return columns;
    }

    // Sort columns by priority (priority columns first, then others)
    const prioritySet = new Set(priorityColumns);
    const sorted = [...columns].sort((a, b) => {
      const aPriority = prioritySet.has(a.id) ? 1 : 0;
      const bPriority = prioritySet.has(b.id) ? 1 : 0;
      return bPriority - aPriority;
    });

    return sorted.slice(0, maxVisibleColumns);
  }, [columns, maxVisibleColumns, priorityColumns, showAllColumns]);

  // Create table columns with selection and actions
  const tableColumns = useMemo<ColumnDef<T>[]>(() => {
    const cols: ColumnDef<T>[] = [];

    // Add selection column if enabled
    if (enableSelection) {
      cols.push({
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
              className="border-2 border-gray-300 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 data-[state=checked]:text-white w-4 h-4"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
              className="border-2 border-gray-300 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 data-[state=checked]:text-white w-4 h-4"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 50,
        minSize: 50,
        maxSize: 50,
      });
    }

    // Add custom columns with responsive sizing
    visibleColumns.forEach((column) => {
      cols.push({
        id: column.id,
        accessorKey: column.accessorKey as string,
        header: ({ column: col }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => col.toggleSorting(col.getIsSorted() === "asc")}
              className="h-auto p-0 font-semibold text-gray-700 hover:text-red-600 hover:bg-transparent text-left justify-start w-full"
            >
              <span className="truncate flex-1 text-left">{column.header}</span>
              <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400 flex-shrink-0" />
            </Button>
          );
        },
        cell: ({ row, getValue }) => {
          const value = getValue();
          if (column.cell) {
            return (
              <div className="min-w-0 flex-1">
                {column.cell(value, row.original)}
              </div>
            );
          }
          return (
            <span
              className="text-gray-800 font-medium truncate block"
              title={value != null ? String(value) : "—"}
            >
              {value != null ? String(value) : "—"}
            </span>
          );
        },
        enableSorting: column.sortable !== false,
        size: column.width || (150 as any),
        minSize: 100,
        maxSize: 300,
      });
    });

    // Add collapsed columns indicator if some columns are hidden
    if (!showAllColumns && columns.length > maxVisibleColumns) {
      cols.push({
        id: "more-columns",
        header: () => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllColumns(!showAllColumns)}
            className="h-auto p-0 font-semibold text-gray-700 hover:text-red-600"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const hiddenColumns = columns.slice(maxVisibleColumns);
          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllColumns(!showAllColumns)}
                className="h-8 px-2 text-xs text-gray-500 hover:text-red-600"
              >
                +{hiddenColumns.length}
              </Button>
            </div>
          );
        },
        enableSorting: false,
        size: 60,
        minSize: 60,
        maxSize: 60,
      });
    }

    // Add actions column if actions exist and showActions is true
    if (showActions && actions.length > 0) {
      cols.push({
        id: "actions",
        header: () => (
          <div className="text-center text-gray-600 font-semibold">Actions</div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-1">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant === "destructive" ? "ghost" : "default"}
                size="sm"
                onClick={() => action.onClick(row.original)}
                className={cn(
                  "h-8 px-2 text-xs transition-colors",
                  action.variant === "destructive"
                    ? "w-8 p-0 rounded-md hover:bg-red-50 hover:text-red-600 text-red-600"
                    : "rounded bg-primary/80 hover:bg-red-700 text-white cursor-pointer font-medium",
                  action.className
                )}
              >
                {action.icon}
                {action.variant !== "destructive" && actions.length === 1 && (
                  <span className="ml-1 hidden sm:inline">{action.label}</span>
                )}
                {action.variant === "destructive" && (
                  <span className="sr-only">{action.label}</span>
                )}
              </Button>
            ))}
          </div>
        ),
        enableSorting: false,
        size: Number.parseInt(actionsColumnWidth),
        minSize: 80,
        maxSize: 120,
      });
    }

    return cols;
  }, [
    visibleColumns,
    actions,
    enableSelection,
    showActions,
    actionsColumnWidth,
    maxVisibleColumns,
    columns.length,
    showAllColumns,
  ]);

  // Filter data based on filter state
  const filteredData = useMemo(() => {
    let filtered = data;

    // Apply custom filters
    Object.entries(filterState).forEach(([filterId, filterValue]) => {
      if (filterValue && filterValue !== "all") {
        const filter = filters.find((f) => f.id === filterId);
        if (filter) {
          filtered = filtered.filter((item) => {
            const itemValue = item[filterId as keyof T];
            return itemValue === filterValue;
          });
        }
      }
    });

    return filtered;
  }, [data, filterState, filters]);

  const table = useReactTable({
    data: filteredData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      rowSelection,
      globalFilter,
    },
    manualPagination: true,
    columnResizeMode: "onChange",
  });

  // const handleAddClick = () => {
  //   router.push("/dashboard/super-admin/schools/new")
  // }

  const handleFilterChange = (filterId: string, value: string) => {
    setFilterState(filterId, value);
  };

  const handleClearFilters = () => {
    if (externalOnFilterChange) {
      filters.forEach((filter) => externalOnFilterChange(filter.id, "all"));
    } else {
      setInternalFilterState({});
    }
  };

  const handleBulkAction = (action: string) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    console.log(
      `Bulk action: ${action}`,
      selectedRows.map((row) => row.original)
    );
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Something went wrong
          </h3>
          <p className="text-gray-600 mt-1">{error}</p>
        </div>
        {onRefresh && (
          <Button
            onClick={onRefresh}
            variant="outline"
            className="mt-4 bg-transparent border-red-200 text-red-600 hover:bg-red-50 "
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try again
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn("w-full max-w-full overflow-hidden", className)}
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <div className="space-y-6">
        {/* Enhanced Header */}
        <DataTableHeader
          title={title}
          subtitle={subtitle}
          searchValue={globalFilter}
          onSearchChange={setGlobalFilter}
          searchPlaceholder={searchPlaceholder}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showViewToggle={showViewToggle}
          showAddButton={showAddButton}
          addButtonLabel={addButtonLabel}
          onAddClick={onAddClick}
          filters={filters}
          filterState={filterState}
          onFilterChange={handleFilterChange}
          activeFiltersCount={activeFiltersCount}
          onClearFilters={handleClearFilters}
          showBulkActions={enableSelection}
          selectedCount={table.getFilteredSelectedRowModel().rows.length}
          onBulkAction={handleBulkAction}
          onRefresh={onRefresh}
          isLoading={isLoading}
        />

        {/* Column visibility controls */}
        {columns.length > maxVisibleColumns && (
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
            <div className="text-sm text-gray-600">
              Showing{" "}
              {showAllColumns
                ? columns.length
                : Math.min(maxVisibleColumns, columns.length)}{" "}
              of {columns.length} columns
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllColumns(!showAllColumns)}
              className="text-xs"
            >
              {showAllColumns ? "Show Less" : "Show All Columns"}
            </Button>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <DataTableSkeleton />
        ) : viewMode === "table" ? (
          <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="w-full">
              <Table className="w-full table-fixed">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="hover:bg-transparent border-b border-gray-200 bg-gray-50/50"
                    >
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="font-semibold text-gray-700 h-12 px-4 py-3 text-left"
                          style={{
                            width: header.column.getSize(),
                            minWidth: header.column.columnDef.minSize,
                            maxWidth: header.column.columnDef.maxSize,
                          }}
                        >
                          <div className="truncate">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row, index) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className={cn(
                          "hover:bg-red-50/50 border-b border-gray-100 transition-colors group",
                          row.getIsSelected() && "bg-red-50/30 border-red-200",
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                        )}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="px-4 py-4 text-sm"
                            style={{
                              width: cell.column.getSize(),
                              minWidth: cell.column.columnDef.minSize,
                              maxWidth: cell.column.columnDef.maxSize,
                            }}
                          >
                            <div className="truncate">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={tableColumns.length}
                        className="h-32 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center py-8">
                          <div className="text-gray-400 mb-3">
                            <Grid3X3 className="h-12 w-12" />
                          </div>
                          <p className="text-gray-600 font-medium text-lg">
                            No results found
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <GridView
            data={filteredData}
            columns={columns}
            actions={showActions ? actions : []}
          />
        )}

        {/* Enhanced Pagination */}
        <EnhancedDataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          selectedCount={
            enableSelection
              ? table.getFilteredSelectedRowModel().rows.length
              : 0
          }
          totalCount={data.length}
          filteredCount={filteredData.length}
        />
      </div>
    </div>
  );
}

// Enhanced Skeleton component
function DataTableSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="bg-gray-50/50 border-b border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-4 p-6 transition-colors",
              i % 2 === 0 ? "bg-white" : "bg-gray-50/30"
            )}
          >
            <Skeleton className="h-4 w-4 rounded-sm" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Enhanced Grid View component
function GridView<T extends Record<string, any>>({
  data,
  columns,
  actions,
}: {
  data: T[];
  columns: any[];
  actions: any[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data.map((item, index) => (
        <Card
          key={index}
          className="group hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-red-300 hover:shadow-red-100/50 rounded-sm py-2"
        >
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Primary Info */}
              <div>
                <h3 className="font-semibold text-gray-900 text-base leading-tight">
                  {getStringValue(item, "applicantName") ||
                    getStringValue(item, "name") ||
                    "Unknown"}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {getStringValue(item, "schoolName") ||
                    getStringValue(item, "code") ||
                    "N/A"}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {getStringValue(item, "country") && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Country
                    </p>
                    <p className="font-semibold text-gray-900 text-sm mt-1">
                      {getStringValue(item, "country")}
                    </p>
                  </div>
                )}
                {getStringValue(item, "role") && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Role
                    </p>
                    <p className="font-semibold text-gray-900 text-xs line-clamp-1 mt-1 capitalize">
                      {getStringValue(item, "role").replace(/_/g, " ")}
                    </p>
                  </div>
                )}
                {(getNumberValue(item, "numberOfStudents") > 0 ||
                  getNumberValue(item, "students") > 0) && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Students
                    </p>
                    <p className="font-semibold text-gray-900 text-sm mt-1">
                      {(
                        getNumberValue(item, "numberOfStudents") ||
                        getNumberValue(item, "students")
                      ).toLocaleString()}
                    </p>
                  </div>
                )}
                {getNumberValue(item, "teachers") > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Teachers
                    </p>
                    <p className="font-semibold text-gray-900 text-sm mt-1">
                      {getNumberValue(item, "teachers").toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Status */}
              {getStringValue(item, "status") && (
                <div>
                  <StatusBadge
                    status={getStringValue(item, "status")}
                    variant={
                      getStringValue(item, "status").toLowerCase() as any
                    }
                  />
                </div>
              )}

              {/* Actions */}
              {actions.length > 0 && (
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  {actions.map((action, actionIndex) => (
                    <Button
                      key={actionIndex}
                      variant="outline"
                      size="sm"
                      onClick={() => action.onClick(item)}
                      className={cn(
                        "flex-1 h-9 text-xs transition-colors font-medium",
                        action.variant === "destructive"
                          ? "border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                          : "border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                      )}
                    >
                      {action.icon}
                      <span className="ml-1.5">{action.label}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Enhanced Pagination component
function EnhancedDataTablePagination({
  currentPage,
  totalPages,
  onPageChange,
  selectedCount,
  totalCount,
  filteredCount,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  selectedCount: number;
  totalCount: number;
  filteredCount?: number;
}) {
  const displayCount = filteredCount !== undefined ? filteredCount : totalCount;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-4 bg-white rounded-lg border border-gray-200">
      <div className="text-sm text-gray-600">
        <span className="font-medium text-gray-800">{selectedCount}</span> of{" "}
        <span className="font-medium text-gray-800">{displayCount}</span> row(s)
        selected
        {filteredCount !== undefined && filteredCount !== totalCount && (
          <span className="text-gray-500 ml-2">({totalCount} total)</span>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage <= 1}
          className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNumber = i + 1;
            const isCurrentPage = currentPage === pageNumber;
            return (
              <Button
                key={i}
                variant={isCurrentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange?.(pageNumber)}
                className={cn(
                  "w-9 h-9 p-0 text-sm transition-colors",
                  isCurrentPage
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-sm"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400"
                )}
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 transition-colors"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

// Utility functions
function getStringValue(obj: any, key: string, fallback = ""): string {
  const value = obj?.[key];
  return typeof value === "string" ? value : fallback;
}

function getNumberValue(obj: any, key: string, fallback = 0): number {
  const value = obj?.[key];
  return typeof value === "number" ? value : fallback;
}
