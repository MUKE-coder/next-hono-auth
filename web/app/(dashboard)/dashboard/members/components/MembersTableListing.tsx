"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, UserCheck, Clock } from "lucide-react";
import { DataTable } from "@/components/data-table-v2/DataTable";
import { useMembersData } from "@/hooks/useMembers";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import the separated components
import { useTableColumns, ExtendedUser } from "./MembersTableColumns";
import { useTableActions } from "./MembersTableActions";

type TabType = "all" | "pending" | "active";

export default function MembersTableListing() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [filters, setFilters] = useState({
    status: "",
    role: "",
    isVerified: "",
  });
  const [searchQuery, setSearchQuery] = useState<string>("");

  const router = useRouter();

  // Get data without status filter (we'll filter client-side)
  const {
    members: allMembers,
    refetch,
    totalPages,
    isLoading,
    error,
  } = useMembersData({
    page: currentPage,
    limit: 20,
    search: searchQuery,
  });
  console.log(allMembers);
  // Client-side filtering based on active tab
  const getFilteredMembers = () => {
    if (!allMembers) return [];

    switch (activeTab) {
      case "pending":
        return allMembers.filter((member) => member.status === "PENDING");
      case "active":
        return allMembers.filter((member) => member.status === "ACTIVE");
      default:
        return allMembers;
    }
  };

  const members = getFilteredMembers();

  // Get tab counts from all members
  const getTabCounts = () => {
    if (!allMembers) return { all: 0, pending: 0, active: 0 };

    return {
      all: allMembers.length,
      pending: allMembers.filter((m) => m.status === "PENDING").length,
      active: allMembers.filter((m) => m.status === "ACTIVE").length,
    };
  };

  const tabCounts = getTabCounts();

  // Handler functions for approve/reject
  const handleApproveMember = (member: ExtendedUser) => {
    console.log("Approve member:", member.id);
    // Add your approval API call here
    // After successful approval, you can refetch the data
    // refetch();
  };

  const handleRejectMember = (member: ExtendedUser) => {
    console.log("Reject member:", member.id);
    // Add your rejection API call here
    // After successful rejection, you can refetch the data
    // refetch();
  };

  // Get table columns
  const { allMembersColumns, pendingColumns, activeColumns } = useTableColumns(
    handleApproveMember,
    handleRejectMember
  );

  // Get table actions
  const { getActions } = useTableActions(
    activeTab,
    router,
    handleApproveMember,
    handleRejectMember
  );

  // Get columns based on active tab
  const getColumns = () => {
    switch (activeTab) {
      case "pending":
        return pendingColumns;
      case "active":
        return activeColumns;
      default:
        return allMembersColumns;
    }
  };

  // Event handlers
  const handleFilterChange = (filterId: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterId]: value === "all" ? "" : value,
    }));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    setCurrentPage(1);
  };

  const handleAddClick = () => {
    router.push("/auth/register");
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4 max-w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            UNMU Members
          </h1>
          <p className="text-gray-600">
            Manage and review union members across different statuses
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => handleTabChange(value as TabType)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-gree-100 p-1 rounded-xl">
            <TabsTrigger
              value="all"
              className="flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
            >
              <Users className="w-4 h-4" />
              All Members
              <Badge
                variant="secondary"
                className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-1"
              >
                {tabCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
            >
              <Clock className="w-4 h-4" />
              Pending Approval
              <Badge
                variant="secondary"
                className="ml-2 bg-yellow-100 text-yellow-700 text-xs px-2 py-1"
              >
                {tabCounts.pending}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
            >
              <UserCheck className="w-4 h-4" />
              Active Members
              <Badge
                variant="secondary"
                className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-1"
              >
                {tabCounts.active}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <DataTable
              title="All Members"
              subtitle="Complete overview of all registered members"
              columns={getColumns()}
              data={members || []}
              actions={getActions()}
              searchPlaceholder="Search by name, email, or member number..."
              showAddButton={true}
              addButtonLabel="Register New Member"
              onAddClick={handleAddClick}
              isLoading={isLoading}
              error={error as string}
              onRefresh={refetch}
              pageSize={20}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              enableSelection={true}
              showActions={true}
              filterState={filters}
              onFilterChange={handleFilterChange}
              searchValue={searchQuery}
              onSearchChange={handleSearchChange}
            />
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <DataTable
              title="Pending Approvals"
              subtitle="Members awaiting administrative review and approval"
              columns={getColumns()}
              data={members || []}
              actions={getActions()}
              searchPlaceholder="Search pending applications..."
              showAddButton={false}
              isLoading={isLoading}
              error={error as string}
              onRefresh={refetch}
              pageSize={20}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              enableSelection={true}
              showActions={true}
              searchValue={searchQuery}
              onSearchChange={handleSearchChange}
            />
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <DataTable
              title="Active Members"
              subtitle="Verified and active union members"
              columns={getColumns()}
              data={members || []}
              actions={getActions()}
              searchPlaceholder="Search active members..."
              showAddButton={true}
              addButtonLabel="Register New Member"
              onAddClick={handleAddClick}
              isLoading={isLoading}
              error={error as string}
              onRefresh={refetch}
              pageSize={20}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              enableSelection={true}
              showActions={true}
              searchValue={searchQuery}
              onSearchChange={handleSearchChange}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
