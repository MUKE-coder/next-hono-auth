"use client";

import { View, Edit, CheckCircle, XCircle } from "lucide-react";
import { DataTableAction } from "@/components/data-table-v2/types";
import { ExtendedUser } from "./MembersTableColumns";

type TabType = "all" | "pending" | "active";

export const useTableActions = (
  activeTab: TabType,
  router: any,
  onApprove?: (member: ExtendedUser) => void,
  onReject?: (member: ExtendedUser) => void
) => {
  // Handler functions for approve/reject
  const handleApproveMember = (member: ExtendedUser) => {
    console.log("Approve member:", member.id);
    if (onApprove) onApprove(member);
  };

  const handleRejectMember = (member: ExtendedUser) => {
    console.log("Reject member:", member.id);
    if (onReject) onReject(member);
  };

  // Define actions based on tab (simplified since pending has inline actions)
  const getActions = (): DataTableAction<ExtendedUser>[] => {
    const baseActions = [
      {
        label: "",
        icon: <View className="h-4 w-4" />,
        onClick: (row: ExtendedUser) => {
          router.push(`/dashboard/members/${row.id}`);
        },
      },
    ];

    if (activeTab === "pending") {
      // For pending, we have inline actions, so just return view
      return baseActions;
    }

    if (activeTab === "active") {
      return [
        ...baseActions,
        {
          label: "Edit Profile",
          icon: <Edit className="h-4 w-4" />,
          onClick: (row: ExtendedUser) => {
            router.push(`/dashboard/members/edit/${row.id}`);
          },
        },
      ];
    }

    return [
      ...baseActions,
      {
        label: "Edit",
        icon: <Edit className="h-4 w-4" />,
        onClick: (row: ExtendedUser) => {
          router.push(`/dashboard/members/edit/${row.id}`);
        },
      },
    ];
  };

  return {
    getActions,
    handleApproveMember,
    handleRejectMember,
  };
};
