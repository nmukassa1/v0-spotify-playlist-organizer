"use client"

import { cn } from "@/lib/utils"
import type { Song } from "@/lib/mock-data"
import { SongCover } from "@/components/song/song-cover"

interface SongRowMiniProps {
  song: Song
  showYear?: boolean
  showDuration?: boolean
  className?: string
}

export function SongRowMini({
  song,
  showYear = false,
  showDuration = true,
  className,
}: SongRowMiniProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 min-w-0",
        className
      )}
    >
      <SongCover colorClass={song.coverColor} size="sm" />
      <span className="truncate text-xs text-muted-foreground">
        {song.title}
        {song.featuredArtists.length > 0 && (
          <span className="text-muted-foreground/50"> ft. {song.featuredArtists.join(", ")}</span>
        )}
      </span>
      {showDuration && (
        <span className="ml-auto shrink-0 text-[10px] text-muted-foreground/50 font-mono">
          {song.duration}
        </span>
      )}
      {showYear && (
        <span className="hidden sm:block text-[10px] font-mono text-muted-foreground/60">
          {song.releaseYear}
        </span>
      )}
    </div>
  )
}
