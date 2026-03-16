"use client"

import { cn } from "@/lib/utils"
import type { SuggestedPlaylist, Song } from "@/lib/mock-data"
import { categoryLabels } from "@/lib/mock-data"
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

  const totalDuration = (() => {
    const total = activeSongs.reduce((a, s) => a + s.durationSeconds, 0)
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  })()

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 p-4 sm:p-6 m-4 glass rounded-3xl">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-foreground/60 hover:text-foreground transition-colors self-start rounded-full bg-white/40 px-3 py-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to suggestions
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-4">
            <div className={cn("flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br shadow-xl", playlist.color)}>
              <Music className="h-8 w-8 sm:h-10 sm:w-10 text-foreground" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/15 px-2 py-0.5 rounded-full inline-block">
                {categoryLabels[playlist.category]}
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-1">{playlist.name}</h2>
              <p className="text-sm text-foreground/60 mt-0.5">{playlist.description}</p>
              <p className="text-xs font-mono text-foreground/40 mt-1">
                {activeSongs.length} tracks &middot; {totalDuration}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button className="flex items-center gap-2 rounded-2xl bg-white/50 px-4 py-3 text-xs font-medium text-foreground hover:bg-white/70 transition-all">
              <Shuffle className="h-4 w-4" />
              Shuffle
            </button>
            <button className="flex items-center gap-2 rounded-2xl bg-white/50 px-4 py-3 text-xs font-medium text-foreground hover:bg-white/70 transition-all">
              <Play className="h-4 w-4" />
              Preview All
            </button>
            <button
              onClick={onAccept}
              className={cn(
                "flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-semibold transition-all",
                isAccepted
                  ? "bg-primary/15 text-primary"
                  : "bg-primary text-white hover:shadow-lg hover:shadow-primary/30 hover:scale-105"
              )}
            >
              {isAccepted ? (
                <>
                  <Check className="h-4 w-4" />
                  Accepted
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Accept Playlist
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Song list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="flex flex-col gap-2">
          {activeSongs.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/40 transition-all rounded-2xl group"
            >
              <span className="w-6 text-center text-xs font-mono text-foreground/40">{index + 1}</span>
              <div className={cn("h-12 w-12 shrink-0 rounded-xl flex items-center justify-center", song.coverColor)}>
                <Music className="h-5 w-5 text-foreground/80" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">
                  {song.title}
                  {song.featuredArtists.length > 0 && (
                    <span className="text-foreground/50 font-normal"> ft. {song.featuredArtists.join(", ")}</span>
                  )}
                </p>
                <p className="text-xs text-foreground/60 truncate">{song.artist} &middot; {song.album}</p>
              </div>
              <span className="hidden sm:block rounded-full bg-white/50 px-2.5 py-1 text-[10px] font-medium text-foreground/70">
                {song.releaseYear}
              </span>
              <span className="hidden sm:block rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-semibold text-primary">
                {song.popularity}
              </span>
              <span className="text-xs font-mono text-foreground/40">{song.duration}</span>
              <button
                onClick={() => onRemoveSong(song.id)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-foreground/30 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                aria-label={`Remove ${song.title} from playlist`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Removed songs */}
        {removed.length > 0 && (
          <div className="mx-4 mt-4 glass-subtle rounded-2xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-3">
              Removed ({removed.length})
            </p>
            <div className="flex flex-col gap-2">
              {removed.map((song) => (
                <div key={song.id} className="flex items-center gap-3 rounded-xl px-3 py-2 opacity-60 bg-white/30">
                  <div className="h-9 w-9 shrink-0 rounded-lg flex items-center justify-center bg-white/50">
                    <Music className="h-3.5 w-3.5 text-foreground/50" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground/60 line-through truncate">{song.title}</p>
                    <p className="text-xs text-foreground/40 truncate">{song.artist}</p>
                  </div>
                  <button onClick={() => onRestoreSong(song.id)} className="text-xs font-medium text-primary hover:text-primary/80 rounded-full bg-primary/15 px-3 py-1">
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
