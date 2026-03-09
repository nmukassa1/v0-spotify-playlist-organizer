"use client";

import type { SpotifyPlaylistItem } from "@/lib/spotify-types";
import { EmptyPlaylistsState } from "./empty-playlists-state";
import { SpotifyPlaylistCard } from "./spotify-playlist-card";

function isOrganizedPlaylist(name: string): boolean {
  const n = name.trim();
  return (
    n.toLowerCase().startsWith("released:") ||
    n.toLowerCase().startsWith("artist focus:")
  );
}

function categorizePlaylist(name: string): "decade" | "artist-focus" {
  if (name.toLowerCase().startsWith("artist focus:")) return "artist-focus";
  return "decade";
}

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
  const organized = playlists.filter((p) => isOrganizedPlaylist(p.name));

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-4 sm:p-6 overflow-y-auto">
        <div>
          <h2 className="text-xl font-bold text-foreground">My Playlists</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Loading your playlists…
          </p>
        </div>
      </div>
    );
  }

  if (organized.length === 0) {
    return (
      <EmptyPlaylistsState onOrganize={() => window.location.assign("/dashboard")} />
    );
  }

  const decadePlaylists = organized.filter((p) => categorizePlaylist(p.name) === "decade");
  const artistFocusPlaylists = organized.filter((p) => categorizePlaylist(p.name) === "artist-focus");

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 overflow-y-auto">
      <div>
        <h2 className="text-xl font-bold text-foreground">My Playlists</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {organized.length} playlist{organized.length !== 1 ? "s" : ""} created from the dashboard
        </p>
      </div>

      {decadePlaylists.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="rounded-full bg-chart-3/15 px-2.5 py-1 text-[11px] font-semibold text-chart-3">
              By decade
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {decadePlaylists.map((playlist) => (
              <SpotifyPlaylistCard
                key={playlist.id}
                playlist={playlist}
                onView={() => onViewPlaylist(playlist.id)}
              />
            ))}
          </div>
        </div>
      )}

      {artistFocusPlaylists.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="rounded-full bg-chart-2/15 px-2.5 py-1 text-[11px] font-semibold text-chart-2">
              Solo vs features
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {artistFocusPlaylists.map((playlist) => (
              <SpotifyPlaylistCard
                key={playlist.id}
                playlist={playlist}
                onView={() => onViewPlaylist(playlist.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
