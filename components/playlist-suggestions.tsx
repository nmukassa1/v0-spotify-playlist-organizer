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
  artist: { bg: "bg-primary/15", text: "text-primary" },
  features: { bg: "bg-blue-500/15", text: "text-blue-600" },
  year: { bg: "bg-amber-500/15", text: "text-amber-600" },
  popularity: { bg: "bg-orange-500/15", text: "text-orange-600" },
  duration: { bg: "bg-pink-500/15", text: "text-pink-600" },
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
      <div className="glass rounded-3xl p-6">
        <h2 className="text-xl font-bold text-foreground">Organize Your Library</h2>
        <p className="mt-1 text-sm text-foreground/60 leading-relaxed">
          We analyzed your liked songs and created playlists by artist, features, release year, popularity, and duration.
        </p>
      </div>

      {categories.map((category) => {
        const catPlaylists = playlists.filter((p) => p.category === category)
        const badgeStyle = categoryBadgeStyles[category]

        return (
          <div key={category}>
            <div className="flex items-center gap-3 mb-4">
              <span className={cn("rounded-full px-4 py-1.5 text-xs font-semibold", badgeStyle.bg, badgeStyle.text)}>
                {categoryLabels[category]}
              </span>
              <span className="text-xs text-foreground/50">
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
                      "group relative flex flex-col rounded-3xl transition-all",
                      isAccepted
                        ? "glass-strong shadow-lg shadow-primary/10"
                        : "glass hover:shadow-lg"
                    )}
                  >
                    {/* Header */}
                    <div className="flex items-start gap-4 p-6 pb-4">
                      <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg", playlist.color)}>
                        <Icon className="h-6 w-6 text-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold text-foreground">{playlist.name}</h3>
                        <p className="text-xs text-foreground/60 mt-0.5 leading-relaxed">{playlist.description}</p>
                      </div>
                    </div>

                    {/* Song preview */}
                    <div className="px-6 pb-4">
                      <div className="flex flex-col gap-2">
                        {playlistSongs.slice(0, 3).map((song) => (
                          <div key={song.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/30 transition-colors">
                            <div className={cn("h-8 w-8 shrink-0 rounded-lg flex items-center justify-center", song.coverColor)}>
                              <Music className="h-3.5 w-3.5 text-foreground/80" />
                            </div>
                            <span className="truncate text-xs text-foreground/80 font-medium">
                              {song.title}
                              {song.featuredArtists.length > 0 && (
                                <span className="text-foreground/50 font-normal"> ft. {song.featuredArtists.join(", ")}</span>
                              )}
                            </span>
                            <span className="ml-auto shrink-0 text-[10px] text-foreground/40 font-mono">
                              {song.duration}
                            </span>
                          </div>
                        ))}
                        {playlistSongs.length > 3 && (
                          <p className="text-[11px] text-foreground/40 pl-11">
                            +{playlistSongs.length - 3} more tracks
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 border-t border-white/20 px-6 py-4 mt-auto">
                      <button
                        onClick={() => onAcceptPlaylist(playlist.id)}
                        className={cn(
                          "flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold transition-all",
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
                            Accept
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => onViewPlaylist(playlist.id)}
                        className="flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-xs font-medium text-foreground/70 hover:text-foreground hover:bg-white/40 transition-all"
                      >
                        Preview
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                      <span className="ml-auto text-[10px] font-mono text-foreground/40 bg-white/30 px-2 py-1 rounded-full">
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
