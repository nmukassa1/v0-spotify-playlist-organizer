"use client"

import type { SuggestedPlaylist, Song } from "@/lib/mock-data"
import { PlaylistDetailHeader } from "./playlist-detail-header"
import { PlaylistDetailSongRow } from "./playlist-detail-song-row"
import { RemovedSongsSection } from "./removed-songs-section"

interface PlaylistDetailProps {
  playlist: SuggestedPlaylist
  songs: Song[]
  isAccepted: boolean
  removedSongs: Set<string>
  onAccept: () => void
  onBack: () => void
  onRemoveSong: (songId: string) => void
  onRestoreSong: (songId: string) => void
}

export function PlaylistDetail({
  playlist,
  songs,
  isAccepted,
  removedSongs,
  onAccept,
  onBack,
  onRemoveSong,
  onRestoreSong,
}: PlaylistDetailProps) {
  const playlistSongs = playlist.songs
    .map((id) => songs.find((s) => s.id === id))
    .filter(Boolean) as Song[]

  const activeSongs = playlistSongs.filter((s) => !removedSongs.has(s.id))
  const removed = playlistSongs.filter((s) => removedSongs.has(s.id))

  const totalDuration = (() => {
    const total = activeSongs.reduce((a, s) => a + s.durationSeconds, 0)
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  })()

  return (
    <div className="flex flex-col h-full">
      <PlaylistDetailHeader
        playlist={playlist}
        activeSongCount={activeSongs.length}
        totalDuration={totalDuration}
        isAccepted={isAccepted}
        onBack={onBack}
        onAccept={onAccept}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-border/50">
          {activeSongs.map((song, index) => (
            <PlaylistDetailSongRow
              key={song.id}
              song={song}
              index={index}
              onRemove={() => onRemoveSong(song.id)}
            />
          ))}
        </div>

        <RemovedSongsSection songs={removed} onRestore={onRestoreSong} />
      </div>
    </div>
  )
}
