"use client"

import { ArrowRight, Clock } from "lucide-react"
import type { Song } from "@/lib/mock-data"
import { SongCover } from "@/components/song/song-cover"

interface RecentlyAddedRowProps {
  song: Song
}

function RecentlyAddedRow({ song }: RecentlyAddedRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-secondary/50 transition-colors">
      <SongCover colorClass={song.coverColor} size="md" className="rounded" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">
          {song.title}
          {song.featuredArtists.length > 0 && (
            <span className="text-muted-foreground font-normal"> ft. {song.featuredArtists.join(", ")}</span>
          )}
        </p>
        <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
      </div>
      <span className="hidden sm:block text-[10px] font-mono text-muted-foreground/60">{song.releaseYear}</span>
      <div className="flex items-center gap-1 text-muted-foreground/50">
        <Clock className="h-3 w-3" />
        <span className="text-[10px] font-mono">{song.duration}</span>
      </div>
    </div>
  )
}

interface DashboardRecentlyAddedProps {
  songs: Song[]
  onViewAll: () => void
}

export function DashboardRecentlyAdded({ songs, onViewAll }: DashboardRecentlyAddedProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Recently Added</h3>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          View all <ArrowRight className="h-3 w-3" />
        </button>
      </div>
      <div className="flex flex-col gap-1">
        {songs.map((song) => (
          <RecentlyAddedRow key={song.id} song={song} />
        ))}
      </div>
    </div>
  )
}
