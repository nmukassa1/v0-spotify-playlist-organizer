"use client"

import { cn } from "@/lib/utils"
import { Music } from "lucide-react"

interface SongCoverProps {
  className?: string
  colorClass: string
  iconClassName?: string
  size?: "sm" | "md" | "lg"
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

export function SongCover({ className, colorClass, iconClassName, size = "md" }: SongCoverProps) {
  return (
    <div
      className={cn(
        "shrink-0 rounded flex items-center justify-center",
        sizeClasses[size],
        colorClass,
        className
      )}
    >
      <Music className={cn("text-foreground/80", iconSizes[size], iconClassName)} />
    </div>
  )
}
