"use client"

import { cn } from "@/lib/utils"
import type { SuggestedPlaylist, Song, PlaylistCategory } from "@/lib/mock-data"
import { CategoryBadge } from "@/components/playlist/category-badge"
import { EmptyPlaylistsState } from "./empty-playlists-state"
import { MyPlaylistCard } from "./my-playlist-card"

interface MyPlaylistsViewProps {
  playlists: SuggestedPlaylist[]
  songs: Song[]
  acceptedPlaylists: Set<string>
  onViewPlaylist: (playlistId: string) => void
  onViewSuggestions?: () => void
}

export function MyPlaylistsView({
  playlists,
  songs,
  acceptedPlaylists,
  onViewPlaylist,
  onViewSuggestions,
}: MyPlaylistsViewProps) {
  const accepted = playlists.filter((p) => acceptedPlaylists.has(p.id))

  if (accepted.length === 0) {
    return (
      <EmptyPlaylistsState onViewSuggestions={onViewSuggestions ?? (() => {})} />
    )
  }

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
        return (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3">
              <CategoryBadge category={category} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {catPlaylists.map((playlist) => (
                <MyPlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  songs={songs}
                  onView={() => onViewPlaylist(playlist.id)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
