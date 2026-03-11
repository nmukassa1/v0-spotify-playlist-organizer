"use client";

import type { SpotifyPlaylistItem } from "@/lib/spotify-types";
import { CreatePlaylistButton } from "./create-playlist-button";
import { EmptyPlaylistsState } from "./empty-playlists-state";
import { SpotifyPlaylistCard } from "./spotify-playlist-card";

interface MyPlaylistsViewProps {
  playlists: SpotifyPlaylistItem[];
  isLoading: boolean;
  onViewPlaylist: (id: string) => void;
}

export function MyPlaylistsView({
  playlists,
  isLoading,
  onViewPlaylist,
}: MyPlaylistsViewProps) {
  const total = playlists.length;
  const headerAction = <CreatePlaylistButton onCreated={onViewPlaylist} />;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-4 sm:p-6 overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">My Playlists</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Loading your playlists…
            </p>
          </div>
          {headerAction}
        </div>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="flex flex-col gap-6 p-4 sm:p-6 overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">My Playlists</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              0 playlists in your Spotify library
            </p>
          </div>
          {headerAction}
        </div>
        <EmptyPlaylistsState />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 overflow-y-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">My Playlists</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {total} playlist{total !== 1 ? "s" : ""} in your Spotify library
          </p>
        </div>
        {headerAction}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {playlists.map((playlist) => (
          <SpotifyPlaylistCard
            key={playlist.id}
            playlist={playlist}
            onView={() => onViewPlaylist(playlist.id)}
          />
        ))}
      </div>
    </div>
  );
}
