"use client";

import { ArrowRight, ExternalLink } from "lucide-react";
import type { SpotifyPlaylistItem } from "@/lib/spotify-types";

interface SpotifyPlaylistCardProps {
  playlist: SpotifyPlaylistItem;
  onView: () => void;
}

export function SpotifyPlaylistCard({
  playlist,
  onView,
}: SpotifyPlaylistCardProps) {
  const imageUrl = playlist.images?.[0]?.url;
  const trackCount = playlist.tracks?.total ?? 0;

  return (
    <div className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:border-muted-foreground/20 transition-all">
      <div className="relative h-28 flex items-end p-4 bg-gradient-to-br from-secondary/50 to-secondary">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}
        <div className="relative z-10 flex-1">
          <h3 className="text-lg font-bold text-foreground drop-shadow-sm">
            {playlist.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {trackCount} track{trackCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border/50 px-4 py-2.5">
        <button
          onClick={onView}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          View in app <ArrowRight className="h-3 w-3" />
        </button>
        <a
          href={`https://open.spotify.com/playlist/${playlist.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Open in Spotify <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
