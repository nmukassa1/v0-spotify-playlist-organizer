"use client"

import { cn } from "@/lib/utils"
import type { SuggestedPlaylist, Song, PlaylistCategory } from "@/lib/mock-data"
import { categoryLabels } from "@/lib/mock-data"
import { Music, Play, MoreHorizontal, ArrowRight, Sparkles } from "lucide-react"

const categoryBadgeStyles: Record<PlaylistCategory, { bg: string; text: string }> = {
  artist: { bg: "bg-chart-1/15", text: "text-chart-1" },
  features: { bg: "bg-chart-2/15", text: "text-chart-2" },
  year: { bg: "bg-chart-3/15", text: "text-chart-3" },
  popularity: { bg: "bg-chart-5/15", text: "text-chart-5" },
  duration: { bg: "bg-chart-4/15", text: "text-chart-4" },
}

interface MyPlaylistsViewProps {
  playlists: SuggestedPlaylist[]
  songs: Song[]
  acceptedPlaylists: Set<string>
  onNavigate: (view: string) => void
  onViewPlaylist: (playlistId: string) => void
}

export function MyPlaylistsView({ playlists, songs, acceptedPlaylists, onNavigate, onViewPlaylist }: MyPlaylistsViewProps) {
  const accepted = playlists.filter((p) => acceptedPlaylists.has(p.id))

  if (accepted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
          <Music className="h-7 w-7 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">No playlists yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm leading-relaxed">
            Accept playlist suggestions to start building your organized library.
          </p>
        </div>
        <button
          onClick={() => onNavigate("suggestions")}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          View Suggestions
        </button>
      </div>
    )
  }

  // Group by category
  const categories = Array.from(new Set(accepted.map((p) => p.category))) as PlaylistCategory[]

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 overflow-y-auto">
      <div>
        <h2 className="text-xl font-bold text-foreground">My Playlists</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {accepted.length} playlist{accepted.length !== 1 ? "s" : ""} created from suggestions
        </p>
      </div>

      {categories.map((category) => {
        const catPlaylists = accepted.filter((p) => p.category === category)
        const badgeStyle = categoryBadgeStyles[category]

        return (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3">
              <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", badgeStyle.bg, badgeStyle.text)}>
                {categoryLabels[category]}
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {catPlaylists.map((playlist) => {
                const playlistSongs = playlist.songs
                  .map((id) => songs.find((s) => s.id === id))
                  .filter(Boolean) as Song[]

                return (
                  <div
                    key={playlist.id}
                    className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:border-muted-foreground/20 transition-all"
                  >
                    {/* Playlist cover */}
                    <div className={cn("relative h-28 bg-gradient-to-br flex items-end p-4", playlist.color)}>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground">{playlist.name}</h3>
                        <p className="text-xs text-muted-foreground">{playlist.songCount} tracks</p>
                      </div>
                      <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="h-4 w-4 ml-0.5" />
                      </button>
                    </div>

                    {/* Song list */}
                    <div className="flex flex-col gap-1 p-3">
                      {playlistSongs.slice(0, 3).map((song, i) => (
                        <div key={song.id} className="flex items-center gap-2 px-1">
                          <span className="text-[10px] font-mono text-muted-foreground/40 w-3">{i + 1}</span>
                          <div className={cn("h-6 w-6 shrink-0 rounded flex items-center justify-center", song.coverColor)}>
                            <Music className="h-3 w-3 text-foreground/80" />
                          </div>
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

                    {/* Actions */}
                    <div className="flex items-center justify-between border-t border-border/50 px-4 py-2.5 mt-auto">
                      <button
                        onClick={() => onViewPlaylist(playlist.id)}
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
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
