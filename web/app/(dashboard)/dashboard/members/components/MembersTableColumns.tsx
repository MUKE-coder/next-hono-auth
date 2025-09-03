"use client";

import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Building2,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Hash,
  Download,
} from "lucide-react";
import { DataTableColumn } from "@/components/data-table-v2/types";
import { DataImage } from "@/components/data-table-v2/DataImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AcceptAndReject from "@/app/(dashboard)/components/AcceptAndReject";

// Types
interface MemberProfile {
  memberNumber?: string;
  trackingNumber?: string;
  category?: string;
  district?: string;
  ninNumber?: string;
  dateOfBirth?: string;
  homeAddress?: string;
  workplaceAddress?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "MEMBER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";
  isVerified: boolean;
  image: string | null;
  nin: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ExtendedUser extends User {
  profile?: MemberProfile;
}

// Enhanced Status Badge Component
export const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "ACTIVE":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircle className="w-3 h-3" />,
          dot: "bg-green-500",
        };
      case "PENDING":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: <Clock className="w-3 h-3" />,
          dot: "bg-yellow-500",
        };
      case "SUSPENDED":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: <XCircle className="w-3 h-3" />,
          dot: "bg-red-500",
        };
      case "INACTIVE":
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <XCircle className="w-3 h-3" />,
          dot: "bg-gray-500",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <Clock className="w-3 h-3" />,
          dot: "bg-gray-500",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge
      variant="outline"
      className={`${config.color} font-medium flex items-center gap-1.5`}
    >
      <div className={`w-2 h-2 rounded-full ${config.dot}`} />
      {status}
    </Badge>
  );
};

// Category Badge Component
export const CategoryBadge = ({ category }: { category?: string }) => {
  if (!category) return <span className="text-gray-400 text-sm">Not set</span>;

  const getCategoryConfig = (cat: string) => {
    switch (cat) {
      case "PUBLIC_SERVICE":
        return { color: "bg-blue-100 text-blue-800", label: "Public Service" };
      case "PRIVATE_SECTOR":
        return {
          color: "bg-purple-100 text-purple-800",
          label: "Private Sector",
        };
      case "NON_PROFIT":
        return { color: "bg-cyan-100 text-cyan-800", label: "Non-Profit" };
      case "RETIRED":
        return { color: "bg-green-100 text-green-800", label: "Retired" };
      case "CLINICS":
        return { color: "bg-orange-100 text-orange-800", label: "Clinics" };
      default:
        return { color: "bg-gray-100 text-gray-800", label: cat };
    }
  };

  const config = getCategoryConfig(category);
  return (
    <Badge className={`${config.color} font-medium`}>{config.label}</Badge>
  );
};

