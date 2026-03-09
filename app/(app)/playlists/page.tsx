"use client";

import { useRouter } from "next/navigation";
import { useOrganizedPlaylists } from "@/hooks/use-spotify";
import { MyPlaylistsView } from "@/components/my-playlists/my-playlists-view";

export default function PlaylistsPage() {
  const router = useRouter();
  const { playlists, isLoading } = useOrganizedPlaylists();

  return (
    <MyPlaylistsView
      playlists={playlists}
      isLoading={isLoading}
      onViewPlaylist={(id) => router.push(`/playlists/${id}`)}
    />
  );
}
