import type React from "react";

import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { redirect } from "next/navigation";
import { AdminSidebar } from "../components/AdminDashboard";
import { getServerUser } from "@/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();
  if (!user) {
    redirect("/auth/login");
  }
  const isAdmin = user.role === "ADMIN";
  if (!isAdmin) {
    redirect("/user-dashboard");
  }
  return (
    <SidebarProvider>
      <AdminSidebar user={user} variant="inset" />
      <SidebarInset>
        <SiteHeader user={user} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
