"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarFooter, SidebarTrigger } from "@/components/ui/sidebar";
import { User } from "@/types/auth2";

import { usePathname } from "next/navigation";
import { NavUser } from "./nav-user";

export function SiteHeader({ user }: { user: User }) {
  const pathname = usePathname();

  let title = "Dashboard";

  if (pathname === "/products") {
    title = "Products";
  } else if (pathname === "/categories") {
    title = "Categories";
  }

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 justify-between">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">{title}</h1>
        </div>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </div>
    </header>
  );
}
