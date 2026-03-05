"use client"

import { cn } from "@/lib/utils"
import type { PlaylistCategory } from "@/lib/mock-data"
import { categoryLabels } from "@/lib/mock-data"
import { categoryIcons, categoryAccents } from "@/lib/category-styles"

interface LibraryBreakdownRowProps {
  category: PlaylistCategory
  stat: string
  detail: string
  playlistCount: number
}

export function LibraryBreakdownRow({
  category,
  stat,
  detail,
  playlistCount,
}: LibraryBreakdownRowProps) {
  const Icon = categoryIcons[category]
  const accent = categoryAccents[category]
  return (
    <div className="flex items-center gap-3">
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", accent.bg)}>
        <Icon className={cn("h-4 w-4", accent.text)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground">{categoryLabels[category]}</p>
        <p className="text-[11px] text-muted-foreground">{detail}</p>
      </div>
      <span className="text-sm font-bold font-mono text-foreground">{stat}</span>
      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
        {playlistCount} {playlistCount === 1 ? "playlist" : "playlists"}
      </span>
    </div>
  )
}
