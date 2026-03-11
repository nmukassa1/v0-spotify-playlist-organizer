"use client";

import { useParams, useRouter } from "next/navigation";
import { useSpotifyPlaylist } from "@/hooks/use-spotify";
import { SpotifyPlaylistDetail } from "@/components/playlist-detail/spotify-playlist-detail";
import { Loader2 } from "lucide-react";

export default function PlaylistDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : params.id?.[0] ?? null;

  const { playlist, isLoading, error } = useSpotifyPlaylist(id);

  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-muted-foreground">
        <p>Playlist not found.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading playlist…</p>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-muted-foreground">
        <p>{error ?? "Playlist not found."}</p>
        <button
          onClick={() => router.push("/playlists")}
          className="text-sm text-primary hover:underline"
        >
          Back to playlists
        </button>
      </div>
    );
  }

  return (
    <SpotifyPlaylistDetail
      playlist={playlist}
      onBack={() => router.push("/playlists")}
    />
  );
}
