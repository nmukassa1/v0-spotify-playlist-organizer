"use client"

import type { PlaylistCategory } from "@/lib/mock-data"
import type { SuggestedPlaylist } from "@/lib/mock-data"
import type { Song } from "@/lib/mock-data"
import { CategoryBadge } from "@/components/playlist/category-badge"
import { PlaylistSuggestionCard } from "./playlist-suggestion-card"

interface PlaylistCategorySectionProps {
  category: PlaylistCategory
  playlists: SuggestedPlaylist[]
  songs: Song[]
  acceptedPlaylists: Set<string>
  onAcceptPlaylist: (playlistId: string) => void
  onViewPlaylist: (playlistId: string) => void
}

export function PlaylistCategorySection({
  category,
  playlists,
  songs,
  acceptedPlaylists,
  onAcceptPlaylist,
  onViewPlaylist,
}: PlaylistCategorySectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <CategoryBadge category={category} />
        <span className="text-xs text-muted-foreground">
          {playlists.length} {playlists.length === 1 ? "playlist" : "playlists"}
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {playlists.map((playlist) => (
          <PlaylistSuggestionCard
            key={playlist.id}
            playlist={playlist}
            songs={songs}
            isAccepted={acceptedPlaylists.has(playlist.id)}
            onAccept={() => onAcceptPlaylist(playlist.id)}
            onView={() => onViewPlaylist(playlist.id)}
          />
        ))}
      </div>
    </div>
  )
}
