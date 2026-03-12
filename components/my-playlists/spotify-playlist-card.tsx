"use client";

import { Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SpotifyPlaylistItem } from "@/lib/spotify-types";

interface SpotifyPlaylistCardProps {
  playlist: SpotifyPlaylistItem;
  onView?: () => void;
  /** When set, card is selectable: shows checkbox and toggles on click instead of navigating */
  selectionMode?: { selected: boolean; onToggle: () => void };
}

export function SpotifyPlaylistCard({
  playlist,
  onView,
  selectionMode,
}: SpotifyPlaylistCardProps) {
  const imageUrl = playlist.images?.[0]?.url;
  const trackCount = playlist.items?.total ?? 0;
  const isSelectable = !!selectionMode;

  function handleClick() {
    if (isSelectable) {
      selectionMode!.onToggle();
    } else if (onView) {
      onView();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    handleClick();
  }

  return (
    <div
      className={cn(
        "group flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all cursor-pointer hover:border-muted-foreground/20",
        selectionMode?.selected && "ring-2 ring-primary border-primary"
      )}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="px-4 pt-4 pb-2 flex items-start gap-3">
        {isSelectable && (
          <div
            className={cn(
              "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
              selectionMode.selected ? "bg-primary border-primary" : "border-muted-foreground"
            )}
          >
            {selectionMode.selected && (
              <Check className="h-3 w-3 text-primary-foreground" />
            )}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-foreground truncate">
            {playlist.name}
          </h3>
          <p className="text-[11px] text-muted-foreground">
            {trackCount} track{trackCount !== 1 ? "s" : ""}
          </p>
        </div>
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

      {!isSelectable && (
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
      )}
    </div>
  );
}
