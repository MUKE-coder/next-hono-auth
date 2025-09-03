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
import MainLogo from "@/components/home/main-logo";

const data = {
	navMain: [
		{
			title: "Profile",
			url: "/user-dashboard/user-profile",
			icon: UserIcon,
		},
	],
};

export function UserSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	// const { isSignedIn, user, isLoaded } = useUser();
	// console.log("Primary email=>", user?.primaryEmailAddress?.emailAddress);
	// console.log("---------------");
	// console.log("Email addresses=>", user?.emailAddresses[0].emailAddress);
	const userData = {
		name: "",
		email: "",
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
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={userData} />
			</SidebarFooter>
		</Sidebar>
	);
}
