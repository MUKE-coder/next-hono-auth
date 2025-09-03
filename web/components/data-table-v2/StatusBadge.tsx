"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  variant?: "PENDING" | "APPROVED" | "REJECTED" | "active" | "inactive" | "pending" | "suspended"
  className?: string
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    const normalizedStatus = status.toLowerCase()
    switch (normalizedStatus) {
      case "approved":
      case "active":
        return {
          bg: "bg-emerald-50 hover:bg-emerald-100",
          text: "text-emerald-700",
          border: "border-emerald-200",
          dot: "bg-emerald-500",
        }
      case "rejected":
      case "inactive":
        return {
          bg: "bg-red-50 hover:bg-red-100",
          text: "text-red-700",
          border: "border-red-200",
          dot: "bg-red-500",
        }
      case "pending":
        return {
          bg: "bg-amber-50 hover:bg-amber-100",
          text: "text-amber-700",
          border: "border-amber-200",
          dot: "bg-amber-500",
        }
      case "suspended":
        return {
          bg: "bg-orange-50 hover:bg-orange-100",
          text: "text-orange-700",
          border: "border-orange-200",
          dot: "bg-orange-500",
        }
      default:
        return {
          bg: "bg-gray-50 hover:bg-gray-100",
          text: "text-gray-700",
          border: "border-gray-200",
          dot: "bg-gray-500",
        }
    }
  }

  const config = getStatusConfig(variant || status)

  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-2 font-medium text-xs px-2.5 py-1 transition-colors ",
        config.bg,
        config.text,
        config.border,
        className,
      )}
    >
      <div className={cn("w-2 h-2 rounded-full animate-pulse", config.dot)} />
      {status}
    </Badge>
  )
}
