"use client"

import { Play, MoreHorizontal, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SuggestedPlaylist, Song } from "@/lib/mock-data"
import { SongCover } from "@/components/song/song-cover"

interface MyPlaylistCardProps {
  playlist: SuggestedPlaylist
  songs: Song[]
  onView: () => void
}

export function MyPlaylistCard({ playlist, songs, onView }: MyPlaylistCardProps) {
  const playlistSongs = playlist.songs
    .map((id) => songs.find((s) => s.id === id))
    .filter(Boolean) as Song[]

  return (
    <div className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:border-muted-foreground/20 transition-all">
      <div className={cn("relative h-28 bg-gradient-to-br flex items-end p-4", playlist.color)}>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground">{playlist.name}</h3>
          <p className="text-xs text-muted-foreground">{playlist.songCount} tracks</p>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          <Play className="h-4 w-4 ml-0.5" />
        </button>
      </div>

      <div className="flex flex-col gap-1 p-3">
        {playlistSongs.slice(0, 3).map((song, i) => (
          <div key={song.id} className="flex items-center gap-2 px-1">
            <span className="text-[10px] font-mono text-muted-foreground/40 w-3">{i + 1}</span>
            <SongCover colorClass={song.coverColor} size="sm" />
            <span className="text-xs text-foreground truncate flex-1">
              {song.title}
              {song.featuredArtists.length > 0 && (
                <span className="text-muted-foreground"> ft. {song.featuredArtists.join(", ")}</span>
              )}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground/40">{song.duration}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border/50 px-4 py-2.5 mt-auto">
        <button
          onClick={onView}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          View all <ArrowRight className="h-3 w-3" />
        </button>
        <button className="text-muted-foreground/40 hover:text-muted-foreground">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
