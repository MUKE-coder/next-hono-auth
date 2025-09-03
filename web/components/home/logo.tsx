"use client";
import { cn } from "@/lib/utils";
// import { useSchoolStore } from "@/store/school";
// import useSchoolStore from "@/store/school";
import { GraduationCap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Logo({
  variant = "light",
  size = "md",
  href = "/",
}: {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  href?: string;
}) {
  return (
    <Link href={"/"} className="flex items-center space-x-2">
      <div className="bg-white rounded-full p-1 md:hidden">
        <span className="text-blue-800 font-bold text-xl">
          <GraduationCap />
        </span>
      </div>
    </Link>
  );
}
