"use client";

import { useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { SpotifyPlaylistWithTracks } from "@/hooks/use-spotify";
import type { SpotifySavedTrack } from "@/lib/spotify-types";
import type { Song } from "@/lib/mock-data";
import { mapSpotifySavedTrackToSong } from "@/lib/spotify-mappers";
import { SongListItem } from "@/components/song-list/song-list-item";

interface SpotifyPlaylistDetailProps {
  playlist: SpotifyPlaylistWithTracks;
  onBack: () => void;
}

function formatTotalDuration(
  tracks: SpotifyPlaylistWithTracks["tracks"],
): string {
  const totalMs = tracks.reduce((sum, { track }) => sum + track.duration_ms, 0);
  const m = Math.floor(totalMs / 60000);
  const s = Math.floor((totalMs % 60000) / 1000);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function mapPlaylistTrackToSong(
  item: SpotifyPlaylistWithTracks["tracks"][number],
): Song {
  const saved: SpotifySavedTrack = {
    added_at: item.added_at ?? "",
    track: item.track,
  } as SpotifySavedTrack;
  return mapSpotifySavedTrackToSong(saved);
}

export function SpotifyPlaylistDetail({
  playlist,
  onBack,
}: SpotifyPlaylistDetailProps) {
  const totalDuration = formatTotalDuration(playlist.tracks);
  const songs = playlist.tracks.map(mapPlaylistTrackToSong);
  const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set());

  console.log("Playlist", playlist);

  function handleToggleSong(songId: string) {
    setSelectedSongs((prev) => {
      const next = new Set(prev);
      if (next.has(songId)) next.delete(songId);
      else next.add(songId);
      return next;
    });
  }

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
          {songs.map((song, index) => (
            <SongListItem
              key={song.id}
              song={song}
              index={index}
              isSelected={selectedSongs.has(song.id)}
              onToggle={() => handleToggleSong(song.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
