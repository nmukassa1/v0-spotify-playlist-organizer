"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import type { SpotifyPlaylistWithTracks } from "@/hooks/use-spotify";
import { SongCover } from "@/components/song/song-cover";

interface SpotifyPlaylistDetailProps {
  playlist: SpotifyPlaylistWithTracks;
  onBack: () => void;
}

function formatDuration(ms: number): string {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatTotalDuration(tracks: SpotifyPlaylistWithTracks["tracks"]): string {
  const totalMs = tracks.reduce((sum, { track }) => sum + track.duration_ms, 0);
  const m = Math.floor(totalMs / 60000);
  const s = Math.floor((totalMs % 60000) / 1000);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function SpotifyPlaylistDetail({
  playlist,
  onBack,
}: SpotifyPlaylistDetailProps) {
  const totalDuration = formatTotalDuration(playlist.tracks);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-4 border-b border-border p-4 sm:p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors self-start"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to playlists
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-start gap-4">
            {playlist.imageUrl ? (
              <img
                src={playlist.imageUrl}
                alt=""
                className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-2xl object-cover"
              />
            ) : (
              <div className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-2xl bg-secondary" />
            )}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {playlist.name}
              </h2>
              <p className="text-xs font-mono text-muted-foreground/60 mt-1">
                {playlist.trackCount} tracks &middot; {totalDuration}
              </p>
              <a
                href={`https://open.spotify.com/playlist/${playlist.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 mt-2 text-xs text-primary hover:underline"
              >
                Open in Spotify <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-border/50">
          {playlist.tracks.map(({ track }, index) => {
            const artists = track.artists.map((a) => a.name).join(", ");
            const imageUrl = track.album?.images?.[0]?.url;
            return (
              <div
                key={track.id}
                className="flex items-center gap-3 px-4 sm:px-6 py-3 hover:bg-secondary/30 transition-colors"
              >
                <span className="w-6 text-center text-xs font-mono text-muted-foreground/50">
                  {index + 1}
                </span>
                <SongCover
                  size="lg"
                  colorClass="bg-muted"
                  imageUrl={imageUrl}
                  className="rounded-md"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {track.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {artists}
                    {track.album?.name ? ` · ${track.album.name}` : ""}
                  </p>
                </div>
                {track.album?.release_date && (
                  <span className="hidden sm:block rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {track.album.release_date.slice(0, 4)}
                  </span>
                )}
                <span className="text-xs font-mono text-muted-foreground/50">
                  {formatDuration(track.duration_ms)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
