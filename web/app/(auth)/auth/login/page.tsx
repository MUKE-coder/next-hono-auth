import { getServerUser } from "@/actions/auth";
import LoginForm from "@/components/auth/LoginForm";
// import Login from "@/components/frontend/auth/login";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  const user = await getServerUser();
  if (user?.id) {
    const role = user.role;
    const path = "/dashboard";
    redirect(path);
  }
  return (
    <div>
      <LoginForm />
    </div>
  );
}
