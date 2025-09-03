"use client";

import type * as React from "react";
import {
  ArrowUpCircleIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  SearchIcon,
  SettingsIcon,
  PackageIcon,
  ShoppingCartIcon,
  TagIcon,
  UserIcon,
  TrendingUpIcon,
  InboxIcon,
  MegaphoneIcon,
  FileBarChartIcon as FileBarGraphIcon,
  Monitor,
  Blocks,
  Chrome,
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

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: PackageIcon,
    },
    {
      title: "Categories",
      url: "/dashboard/categories",
      icon: TagIcon,
    },
    {
      title: "Departments",
      url: "/dashboard/departments",
      icon: Blocks,
    },
    {
      title: "Brands",
      url: "/dashboard/brands",
      icon: Chrome,
    },

    {
      title: "Orders",
      url: "#",
      icon: ShoppingCartIcon,
    },
    {
      title: "Customers",
      url: "#",
      icon: UserIcon,
    },
    {
      title: "Analytics",
      url: "#",
      icon: TrendingUpIcon,
    },
    {
      title: "Banners",
      url: "/dashboard/banners",
      icon: Monitor,
    },
  ],
  navClouds: [
    {
      title: "Inventory",
      icon: InboxIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Stock",
          url: "#",
        },
        {
          title: "Low Stock",
          url: "#",
        },
      ],
    },
    {
      title: "Marketing",
      icon: MegaphoneIcon,
      url: "#",
      items: [
        {
          title: "Campaigns",
          url: "#",
        },
        {
          title: "Promotions",
          url: "#",
        },
      ],
    },
    {
      title: "Reports",
      icon: FileBarGraphIcon,
      url: "#",
      items: [
        {
          title: "Sales",
          url: "#",
        },
        {
          title: "Analytics",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: DatabaseIcon,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardListIcon,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: FileIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // console.log("Primary email=>", user?.primaryEmailAddress?.emailAddress);
  // console.log("---------------");
  // console.log("Email addresses=>", user?.emailAddresses[0].emailAddress);
  const userData = {
    name: "muke jb",
    email: "muke@gmail.com",
    image: "",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="#">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
