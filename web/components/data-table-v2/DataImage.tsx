"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { School } from "lucide-react"
import { cn } from "@/lib/utils"

interface SchoolImageProps {
  src?: string
  alt?: string
  className?: string
  fallback?: React.ReactNode
}

export function DataImage({ src, alt, className, fallback }: SchoolImageProps) {
  const [imageError, setImageError] = useState(false)

  if (!src || imageError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-primary/80 to-primary/70 rounded-lg shadow-sm",
          "w-10 h-10",
          className,
        )}
      >
        {fallback || <School className="w-6 h-6 text-white" />}
      </div>
    )
  }

  return (
    <div className={cn("rounded-lg overflow-hidden shadow-sm", className)}>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt || "school management images"}
        width={48}
        height={48}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  )
}
