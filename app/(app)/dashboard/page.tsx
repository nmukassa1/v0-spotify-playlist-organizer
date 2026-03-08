"use client"

import { useSpotifyLikedSongs, useReleasedPlaylists } from "@/hooks/use-spotify"
import { mapSpotifySavedTracksToSongs } from "@/lib/spotify-mappers"
import { suggestedPlaylists } from "@/lib/mock-data"
import { useAppState } from "@/contexts/app-state-context"
import { DashboardView } from "@/components/dashboard/dashboard-view"

const LIKED_LIMIT = 50

export default function DashboardPage() {
  const { acceptedPlaylists } = useAppState()
  const { tracks, total, isLoading, error } = useSpotifyLikedSongs(LIKED_LIMIT, 0)
  const { count: releasedPlaylistCount, range: releasedRange, isLoading: releasedLoading, playlists: releasedPlaylists } = useReleasedPlaylists()
  const songs = mapSpotifySavedTracksToSongs(tracks)

  return (
    <DashboardView
      songs={songs}
      playlists={suggestedPlaylists}
      acceptedPlaylists={acceptedPlaylists}
      totalLikedSongs={total}
      isLoading={isLoading}
      releasedYearSummary={{
        range: releasedRange,
        playlistCount: releasedPlaylistCount,
        playlists: releasedPlaylists,
        isLoading: releasedLoading,
      }}
    />
  )
}
