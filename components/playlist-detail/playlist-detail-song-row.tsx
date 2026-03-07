"use client"

import { Music, X } from "lucide-react"
import type { Song } from "@/lib/mock-data"
import { SongCover } from "@/components/song/song-cover"

interface PlaylistDetailSongRowProps {
  song: Song
  index: number
  onRemove: () => void
}

export function PlaylistDetailSongRow({ song, index, onRemove }: PlaylistDetailSongRowProps) {
  return (
    <div className="flex items-center gap-3 px-4 sm:px-6 py-3 hover:bg-secondary/30 transition-colors group">
      <span className="w-6 text-center text-xs font-mono text-muted-foreground/50">{index + 1}</span>
      <SongCover colorClass={song.coverColor} size="lg" className="rounded-md" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">
          {song.title}
          {song.featuredArtists.length > 0 && (
            <span className="text-muted-foreground font-normal"> ft. {song.featuredArtists.join(", ")}</span>
          )}
        </p>
        <p className="text-xs text-muted-foreground truncate">{song.artist} &middot; {song.album}</p>
      </div>
      <span className="hidden sm:block rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
        {song.releaseYear}
      </span>
      <span className="hidden sm:block text-[10px] font-mono text-muted-foreground/40">
        pop {song.popularity}
      </span>
      <span className="text-xs font-mono text-muted-foreground/50">{song.duration}</span>
      <button
        onClick={onRemove}
        className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
        aria-label={`Remove ${song.title} from playlist`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
