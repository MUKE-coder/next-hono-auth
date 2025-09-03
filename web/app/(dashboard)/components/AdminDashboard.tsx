"use client";

import type * as React from "react";
import {
  LayoutDashboardIcon,
  UsersIcon,
  UserIcon,
  MapPinIcon,
  ShieldCheckIcon,
  BarChart3Icon,
  SettingsIcon,
  HelpCircleIcon,
  SearchIcon,
  FileTextIcon,
  ActivityIcon,
  CreditCardIcon,
  MapIcon,
  UsersRoundIcon,
  UserCheckIcon,
  UserXIcon,
  ClockIcon,
  DatabaseIcon,
  FileBarChartIcon,
  BellIcon,
  Building2,
} from "lucide-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { User } from "@/types/auth2";
import MainLogo from "@/components/home/main-logo";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Administrators",
      url: "/dashboard/users",
      icon: UsersIcon,
    },

    {
      title: "Members Management",
      url: "/dashboard/members",
      icon: UsersIcon,
    },
  ],

  navManagement: [
    {
      title: "User Management",
      url: "/dashboard/admin",
      icon: ShieldCheckIcon,
    },
    {
      title: "System Security",
      url: "/dashboard/security",
      icon: ShieldCheckIcon,
    },
    {
      title: "Database Management",
      url: "/dashboard/database",
      icon: DatabaseIcon,
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: SettingsIcon,
    },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: BellIcon,
    },
    {
      title: "Help & Support",
      url: "/dashboard/help",
      icon: HelpCircleIcon,
    },
    {
      title: "Search Members",
      url: "/dashboard/search",
      icon: SearchIcon,
    },
  ],

  documents: [
    {
      name: "Member Reports",
      url: "/dashboard/documents/reports",
      icon: FileBarChartIcon,
    },
    {
      name: "Export Data",
      url: "/dashboard/documents/export",
      icon: FileTextIcon,
    },
    {
      name: "Documentation",
      url: "/dashboard/documents/docs",
      icon: FileTextIcon,
    },
  ],
};

export function AdminSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: User }) {
  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r-2 border-red-100 bg-gradient-to-b from-white to-red-50/30"
      {...props}
    >
      <SidebarHeader className="border-b border-red-100 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-3 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <div>
                <MainLogo
                  variant="compact"
                  width={36}
                  height={36}
                  showText={true}
                  href="/dashboard"
                  className="transition-transform duration-200 hover:scale-105"
                />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Main Navigation */}
        <div className="mb-6 [&_.sidebar-menu-button]:text-gray-700 [&_.sidebar-menu-button:hover]:bg-red-50 [&_.sidebar-menu-button:hover]:text-red-700 [&_.sidebar-menu-button[data-active=true]]:bg-red-100 [&_.sidebar-menu-button[data-active=true]]:text-red-800 [&_.sidebar-menu-button[data-active=true]]:border-l-2 [&_.sidebar-menu-button[data-active=true]]:border-red-600">
          {/* <div className="px-3 mb-2">
            <h3 className="text-xs font-semibold text-red-600 uppercase tracking-wider">
              Main Menu
            </h3>
          </div> */}
          <NavMain items={data.navMain} />
        </div>

        {/* Management Section */}
        <div className="mb-6 [&_.sidebar-menu-button]:text-gray-700 [&_.sidebar-menu-button:hover]:bg-red-50 [&_.sidebar-menu-button:hover]:text-red-700 [&_.sidebar-menu-button[data-active=true]]:bg-red-100 [&_.sidebar-menu-button[data-active=true]]:text-red-800">
          <div className="px-3 mb-2">
            <h3 className="text-xs font-semibold text-red-600 uppercase tracking-wider">
              System Management
            </h3>
          </div>
          <NavMain items={data.navManagement} />
        </div>

        {/* Documents Section */}
        <div className="mb-6 [&_.sidebar-menu-button]:text-gray-700 [&_.sidebar-menu-button:hover]:bg-red-50 [&_.sidebar-menu-button:hover]:text-red-700 [&_.sidebar-group-label]:text-red-600 [&_.sidebar-group-label]:font-semibold [&_.sidebar-group-label]:text-xs [&_.sidebar-group-label]:uppercase [&_.sidebar-group-label]:tracking-wider">
          <NavDocuments items={data.documents} />
        </div>

        {/* Secondary Navigation */}
        <div className="mt-auto pt-4 border-t border-red-100 [&_.sidebar-menu-button]:text-gray-600 [&_.sidebar-menu-button:hover]:bg-red-50 [&_.sidebar-menu-button:hover]:text-red-700">
          <NavSecondary items={data.navSecondary} />
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-red-100 bg-red-50/50 [&_.sidebar-menu-button:hover]:bg-red-100">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
