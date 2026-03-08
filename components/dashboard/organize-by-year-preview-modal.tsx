"use client";

import { useEffect, useState } from "react";
import { Calendar, Check, ChevronRight, Loader2, Music, Trash2 } from "lucide-react";
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
import { fetchAllLikedSongs, groupLikedSongsByDecade } from "@/lib/liked-songs";
import type { SpotifySavedTrack } from "@/lib/spotify-types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface OrganizeByYearPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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

export function OrganizeByYearPreviewModal({
  open,
  onOpenChange,
}: OrganizeByYearPreviewModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [created, setCreated] = useState<
    { year: string; playlistId: string; name: string; trackCount: number }[] | null
  >(null);
  const [byYear, setByYear] = useState<
    { year: string; tracks: SpotifySavedTrack[] }[] | null
  >(null);

  useEffect(() => {
    if (!open) return;
    setByYear(null);
    setError(null);
    setCreated(null);
    setLoading(true);
    fetchAllLikedSongs()
      .then((tracks) => {
        setByYear(groupLikedSongsByDecade(tracks));
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load songs");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [open]);

  const totalTracks = byYear?.reduce((n, g) => n + g.tracks.length, 0) ?? 0;

  async function handleCreatePlaylists() {
    if (!byYear || byYear.length === 0) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/spotify/organize-by-year", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playlists: byYear.map(({ year, tracks }) => ({
            year,
            trackIds: tracks.map((s) => s.track.id),
          })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data.error as string) || res.statusText || "Failed to create playlists");
        return;
      }
      setCreated(data.created ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create playlists");
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteReleasedPlaylists() {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch("/api/spotify/delete-released-playlists", {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data.error as string) || res.statusText || "Failed to delete playlists");
        return;
      }
      setError(null);
      const count = (data.deleted as number) ?? 0;
      if (count > 0) {
        setCreated(null);
        setByYear(null);
        setLoading(true);
        fetchAllLikedSongs()
          .then((tracks) => setByYear(groupLikedSongsByDecade(tracks)))
          .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
          .finally(() => setLoading(false));
      }
      alert(`Deleted ${count} playlist${count !== 1 ? "s" : ""} starting with "Released".`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete playlists");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Playlists by decade
          </DialogTitle>
          <DialogDescription>
            Preview how your liked songs will be grouped by 10-year release range. Click a range to see its tracks.
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

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && byYear && !created && (
          <div className="flex flex-col gap-1 overflow-hidden">
            <p className="text-xs text-muted-foreground pb-2">
              {byYear.length} playlist{byYear.length !== 1 ? "s" : ""} ·{" "}
              {totalTracks} track{totalTracks !== 1 ? "s" : ""}
            </p>
            <div className="overflow-y-auto flex-1 min-h-0 space-y-1 pr-1">
              {byYear.map(({ year, tracks }) => (
                <Collapsible key={year} defaultOpen={false}>
                  <CollapsibleTrigger
                    className={cn(
                      "group flex w-full items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-left",
                      "hover:bg-secondary/50 transition-colors",
                    )}
                  >
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-data-[state=open]:rotate-90 transition-transform" />
                    <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="font-semibold text-foreground">
                      Released: {year}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {tracks.length} song{tracks.length !== 1 ? "s" : ""}
                    </span>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-1 ml-2 pl-4 border-l border-border space-y-0.5 py-2">
                      {tracks.length === 0 ? (
                        <p className="text-xs text-muted-foreground px-2">
                          No tracks
                        </p>
                      ) : (
                        tracks.map((saved) => (
                          <TrackRow key={saved.track.id} saved={saved} />
                        ))
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
            {!created && (
              <div className="pt-3 border-t border-border space-y-2">
                <Button
                  onClick={handleCreatePlaylists}
                  disabled={creating || byYear.length === 0}
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
                      Create playlists on Spotify
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={handleDeleteReleasedPlaylists}
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                      Deleting…
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 shrink-0" />
                      Delete all playlists starting with &quot;Released&quot; (temporary)
                    </>
                  )}
                </Button>
              </div>
            )}
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
              {created.map(({ year, name, playlistId, trackCount }) => (
                <li key={playlistId}>
                  <a
                    href={`https://open.spotify.com/playlist/${playlistId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2 text-left text-sm hover:bg-secondary/50 transition-colors"
                  >
                    <span className="font-medium truncate">{name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {trackCount} track{trackCount !== 1 ? "s" : ""}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">
              Open in Spotify to listen. You can close this and run again to create
              more playlists.
            </p>
            <Button
              variant="outline"
              className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive mt-2"
              onClick={handleDeleteReleasedPlaylists}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 shrink-0" />
                  Delete all playlists starting with &quot;Released&quot; (temporary)
                </>
              )}
            </Button>
          </div>
        )}

        {!loading && !error && byYear && byYear.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-muted-foreground">
            <Music className="h-10 w-10 opacity-50" />
            <p className="text-sm">No liked songs to organize.</p>
            <Button
              variant="outline"
              className="mt-2 border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleDeleteReleasedPlaylists}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 shrink-0" />
                  Delete all &quot;Released&quot; playlists (temporary)
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
