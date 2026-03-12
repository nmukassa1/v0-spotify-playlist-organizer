"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Music, User, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SongCover } from "@/components/song/song-cover";
import {
  fetchAllLikedSongs,
  groupLikedSongsByArtistFocus,
} from "@/lib/liked-songs";
import type { SpotifySavedTrack } from "@/lib/spotify-types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { spotifyKeys } from "@/hooks/use-spotify";

interface OrganizeByArtistFocusPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type CreatedPlaylistItem = {
  bucketId: "solo" | "with-features";
  playlistId: string;
  name: string;
  trackCount: number;
};

function formatDuration(ms: number): string {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function TrackRow({ saved }: { saved: SpotifySavedTrack }) {
  const t = saved.track;
  const imageUrl = t.album?.images?.[0]?.url ?? null;
  const artists = t.artists?.map((a) => a.name).join(", ") ?? "—";
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary/50">
      <SongCover
        size="sm"
        colorClass="bg-muted"
        imageUrl={imageUrl}
        className="rounded"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{t.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {artists} · {t.album?.name ?? "—"}
        </p>
      </div>
      <span className="text-[10px] font-mono text-muted-foreground shrink-0">
        {formatDuration(t.duration_ms ?? 0)}
      </span>
    </div>
  );
}

export function OrganizeByArtistFocusPreviewModal({
  open,
  onOpenChange,
}: OrganizeByArtistFocusPreviewModalProps) {
  const queryClient = useQueryClient();
  const [created, setCreated] = useState<CreatedPlaylistItem[] | null>(null);

  const {
    data: likedTracks,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: spotifyKeys.likedAll(),
    queryFn: fetchAllLikedSongs,
    enabled: open,
  });

  const buckets = likedTracks ? groupLikedSongsByArtistFocus(likedTracks) : null;
  const totalTracks =
    buckets?.reduce((sum, bucket) => sum + bucket.tracks.length, 0) ?? 0;

  const error = queryError
    ? queryError instanceof Error
      ? queryError.message
      : "Failed to load songs"
    : null;

  const createPlaylistsMutation = useMutation({
    mutationFn: async (payload: {
      playlists: { bucketId: "solo" | "with-features"; label: string; trackIds: string[] }[];
    }) => {
      const res = await fetch("/api/spotify/organize-by-artist-focus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data.error as string) || res.statusText || "Failed to create playlists");
      }
      return data as { created: CreatedPlaylistItem[] };
    },
    onSuccess: (data) => {
      setCreated(data.created ?? []);
      queryClient.invalidateQueries({ queryKey: spotifyKeys.playlists(50, 0) });
      queryClient.invalidateQueries({ queryKey: spotifyKeys.organizedPlaylists() });
    },
  });

  const creating = createPlaylistsMutation.isPending;
  const createError = createPlaylistsMutation.error?.message ?? null;

  const deletePlaylistsMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/spotify/delete-artist-focus-playlists", {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data.error as string) || res.statusText || "Failed to delete Artist Focus playlists");
      }
      return data as { deleted: number };
    },
    onSuccess: (data) => {
      setCreated(null);
      queryClient.invalidateQueries({ queryKey: spotifyKeys.playlists(50, 0) });
      queryClient.invalidateQueries({ queryKey: spotifyKeys.organizedPlaylists() });
      const count = data.deleted ?? 0;
      if (count > 0) {
        alert(
          `Deleted ${count} playlist${count !== 1 ? "s" : ""} starting with "Artist Focus:".`,
        );
      }
    },
  });

  const deleting = deletePlaylistsMutation.isPending;
  const deleteError = deletePlaylistsMutation.error?.message ?? null;
  const displayError = error ?? createError ?? deleteError;

  function handleCreatePlaylists() {
    if (!buckets || buckets.length === 0) return;
    const playlists = buckets
      .filter((bucket) => bucket.tracks.length > 0)
      .map((bucket) => ({
        bucketId: bucket.id,
        label: bucket.name,
        trackIds: bucket.tracks.map((saved) => saved.track.id).filter(Boolean),
      }));
    if (playlists.length === 0) return;
    createPlaylistsMutation.mutate({ playlists });
  }

  function handleDeleteArtistFocusPlaylists() {
    deletePlaylistsMutation.mutate();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Artist Focus: features vs solo
          </DialogTitle>
          <DialogDescription>
            Preview how your liked songs are split between solo tracks and songs
            with featured artists or collaborators.
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Loading your liked songs…
            </p>
          </div>
        )}

        {displayError && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {displayError}
          </div>
        )}

        {!loading && !displayError && buckets && buckets.length > 0 && !created && (
          <div className="flex flex-col gap-1 overflow-hidden">
            <p className="text-xs text-muted-foreground pb-2">
              {buckets.length} playlist{buckets.length !== 1 ? "s" : ""} ·{" "}
              {totalTracks} track{totalTracks !== 1 ? "s" : ""}
            </p>
            <div className="overflow-y-auto flex-1 min-h-0 space-y-1 pr-1">
              {buckets.map((bucket) => {
                const Icon = bucket.id === "solo" ? User : Users;
                return (
                  <Collapsible key={bucket.id} defaultOpen={false}>
                    <CollapsibleTrigger
                      className={cn(
                        "group flex w-full items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-left",
                        "hover:bg-secondary/50 transition-colors",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="font-semibold text-foreground">
                        {bucket.name}
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {bucket.tracks.length} song
                        {bucket.tracks.length !== 1 ? "s" : ""}
                      </span>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="mt-1 ml-2 pl-4 border-l border-border space-y-0.5 py-2">
                        {bucket.tracks.length === 0 ? (
                          <p className="text-xs text-muted-foreground px-2">
                            No tracks
                          </p>
                        ) : (
                          bucket.tracks.map((saved) => (
                            <TrackRow key={saved.track.id} saved={saved} />
                          ))
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
            <div className="pt-3 border-t border-border space-y-2">
              <Button
                onClick={handleCreatePlaylists}
                disabled={creating || totalTracks === 0}
                className="w-full"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                    Creating playlists…
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 shrink-0" />
                    Create Artist Focus playlists on Spotify
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={handleDeleteArtistFocusPlaylists}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 shrink-0" />
                    Delete all playlists starting with &quot;Artist Focus:&quot; (temporary)
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {created && created.length > 0 && (
          <div className="flex flex-col gap-3 py-2">
            <div className="flex items-center gap-2 text-sm text-primary">
              <Check className="h-5 w-5 shrink-0" />
              <span className="font-medium">
                {created.length} playlist{created.length !== 1 ? "s" : ""} created
              </span>
            </div>
            <ul className="space-y-2 overflow-y-auto max-h-48">
              {created.map((item) => (
                <li key={item.playlistId}>
                  <a
                    href={`https://open.spotify.com/playlist/${item.playlistId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2 text-left text-sm hover:bg-secondary/50 transition-colors"
                  >
                    <span className="font-medium truncate">{item.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {item.trackCount} track{item.trackCount !== 1 ? "s" : ""}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">
              Open in Spotify to listen. You can close this and run again to create more playlists.
            </p>
            <Button
              variant="outline"
              className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleDeleteArtistFocusPlaylists}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                  Deleting…
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 shrink-0" />
                  Delete all playlists starting with &quot;Artist Focus:&quot; (temporary)
                </>
              )}
            </Button>
          </div>
        )}

        {!loading && !displayError && buckets && totalTracks === 0 && !created && (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-muted-foreground">
            <Music className="h-10 w-10 opacity-50" />
            <p className="text-sm">No liked songs to organize.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

