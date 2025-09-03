"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Filter,
  Grid3X3,
  List,
  SlidersHorizontal,
  X,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  DataTableFilter,
  FilterState,
  ViewMode,
} from "@/types/data-table";

interface DataTableHeaderProps {
  title: string;
  subtitle?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showViewToggle?: boolean;
  showAddButton?: boolean;
  addButtonLabel?: string;
  onAddClick?: () => void;
  filters?: DataTableFilter[];
  filterState: FilterState;
  onFilterChange: (filterId: string, value: string) => void;
  activeFiltersCount?: number;
  onClearFilters?: () => void;
  showBulkActions?: boolean;
  selectedCount?: number;
  onBulkAction?: (action: string) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function DataTableHeader({
  title,
  subtitle,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  viewMode,
  onViewModeChange,
  showViewToggle = true,
  showAddButton = true,
  addButtonLabel = "Add Item",
  onAddClick,
  filters = [],
  filterState,
  onFilterChange,
  activeFiltersCount = 0,
  onClearFilters,
  showBulkActions = false,
  selectedCount = 0,
  onBulkAction,
  onRefresh,
  isLoading = false,
  className,
}: DataTableHeaderProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkActionsPanel, setShowBulkActionsPanel] = useState(false);

  const handleClearAllFilters = () => {
    filters.forEach((filter) => {
      onFilterChange(filter.id, "all");
    });
    onClearFilters?.();
  };

  return (
    <div className={cn("space-y-1", className)}>
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 bg-gradient-to-r from-slate-50 to-gray-50 p-4 rounded-2xl border border-gray-100">
        {/* Title and Subtitle */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-1 h-8 bg-gradient-to-b from-red-600 to-red-700 rounded-full"></div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              {title}
            </h1>
          </div>
          {subtitle && (
            <p className="text-gray-600 max-w-2xl leading-relaxed ml-2 text-sm">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 border-gray-200 text-gray-700 hover:text-black hover:bg-white hover:border-gray-300 bg-white/80 backdrop-blur-sm transition-all duration-200 shadow-sm"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="hidden sm:inline font-medium">Refresh</span>
            </Button>
          )}

          {/* Primary Action */}
          {showAddButton && (
            <Button
              onClick={onAddClick}
              className="gap-2 bg-gradient-to-r from-yellow-800/80 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-xs shadow-red-200/50 font-medium rounded-sm px-6 py-2.5 transition-all duration-200 hover:shadow-xl hover:shadow-red-200/60"
            >
              <Plus className="h-4 w-4" />
              {addButtonLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 bg-white p-4 rounded-sm border border-gray-100 shadow-xs">
        {/* Left Controls */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 border-gray-200 focus:border-red-500 focus:ring-red-500/20 bg-gray-50/50 hover:bg-white transition-colors rounded-sm"
            />
          </div>

          {/* Filter Toggle */}
          {filters.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 relative transition-all duration-200",
                showFilters && "bg-red-50 text-red-700 border-red-200"
              )}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 bg-red-100 text-red-800 hover:bg-red-200 text-xs px-2 py-0.5 min-w-[20px] h-5 rounded-full">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Bulk Actions */}
          {showBulkActions && selectedCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-sm text-red-700 font-medium whitespace-nowrap">
                {selectedCount} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBulkActionsPanel(!showBulkActionsPanel)}
                className="border-red-300 text-red-700 hover:bg-red-100 h-7"
              >
                Actions
              </Button>
            </div>
          )}

          {/* View Toggle */}
          {showViewToggle && (
            <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("table")}
                className={cn(
                  "h-8 w-8 p-0 rounded-md transition-all",
                  viewMode === "table"
                    ? "bg-red-600 shadow-sm text-white hover:bg-red-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white"
                )}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("grid")}
                className={cn(
                  "h-8 w-8 p-0 rounded-md transition-all",
                  viewMode === "grid"
                    ? "bg-red-600 shadow-sm text-white hover:bg-red-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white"
                )}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && filters.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            {/* Filter Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-red-600" />
                <span className="text-sm font-semibold text-gray-900">
                  Filter Results
                </span>
              </div>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAllFilters}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 h-8 px-3 rounded-lg"
                >
                  Clear all
                </Button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filters.map((filter) => (
                <div key={filter.id} className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {filter.label}
                  </label>
                  <Select
                    value={
                      filterState[filter.id] || filter.defaultValue || "all"
                    }
                    onValueChange={(value) => onFilterChange(filter.id, value)}
                  >
                    <SelectTrigger className="h-10 border-gray-200 focus:border-red-500 focus:ring-red-500/20 bg-gray-50/50 hover:bg-white transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All {filter.label}</SelectItem>
                      {filter.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center justify-between w-full">
                            <span>{option.label}</span>
                            {option.count && (
                              <span className="text-xs text-gray-500 ml-2">
                                {option.count}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex items-start gap-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Active filters:
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {filters.map((filter) => {
                      const value = filterState[filter.id];
                      if (!value || value === "all") return null;
                      const option = filter.options.find(
                        (opt) => opt.value === value
                      );
                      if (!option) return null;
                      return (
                        <div
                          key={filter.id}
                          className="inline-flex items-center gap-2 px-8 py-1.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 hover:bg-red-100 transition-colors "
                        >
                          <span className="text-xs font-medium text-red-600 uppercase tracking-wider">
                            {filter.label}:
                          </span>
                          <span className="text-red-900 font-medium">
                            {option.label}
                          </span>
                          <button
                            onClick={() => onFilterChange(filter.id, "all")}
                            className="ml-1 p-0.5 hover:bg-red-200 rounded-full transition-colors group"
                            aria-label={`Remove ${filter.label} filter`}
                          >
                            <X className="h-3 w-3 text-red-600 group-hover:text-red-800" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <button
                  onClick={handleClearAllFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 font-medium whitespace-nowrap transition-colors hover:bg-gray-100 px-2 py-1 rounded"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bulk Actions Panel */}
      {showBulkActionsPanel && selectedCount > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Bulk Actions ({selectedCount} items)
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBulkActionsPanel(false)}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction?.("approve")}
              className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400"
            >
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction?.("reject")}
              className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
            >
              Reject
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction?.("delete")}
              className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
