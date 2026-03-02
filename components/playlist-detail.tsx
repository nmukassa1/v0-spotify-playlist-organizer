"use client"

import { cn } from "@/lib/utils"
import type { SuggestedPlaylist, Song } from "@/lib/mock-data"
import { ArrowLeft, Check, Plus, Music, Play, X, Shuffle } from "lucide-react"

interface PlaylistDetailProps {
  playlist: SuggestedPlaylist
  songs: Song[]
  isAccepted: boolean
  removedSongs: Set<string>
  onAccept: () => void
  onBack: () => void
  onRemoveSong: (songId: string) => void
  onRestoreSong: (songId: string) => void
}

export function PlaylistDetail({
  playlist,
  songs,
  isAccepted,
  removedSongs,
  onAccept,
  onBack,
  onRemoveSong,
  onRestoreSong,
}: PlaylistDetailProps) {
  const playlistSongs = playlist.songs
    .map((id) => songs.find((s) => s.id === id))
    .filter(Boolean) as Song[]

  const activeSongs = playlistSongs.filter((s) => !removedSongs.has(s.id))
  const removed = playlistSongs.filter((s) => removedSongs.has(s.id))

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border p-4 sm:p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors self-start"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to suggestions
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-4">
            <div className={cn("flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br", playlist.color)}>
              <Music className="h-7 w-7 sm:h-8 sm:w-8 text-foreground" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Suggested Playlist</p>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">{playlist.name}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{playlist.description}</p>
              <p className="text-xs font-mono text-muted-foreground/60 mt-1">
                {activeSongs.length} tracks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2.5 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors">
              <Shuffle className="h-3.5 w-3.5" />
              Shuffle
            </button>
            <button className="flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2.5 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors">
              <Play className="h-3.5 w-3.5" />
              Preview All
            </button>
            <button
              onClick={onAccept}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors",
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
                  Accept Playlist
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Song list */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-border/50">
          {activeSongs.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center gap-3 px-4 sm:px-6 py-3 hover:bg-secondary/30 transition-colors group"
            >
              <span className="w-6 text-center text-xs font-mono text-muted-foreground/50">{index + 1}</span>
              <div className={cn("h-10 w-10 shrink-0 rounded-md flex items-center justify-center", song.coverColor)}>
                <Music className="h-4 w-4 text-foreground/80" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{song.title}</p>
                <p className="text-xs text-muted-foreground truncate">{song.artist} &middot; {song.album}</p>
              </div>
              <span className="hidden sm:block rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground capitalize">
                {song.mood}
              </span>
              <span className="text-xs font-mono text-muted-foreground/50">{song.duration}</span>
              <button
                onClick={() => onRemoveSong(song.id)}
                className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                aria-label={`Remove ${song.title} from playlist`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Removed songs */}
        {removed.length > 0 && (
          <div className="border-t border-border px-4 sm:px-6 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Removed ({removed.length})
            </p>
            <div className="flex flex-col gap-1">
              {removed.map((song) => (
                <div
                  key={song.id}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 opacity-50"
                >
                  <div className={cn("h-8 w-8 shrink-0 rounded flex items-center justify-center bg-secondary")}>
                    <Music className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground line-through truncate">{song.title}</p>
                    <p className="text-xs text-muted-foreground/50 truncate">{song.artist}</p>
                  </div>
                  <button
                    onClick={() => onRestoreSong(song.id)}
                    className="text-xs text-primary hover:underline"
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
