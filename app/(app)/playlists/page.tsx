"use client";

import { useRouter } from "next/navigation";
import { useSpotifyPlaylists } from "@/hooks/use-spotify";
import { MyPlaylistsView } from "@/components/my-playlists/my-playlists-view";

export default function PlaylistsPage() {
  const router = useRouter();
  const { playlists, isLoading } = useSpotifyPlaylists(50, 0);

  return (
    <MyPlaylistsView
      playlists={playlists}
      isLoading={isLoading}
      onViewPlaylist={(id) => router.push(`/playlists/${id}`)}
    />
  );
}
