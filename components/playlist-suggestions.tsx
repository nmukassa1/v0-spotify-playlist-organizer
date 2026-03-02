"use client"

import { cn } from "@/lib/utils"
import type { SuggestedPlaylist, Song, PlaylistCategory } from "@/lib/mock-data"
import { categoryLabels } from "@/lib/mock-data"
import { User, Users, Calendar, Star, Timer, Zap, Plus, Check, ArrowRight, Music } from "lucide-react"

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  user: User,
  users: Users,
  calendar: Calendar,
  trending: Star,
  gem: Star,
  clock: Timer,
  zap: Zap,
}

const categoryBadgeStyles: Record<PlaylistCategory, { bg: string; text: string }> = {
  artist: { bg: "bg-chart-1/15", text: "text-chart-1" },
  features: { bg: "bg-chart-2/15", text: "text-chart-2" },
  year: { bg: "bg-chart-3/15", text: "text-chart-3" },
  popularity: { bg: "bg-chart-5/15", text: "text-chart-5" },
  duration: { bg: "bg-chart-4/15", text: "text-chart-4" },
}

interface PlaylistSuggestionsProps {
  playlists: SuggestedPlaylist[]
  songs: Song[]
  acceptedPlaylists: Set<string>
  onAcceptPlaylist: (playlistId: string) => void
  onViewPlaylist: (playlistId: string) => void
}

export function PlaylistSuggestions({
  playlists,
  songs,
  acceptedPlaylists,
  onAcceptPlaylist,
  onViewPlaylist,
}: PlaylistSuggestionsProps) {
  // Group playlists by category
  const categories = Array.from(new Set(playlists.map((p) => p.category))) as PlaylistCategory[]

  return (
    <div className="flex flex-col gap-8 p-4 sm:p-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Organize Your Library</h2>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          We analyzed your liked songs and created playlists by artist, features, release year, popularity, and duration.
        </p>
      </div>

      {categories.map((category) => {
        const catPlaylists = playlists.filter((p) => p.category === category)
        const badgeStyle = categoryBadgeStyles[category]

        return (
          <div key={category}>
            <div className="flex items-center gap-2 mb-4">
              <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", badgeStyle.bg, badgeStyle.text)}>
                {categoryLabels[category]}
              </span>
              <span className="text-xs text-muted-foreground">
                {catPlaylists.length} {catPlaylists.length === 1 ? "playlist" : "playlists"}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {catPlaylists.map((playlist) => {
                const Icon = categoryIcons[playlist.icon] || Music
                const isAccepted = acceptedPlaylists.has(playlist.id)
                const playlistSongs = playlist.songs
                  .map((id) => songs.find((s) => s.id === id))
                  .filter(Boolean) as Song[]

                return (
                  <div
                    key={playlist.id}
                    className={cn(
                      "group relative flex flex-col rounded-xl border transition-all",
                      isAccepted
                        ? "border-primary/30 bg-primary/5"
                        : "border-border bg-card hover:border-muted-foreground/20"
                    )}
                  >
                    {/* Header */}
                    <div className="flex items-start gap-4 p-5 pb-3">
                      <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br", playlist.color)}>
                        <Icon className="h-5 w-5 text-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-foreground">{playlist.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{playlist.description}</p>
                      </div>
                    </div>

                    {/* Song preview */}
                    <div className="px-5 pb-3">
                      <div className="flex flex-col gap-1.5">
                        {playlistSongs.slice(0, 3).map((song) => (
                          <div key={song.id} className="flex items-center gap-2">
                            <div className={cn("h-6 w-6 shrink-0 rounded flex items-center justify-center", song.coverColor)}>
                              <Music className="h-3 w-3 text-foreground/80" />
                            </div>
                            <span className="truncate text-xs text-muted-foreground">
                              {song.title}
                              {song.featuredArtists.length > 0 && (
                                <span className="text-muted-foreground/50"> ft. {song.featuredArtists.join(", ")}</span>
                              )}
                            </span>
                            <span className="ml-auto shrink-0 text-[10px] text-muted-foreground/50 font-mono">
                              {song.duration}
                            </span>
                          </div>
                        ))}
                        {playlistSongs.length > 3 && (
                          <p className="text-[11px] text-muted-foreground/50 pl-8">
                            +{playlistSongs.length - 3} more tracks
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 border-t border-border/50 px-5 py-3 mt-auto">
                      <button
                        onClick={() => onAcceptPlaylist(playlist.id)}
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
                        onClick={() => onViewPlaylist(playlist.id)}
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
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
