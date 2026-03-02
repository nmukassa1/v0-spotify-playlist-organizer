"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Song } from "@/lib/mock-data"
import { Search, Clock, Music, Check, Grip } from "lucide-react"

interface SongListProps {
  songs: Song[]
  selectedSongs: Set<string>
  onToggleSong: (songId: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
}

export function SongList({ songs, selectedSongs, onToggleSong, onSelectAll, onDeselectAll }: SongListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"recent" | "artist" | "title">("recent")

  const filteredSongs = songs
    .filter(
      (song) =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.album.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "artist") return a.artist.localeCompare(b.artist)
      if (sortBy === "title") return a.title.localeCompare(b.title)
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    })

  const allSelected = filteredSongs.length > 0 && filteredSongs.every((s) => selectedSongs.has(s.id))

  return (
    <div className="flex flex-col h-full">
      {/* Search & filters */}
      <div className="flex flex-col gap-3 px-4 py-3 border-b border-border sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search your songs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg bg-secondary pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Search songs"
          />
        </div>
        <div className="flex items-center gap-2">
          {(["recent", "title", "artist"] as const).map((sort) => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors capitalize",
                sortBy === sort
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {sort}
            </button>
          ))}
        </div>
      </div>

      {/* Selection bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/30">
        <button
          onClick={allSelected ? onDeselectAll : onSelectAll}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <div
            className={cn(
              "flex h-4 w-4 items-center justify-center rounded border transition-colors",
              allSelected ? "bg-primary border-primary" : "border-muted-foreground"
            )}
          >
            {allSelected && <Check className="h-3 w-3 text-primary-foreground" />}
          </div>
          {allSelected ? "Deselect all" : "Select all"}
        </button>
        {selectedSongs.size > 0 && (
          <span className="text-xs font-mono text-primary">{selectedSongs.size} selected</span>
        )}
      </div>

      {/* Song list */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-border/50">
          {filteredSongs.map((song, index) => {
            const isSelected = selectedSongs.has(song.id)
            return (
              <button
                key={song.id}
                onClick={() => onToggleSong(song.id)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors group",
                  isSelected ? "bg-primary/5" : "hover:bg-secondary/50"
                )}
                aria-label={`${isSelected ? "Deselect" : "Select"} ${song.title} by ${song.artist}`}
              >
                {/* Selection indicator */}
                <div
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all",
                    isSelected ? "bg-primary border-primary" : "border-muted-foreground/40 group-hover:border-muted-foreground"
                  )}
                >
                  {isSelected ? (
                    <Check className="h-3 w-3 text-primary-foreground" />
                  ) : (
                    <span className="text-[10px] font-mono text-muted-foreground">{index + 1}</span>
                  )}
                </div>

                {/* Album art placeholder */}
                <div className={cn("h-10 w-10 shrink-0 rounded-md flex items-center justify-center", song.coverColor)}>
                  <Music className="h-4 w-4 text-foreground/80" />
                </div>

                {/* Song info */}
                <div className="min-w-0 flex-1">
                  <p className={cn("truncate text-sm font-medium", isSelected ? "text-primary" : "text-foreground")}>
                    {song.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {song.artist} &middot; {song.album}
                  </p>
                </div>

                {/* Meta */}
                <div className="hidden sm:flex flex-col items-end gap-0.5 shrink-0">
                  <span className="text-[10px] font-mono text-muted-foreground/60">{song.duration}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[9px] font-medium",
                      song.energy === "high" && "bg-chart-1/15 text-chart-1",
                      song.energy === "medium" && "bg-chart-3/15 text-chart-3",
                      song.energy === "low" && "bg-chart-2/15 text-chart-2"
                    )}
                  >
                    {song.energy}
                  </span>
                </div>

                <Grip className="h-4 w-4 shrink-0 text-muted-foreground/30 group-hover:text-muted-foreground/60" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
