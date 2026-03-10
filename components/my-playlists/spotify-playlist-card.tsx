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
  const trackCount = playlist.items?.total ?? 0;

  return (
    <div
      className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:border-muted-foreground/20 transition-all cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={onView}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onView();
        }
      }}
    >
      <div className="px-4 pt-4 pb-2">
        <h3 className="text-sm font-semibold text-foreground truncate">
          {playlist.name}
        </h3>
        <p className="text-[11px] text-muted-foreground">
          {trackCount} track{trackCount !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="relative h-28 bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-secondary" />
        )}
      </div>

      <div className="flex items-center justify-end border-t border-border/50 px-4 py-2.5">
        <a
          href={`https://open.spotify.com/playlist/${playlist.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          Open in Spotify <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
