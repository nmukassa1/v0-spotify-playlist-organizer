"use client"

import { Music } from "lucide-react"
import type { Song } from "@/lib/mock-data"

interface RemovedSongsSectionProps {
  songs: Song[]
  onRestore: (songId: string) => void
}

export function RemovedSongsSection({ songs, onRestore }: RemovedSongsSectionProps) {
  if (songs.length === 0) return null

  return (
    <div className="border-t border-border px-4 sm:px-6 py-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Removed ({songs.length})
      </p>
      <div className="flex flex-col gap-1">
        {songs.map((song) => (
          <div key={song.id} className="flex items-center gap-3 rounded-lg px-2 py-2 opacity-50">
            <div className="h-8 w-8 shrink-0 rounded flex items-center justify-center bg-secondary">
              <Music className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground line-through truncate">{song.title}</p>
              <p className="text-xs text-muted-foreground/50 truncate">{song.artist}</p>
            </div>
            <button onClick={() => onRestore(song.id)} className="text-xs text-primary hover:underline">
              Restore
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
