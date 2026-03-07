"use client"

import { cn } from "@/lib/utils"
import { Music } from "lucide-react"

interface SongCoverProps {
  className?: string
  colorClass: string
  iconClassName?: string
  size?: "sm" | "md" | "lg"
  /** When set, shows album art instead of colored block */
  imageUrl?: string | null
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8 sm:h-10 sm:w-10",
  lg: "h-10 w-10",
}

const iconSizes = {
  sm: "h-3 w-3",
  md: "h-3 w-3 sm:h-4 sm:w-4",
  lg: "h-4 w-4",
}

export function SongCover({ className, colorClass, iconClassName, size = "md", imageUrl }: SongCoverProps) {
  const sizeClass = sizeClasses[size]
  if (imageUrl) {
    return (
      <div className={cn("shrink-0 overflow-hidden rounded flex items-center justify-center bg-muted", sizeClass, className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
    )
  }
  return (
    <div
      className={cn(
        "shrink-0 rounded flex items-center justify-center",
        sizeClass,
        colorClass,
        className
      )}
    >
      <Music className={cn("text-foreground/80", iconSizes[size], iconClassName)} />
    </div>
  )
}
