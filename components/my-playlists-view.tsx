"use client"

import { cn } from "@/lib/utils"
import type { SuggestedPlaylist, Song, PlaylistCategory } from "@/lib/mock-data"
import { categoryLabels } from "@/lib/mock-data"
import { Music, Play, MoreHorizontal, ArrowRight, Sparkles } from "lucide-react"

const categoryBadgeStyles: Record<PlaylistCategory, { bg: string; text: string }> = {
  artist: { bg: "bg-primary/15", text: "text-primary" },
  features: { bg: "bg-blue-500/15", text: "text-blue-600" },
  year: { bg: "bg-amber-500/15", text: "text-amber-600" },
  popularity: { bg: "bg-orange-500/15", text: "text-orange-600" },
  duration: { bg: "bg-pink-500/15", text: "text-pink-600" },
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
      <div className="flex flex-col items-center justify-center h-full gap-6 p-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl glass shadow-lg">
          <Music className="h-9 w-9 text-foreground/60" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">No playlists yet</h3>
          <p className="text-sm text-foreground/60 mt-2 max-w-sm leading-relaxed">
            Accept playlist suggestions to start building your organized library.
          </p>
        </div>
        <button
          onClick={() => onNavigate("suggestions")}
          className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all"
        >
          <Sparkles className="h-5 w-5" />
          View Suggestions
        </button>
      </div>
    )
  }

  // Group by category
  const categories = Array.from(new Set(accepted.map((p) => p.category))) as PlaylistCategory[]

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 overflow-y-auto">
      <div className="glass rounded-3xl p-6">
        <h2 className="text-xl font-bold text-foreground">My Playlists</h2>
        <p className="mt-1 text-sm text-foreground/60">
          {accepted.length} playlist{accepted.length !== 1 ? "s" : ""} created from suggestions
        </p>
      </div>

      {categories.map((category) => {
        const catPlaylists = accepted.filter((p) => p.category === category)
        const badgeStyle = categoryBadgeStyles[category]

        return (
          <div key={category}>
            <div className="flex items-center gap-3 mb-4">
              <span className={cn("rounded-full px-4 py-1.5 text-xs font-semibold", badgeStyle.bg, badgeStyle.text)}>
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
                    className="group flex flex-col rounded-3xl glass overflow-hidden hover:shadow-lg transition-all"
                  >
                    {/* Playlist cover */}
                    <div className={cn("relative h-32 bg-gradient-to-br flex items-end p-5 rounded-t-3xl", playlist.color)}>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground">{playlist.name}</h3>
                        <p className="text-xs text-foreground/60">{playlist.songCount} tracks</p>
                      </div>
                      <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                        <Play className="h-5 w-5 ml-0.5" />
                      </button>
                    </div>

                    {/* Song list */}
                    <div className="flex flex-col gap-2 p-4">
                      {playlistSongs.slice(0, 3).map((song, i) => (
                        <div key={song.id} className="flex items-center gap-2.5 px-2 py-1 rounded-xl hover:bg-white/30 transition-colors">
                          <span className="text-[10px] font-mono text-foreground/40 w-4">{i + 1}</span>
                          <div className={cn("h-8 w-8 shrink-0 rounded-lg flex items-center justify-center", song.coverColor)}>
                            <Music className="h-3.5 w-3.5 text-foreground/80" />
                          </div>
                          <span className="text-xs text-foreground font-medium truncate flex-1">
                            {song.title}
                            {song.featuredArtists.length > 0 && (
                              <span className="text-foreground/50 font-normal"> ft. {song.featuredArtists.join(", ")}</span>
                            )}
                          </span>
                          <span className="text-[10px] font-mono text-foreground/40">{song.duration}</span>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between border-t border-white/20 px-5 py-4 mt-auto">
                      <button
                        onClick={() => onViewPlaylist(playlist.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                      >
                        View all <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                      <button className="text-foreground/30 hover:text-foreground/60 transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
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
