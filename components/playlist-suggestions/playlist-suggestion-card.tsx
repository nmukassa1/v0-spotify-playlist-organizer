"use client"

import { cn } from "@/lib/utils"
import type { SuggestedPlaylist, Song } from "@/lib/mock-data"
import { categoryIconByKey } from "@/lib/category-styles"
import { Music, Plus, Check, ArrowRight } from "lucide-react"
import { SongRowMini } from "@/components/song/song-row-mini"

interface PlaylistSuggestionCardProps {
  playlist: SuggestedPlaylist
  songs: Song[]
  isAccepted: boolean
  onAccept: () => void
  onView: () => void
}

export function PlaylistSuggestionCard({
  playlist,
  songs,
  isAccepted,
  onAccept,
  onView,
}: PlaylistSuggestionCardProps) {
  const Icon = categoryIconByKey[playlist.icon] ?? Music
  const playlistSongs = playlist.songs
    .map((id) => songs.find((s) => s.id === id))
    .filter(Boolean) as Song[]

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-xl border transition-all",
        isAccepted
          ? "border-primary/30 bg-primary/5"
          : "border-border bg-card hover:border-muted-foreground/20"
      )}
    >
      <div className="flex items-start gap-4 p-5 pb-3">
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br", playlist.color)}>
          <Icon className="h-5 w-5 text-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-foreground">{playlist.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{playlist.description}</p>
        </div>
      </div>

      <div className="px-5 pb-3">
        <div className="flex flex-col gap-1.5">
          {playlistSongs.slice(0, 3).map((song) => (
            <SongRowMini key={song.id} song={song} showDuration />
          ))}
          {playlistSongs.length > 3 && (
            <p className="text-[11px] text-muted-foreground/50 pl-8">
              +{playlistSongs.length - 3} more tracks
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-border/50 px-5 py-3 mt-auto">
        <button
          onClick={onAccept}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
            isAccepted
              ? "bg-primary/10 text-primary"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {isAccepted ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Accepted
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" />
              Accept
            </>
          )}
        </button>
        <button
          onClick={onView}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          Preview
          <ArrowRight className="h-3 w-3" />
        </button>
        <span className="ml-auto text-[10px] font-mono text-muted-foreground/50">
          {playlist.songCount} tracks
        </span>
      </div>
    </div>
  )
}
