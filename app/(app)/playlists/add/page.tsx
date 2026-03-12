"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useSpotifyPlaylists } from "@/hooks/use-spotify";
import { useAppState } from "@/contexts/app-state-context";
import { SpotifyPlaylistCard } from "@/components/my-playlists/spotify-playlist-card";
import { Button } from "@/components/ui/button";

export default function AddToPlaylistsPage() {
  const router = useRouter();
  const { selectedSongs } = useAppState();
  const { playlists, isLoading, error } = useSpotifyPlaylists(50, 0);

  const [selectedPlaylistIds, setSelectedPlaylistIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [isAdding, setIsAdding] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const selectedSongUris = useMemo(
    () =>
      Array.from(selectedSongs).map((id) =>
        id.startsWith("spotify:track:") ? id : `spotify:track:${id}`,
      ),
    [selectedSongs],
  );

  function togglePlaylist(id: string) {
    setSelectedPlaylistIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleAdd() {
    if (selectedPlaylistIds.size === 0 || selectedSongUris.length === 0) return;
    try {
      setIsAdding(true);
      setActionMessage(null);
      const res = await fetch("/api/spotify/playlists/add-tracks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playlistIds: Array.from(selectedPlaylistIds),
          uris: selectedSongUris,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setActionMessage(data.error || "Failed to add songs to playlists");
        return;
      }
      setActionMessage("Added songs to selected playlists.");
      router.push("/playlists");
    } catch {
      setActionMessage("Failed to add songs to playlists");
    } finally {
      setIsAdding(false);
    }
  }

  const selectedCount = selectedSongs.size;

  return (
    <div className="flex flex-col h-full p-4 sm:p-6 gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push("/library")}
            className="shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to library
          </Button>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-foreground">
              Add selected songs to playlists
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {selectedCount > 0
                ? `${selectedCount} song${selectedCount !== 1 ? "s" : ""} selected`
                : "No songs selected. Go back to your library and select songs first."}
            </p>
          </div>
        </div>
        <Button
          type="button"
          onClick={handleAdd}
          disabled={
            isAdding ||
            selectedPlaylistIds.size === 0 ||
            selectedSongUris.length === 0
          }
          size="sm"
        >
          {isAdding ? "Adding…" : "Add to selected playlists"}
        </Button>
      </div>

      {selectedSongUris.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            You don&apos;t have any songs selected. Go back to your library, pick
            some songs, then click &quot;Add To Playlist&quot;.
          </p>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            {error}
          </p>
        </div>
      ) : isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Loading your playlists…
          </p>
        </div>
      ) : playlists.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            You have no playlists yet. Create one first from the Playlists page, then
            come back here.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {playlists.map((pl) => (
              <SpotifyPlaylistCard
                key={pl.id}
                playlist={pl}
                selectionMode={{
                  selected: selectedPlaylistIds.has(pl.id),
                  onToggle: () => togglePlaylist(pl.id),
                }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between gap-4 pt-2 border-t border-border/60">
            <p className="text-xs text-muted-foreground">
              {selectedPlaylistIds.size > 0
                ? `${selectedPlaylistIds.size} playlist${
                    selectedPlaylistIds.size !== 1 ? "s" : ""
                  } selected`
                : "Select one or more playlists to add your songs to."}
            </p>
          </div>
        </>
      )}

      {actionMessage && (
        <p className="text-xs text-muted-foreground text-right">{actionMessage}</p>
      )}
    </div>
  );
}

