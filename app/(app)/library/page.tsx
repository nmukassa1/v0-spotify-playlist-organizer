"use client"

import { useSpotifyLikedSongs } from "@/hooks/use-spotify"
import { mapSpotifySavedTracksToSongs } from "@/lib/spotify-mappers"
import { useAppState } from "@/contexts/app-state-context"
import { SongList } from "@/components/song-list/song-list"

const LIKED_LIMIT = 50

export default function LibraryPage() {
  const {
    selectedSongs,
    handleToggleSong,
    handleSelectAll,
    handleDeselectAll,
  } = useAppState()
  const { tracks, total, isLoading, error } = useSpotifyLikedSongs(LIKED_LIMIT, 0)
  const songs = mapSpotifySavedTracksToSongs(tracks)

  return (
    <SongList
      songs={songs}
      selectedSongs={selectedSongs}
      onToggleSong={handleToggleSong}
      onSelectAll={() => handleSelectAll(songs.map((s) => s.id))}
      onDeselectAll={handleDeselectAll}
      isLoading={isLoading}
      error={error}
    />
  )
}
