import HeroSection from "@/components/home/hero-section";
import { redirect } from "next/navigation";
import React from "react";

export default async function Home() {
  redirect("/auth/login");
  return (
    <main className="">
      <HeroSection />
    </main>
  );
}