// Column Definitions
export const useTableColumns = (
  onApprove: (member: ExtendedUser) => void,
  onReject: (member: ExtendedUser) => void
) => {
  // All Members Columns
  const allMembersColumns: DataTableColumn<ExtendedUser>[] = [
    {
      id: "user",
      header: "Member Details",
      cell: (_, row) => (
        <div className="flex items-center gap-3">
          <DataImage
            className="w-12 h-12 flex-shrink-0 rounded-full border-2 border-gray-100"
            src={row.image ?? ""}
          />
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 truncate">
              {row.name}
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Mail className="w-3 h-3" />
              <span className="truncate">{row.email}</span>
            </div>
            {row.profile?.memberNumber && (
              <div className="text-xs text-blue-600 font-mono mt-1">
                #{row.profile.memberNumber}
              </div>
            )}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "contact",
      header: "Contact & Location",
      cell: (_, row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600">{row.phone || "Not provided"}</span>
          </div>
          {row.profile?.district && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span className="text-gray-600">{row.profile.district}</span>
            </div>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      cell: (_, row) => <StatusBadge status={row.status} />,
      sortable: true,
    },
    {
      id: "createdAt",
      header: "Joined",
      cell: (_, row) => (
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span className="text-gray-600">
            {new Date(row.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      ),
      sortable: true,
    },
  ];

  // Pending Approval Columns
  const pendingColumns: DataTableColumn<ExtendedUser>[] = [
    {
      id: "user",
      header: "Applicant",
      cell: (_, row) => (
        <div className="flex items-center gap-3">
          <DataImage
            className="w-12 h-12 flex-shrink-0 rounded-full border-2 border-yellow-200"
            src={row.image ?? ""}
          />
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 truncate">
              {row.name}
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Mail className="w-3 h-3 shrink-0" />
              <span className="truncate">{row.email}</span>
            </div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "application_info",
      header: "Application Details",
      cell: (_, row) => (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600">
              Applied: {new Date(row.createdAt).toLocaleDateString("en-GB")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-3 h-3 text-yellow-500" />
            <span className="text-yellow-600">
              {Math.ceil(
                (Date.now() - new Date(row.createdAt).getTime()) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
              days pending
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-3 h-3 text-gray-400" />
              <span className="text-gray-600">
                {row.phone || "Not provided"}
              </span>
            </div>
          </div>
        </div>
      ),
      sortable: true,
    },
    // {
    //   id: "contact_location",
    //   header: "Contact & Location",
    //   cell: (_, row) => (
    //     <div className="space-y-1">
    //       <div className="flex items-center gap-2 text-sm">
    //         <Phone className="w-3 h-3 text-gray-400" />
    //         <span className="text-gray-600">{row.phone || "Not provided"}</span>
    //       </div>
    //       {row.profile?.district && (
    //         <div className="flex items-center gap-2 text-sm">
    //           <MapPin className="w-3 h-3 text-gray-400" />
    //           <span className="text-gray-600">{row.profile.district}</span>
    //         </div>
    //       )}
    //       {row.nin && (
    //         <div className="flex items-center gap-1 text-xs text-gray-500">
    //           <CreditCard className="w-3 h-3" />
    //           <span className="font-mono">NIN Provided</span>
    //         </div>
    //       )}
    //     </div>
    //   ),
    //   sortable: true,
    // },
    {
      id: "status",
      header: "Status",
      cell: (_, row) => <StatusBadge status={row.status} />,
      sortable: true,
    },
    {
      id: "actions",
      header: "Quick Actions",
      cell: (_, row) => (
        // <div className="flex items-center space-x-2">
        //   <Button
        //     variant="outline"
        //     size="sm"
        //     className="border-green-200 text-green-700 hover:bg-green-50 h-8"
        //   >
        //     <CheckCircle className="w-4 h-4 mr-1" />
        //     Approve All
        //   </Button>
        //   <Button
        //     variant="outline"
        //     size="sm"
        //     className="border-blue-200 text-blue-700 hover:bg-blue-50 h-8"
        //   >
        //     <Download className="w-4 h-4 mr-1" />
        //     Export
        //   </Button>
        //   <Button
        //     variant="outline"
        //     size="sm"
        //     className="border-gray-200 text-gray-700 hover:bg-gray-50 h-8"
        //   >
        //     <Mail className="w-4 h-4 mr-1" />
        //     Bulk Email
        //   </Button>
        // </div>
        <AcceptAndReject memberId={row.id} />
      ),
      sortable: false,
    },
  ];

  // Active Members Columns
  const activeColumns: DataTableColumn<ExtendedUser>[] = [
    {
      id: "member",
      header: "Member",
      cell: (_, row) => (
        <div className="flex items-center gap-3">
          <DataImage
            className="w-12 h-12 flex-shrink-0 rounded-full border-2 border-green-200"
            src={row.image ?? ""}
          />
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 truncate">
              {row.name}
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Mail className="w-3 h-3 shrink-0" />
              <span className="truncate">{row.email}</span>
            </div>
            <div className="text-xs text-green-600 font-mono mt-1 flex items-center gap-1">
              <Hash className="w-3 h-3" />
              {row.profile?.memberNumber || "UNMU-XXXX-XXXX"}
            </div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "professional_info",
      header: "Professional Info",
      cell: (_, row) => (
        <div className="space-y-2">
          <CategoryBadge category={row.profile?.category} />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-3 h-3 text-gray-400" />
            <span>{row.profile?.district || "District not set"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-green-600">
            <CheckCircle className="w-3 h-3" />
            <span>Verified Member</span>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "contact_details",
      header: "Contact",
      cell: (_, row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600">{row.phone || "Not provided"}</span>
          </div>
          {row.profile?.homeAddress && (
            <div className="flex items-start gap-2 text-xs text-gray-500">
              <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{row.profile.homeAddress}</span>
            </div>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      cell: (_, row) => <StatusBadge status={row.status} />,
      sortable: true,
    },
    {
      id: "membership_duration",
      header: "Membership",
      cell: (_, row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600">
              Since{" "}
              {new Date(row.createdAt).toLocaleDateString("en-GB", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {Math.ceil(
              (Date.now() - new Date(row.createdAt).getTime()) /
                (1000 * 60 * 60 * 24)
            )}{" "}
            days active
          </div>
        </div>
      ),
      sortable: true,
    },
  ];

  return {
    allMembersColumns,
    pendingColumns,
    activeColumns,
  };
};

export type { ExtendedUser, MemberProfile, User };
