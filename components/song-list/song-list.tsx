"use client";

import { useEffect, useMemo, useState } from "react";
import type { Song } from "@/lib/mock-data";
import type { SpotifyPlaylistItem } from "@/lib/spotify-types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SongSearchBar, type SortOption } from "./song-search-bar";
import { SongSelectionBar } from "./song-selection-bar";
import { SongListItem } from "./song-list-item";
import { SpotifyPlaylistCard } from "@/components/my-playlists/spotify-playlist-card";

interface SongListProps {
  songs: Song[];
  selectedSongs: Set<string>;
  onToggleSong: (songId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  /** When true, shows loading state instead of the list */
  isLoading?: boolean;
  /** Optional error message to display */
  error?: string | null;
}

export function SongList({
  songs,
  selectedSongs,
  onToggleSong,
  onSelectAll,
  onDeselectAll,
  isLoading,
  error,
}: SongListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [playlists, setPlaylists] = useState<SpotifyPlaylistItem[] | null>(
    null,
  );
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);
  const [playlistError, setPlaylistError] = useState<string | null>(null);
  const [selectedPlaylistIds, setSelectedPlaylistIds] = useState<Set<string>>(
    new Set(),
  );
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const filteredSongs = songs
    .filter(
      (song) =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.album.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.featuredArtists.some((fa) =>
          fa.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    )
    .sort((a, b) => {
      if (sortBy === "artist") return a.artist.localeCompare(b.artist);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "year") return b.releaseYear - a.releaseYear;
      if (sortBy === "popularity") return b.popularity - a.popularity;
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    });

  const allSelected =
    filteredSongs.length > 0 &&
    filteredSongs.every((s) => selectedSongs.has(s.id));

  const selectedSongUris = useMemo(() => {
    if (selectedSongs.size === 0) return [];
    const ids = songs.filter((s) => selectedSongs.has(s.id)).map((s) => s.id);
    return ids.map((id) => `spotify:track:${id}`);
  }, [songs, selectedSongs]);

  useEffect(() => {
    if (!isAddDialogOpen) return;
    let cancelled = false;
    async function loadPlaylists() {
      try {
        setIsLoadingPlaylists(true);
        setPlaylistError(null);
        const res = await fetch("/api/spotify/playlists");
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          if (!cancelled) {
            console.error("Failed to load playlists", res.status, data);
            setPlaylistError(data.error || "Failed to load playlists");
            setPlaylists([]);
          }
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          console.log("Loaded playlists", data);
          setPlaylists(Array.isArray(data.items) ? data.items : []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error loading playlists", err);
          setPlaylistError("Failed to load playlists");
          setPlaylists([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingPlaylists(false);
        }
      }
    }
    loadPlaylists();
    return () => {
      cancelled = true;
    };
  }, [isAddDialogOpen]);

  function handleTogglePlaylist(id: string) {
    setSelectedPlaylistIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleConfirmAddToPlaylists() {
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
      setIsAddDialogOpen(false);
      setSelectedPlaylistIds(new Set());
    } catch {
      setActionMessage("Failed to add songs to playlists");
    } finally {
      setIsAdding(false);
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center text-muted-foreground">
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <SongSearchBar
          searchQuery=""
          onSearchChange={() => {}}
          sortBy="recent"
          onSortChange={() => {}}
        />
        <div className="flex flex-1 items-center justify-center p-8">
          <p className="text-sm text-muted-foreground">
            Loading your liked songs...
          </p>
        </div>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <SongSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        <div className="flex flex-1 items-center justify-center p-8 text-center text-muted-foreground">
          <p className="text-sm">
            No liked songs yet. Connect Spotify and add some.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <SongSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <SongSelectionBar
        allSelected={allSelected}
        selectedCount={selectedSongs.size}
        onSelectAll={onSelectAll}
        onDeselectAll={onDeselectAll}
        onAddToPlaylist={() => setIsAddDialogOpen(true)}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-border/50">
          {filteredSongs.map((song, index) => (
            <SongListItem
              key={song.id}
              song={song}
              index={index}
              isSelected={selectedSongs.has(song.id)}
              onToggle={() => onToggleSong(song.id)}
            />
          ))}
        </div>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add selected songs to playlists</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-72 overflow-y-auto mt-2">
            {isLoadingPlaylists && (
              <p className="text-xs text-muted-foreground">
                Loading your playlists…
              </p>
            )}
            {playlistError && (
              <p className="text-xs text-red-500">{playlistError}</p>
            )}
            {!isLoadingPlaylists &&
              !playlistError &&
              playlists &&
              playlists.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  You have no playlists yet. Create one in Spotify first.
                </p>
              )}
            {!isLoadingPlaylists &&
              !playlistError &&
              playlists &&
              playlists.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2 max-h-72 overflow-y-auto pr-1">
                  {playlists.map((pl) => (
                    <SpotifyPlaylistCard
                      key={pl.id}
                      playlist={pl}
                      selectionMode={{
                        selected: selectedPlaylistIds.has(pl.id),
                        onToggle: () => handleTogglePlaylist(pl.id),
                      }}
                    />
                  ))}
                </div>
              )}
          </div>
          {actionMessage && (
            <p className="mt-2 text-xs text-muted-foreground">
              {actionMessage}
            </p>
          )}
          <DialogFooter className="mt-4">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-input bg-background px-3 py-1 text-xs font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
              onClick={() => setIsAddDialogOpen(false)}
              disabled={isAdding}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmAddToPlaylists}
              disabled={
                isAdding ||
                selectedPlaylistIds.size === 0 ||
                selectedSongUris.length === 0
              }
              className="inline-flex items-center rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? "Adding…" : "Add to selected playlists"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
