"use client"

import type { SuggestedPlaylist, Song, PlaylistCategory } from "@/lib/mock-data"
import { PlaylistCategorySection } from "./playlist-category-section"

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
  const categories = Array.from(new Set(playlists.map((p) => p.category))) as PlaylistCategory[]

  return (
    <div className="flex flex-col gap-8 p-4 sm:p-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Organize Your Library</h2>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          We analyzed your liked songs and created playlists by artist, features, release year, popularity, and duration.
        </p>
      </div>

      {categories.map((category) => (
        <PlaylistCategorySection
          key={category}
          category={category}
          playlists={playlists.filter((p) => p.category === category)}
          songs={songs}
          acceptedPlaylists={acceptedPlaylists}
          onAcceptPlaylist={onAcceptPlaylist}
          onViewPlaylist={onViewPlaylist}
        />
      ))}
    </div>
  )
}
