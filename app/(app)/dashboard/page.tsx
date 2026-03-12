"use client";

import { useSpotifyLikedSongs, useReleasedPlaylists, useSpotifyPlaylists } from "@/hooks/use-spotify";
import { mapSpotifySavedTracksToSongs } from "@/lib/spotify-mappers";
import { DashboardView } from "@/components/dashboard/dashboard-view";

const LIKED_LIMIT = 50;

export default function DashboardPage() {
  const { tracks, total, isLoading } = useSpotifyLikedSongs(LIKED_LIMIT, 0);
  const { range: releasedRange, playlistCount: releasedPlaylistCount, isLoading: releasedLoading, playlists: releasedPlaylists } = useReleasedPlaylists();
  const { total: playlistTotal } = useSpotifyPlaylists(1, 0);
  const songs = mapSpotifySavedTracksToSongs(tracks);

  return (
    <DashboardView
      songs={songs}
      totalLikedSongs={total}
      isLoading={isLoading}
      releasedYearSummary={{
        range: releasedRange,
        playlistCount: releasedPlaylistCount,
        playlists: releasedPlaylists,
        isLoading: releasedLoading,
      }}
      organizedPlaylistCount={playlistTotal}
    />
  );
}
