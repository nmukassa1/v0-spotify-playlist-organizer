"use client"

import { cn } from "@/lib/utils"
import type { PlaylistCategory } from "@/lib/mock-data"
import { categoryLabels } from "@/lib/mock-data"
import { categoryBadgeStyles } from "@/lib/category-styles"

interface CategoryBadgeProps {
  category: PlaylistCategory
  className?: string
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const style = categoryBadgeStyles[category]
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-[11px] font-semibold",
        style.bg,
        style.text,
        className
      )}
    >
      {categoryLabels[category]}
    </span>
  )
}
