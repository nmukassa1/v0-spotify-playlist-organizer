"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Song } from "@/lib/mock-data"
import { Search, Music, Check, Grip } from "lucide-react"

interface SongListProps {
  songs: Song[]
  selectedSongs: Set<string>
  onToggleSong: (songId: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
}

export function SongList({ songs, selectedSongs, onToggleSong, onSelectAll, onDeselectAll }: SongListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"recent" | "artist" | "title" | "year" | "popularity">("recent")

  const filteredSongs = songs
    .filter(
      (song) =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.album.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.featuredArtists.some((fa) => fa.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "artist") return a.artist.localeCompare(b.artist)
      if (sortBy === "title") return a.title.localeCompare(b.title)
      if (sortBy === "year") return b.releaseYear - a.releaseYear
      if (sortBy === "popularity") return b.popularity - a.popularity
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    })

  const allSelected = filteredSongs.length > 0 && filteredSongs.every((s) => selectedSongs.has(s.id))

  return (
    <div className="flex flex-col h-full">
      {/* Search & filters */}
      <div className="flex flex-col gap-3 px-4 py-4 border-b border-white/20 sm:flex-row sm:items-center glass-subtle mx-4 mt-4 rounded-3xl">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
          <input
            type="text"
            placeholder="Search by title, artist, or album..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl bg-white/50 pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/70 transition-all"
            aria-label="Search songs"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(["recent", "title", "artist", "year", "popularity"] as const).map((sort) => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-medium transition-all capitalize",
                sortBy === sort
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "bg-white/50 text-foreground/70 hover:bg-white/70 hover:text-foreground"
              )}
            >
              {sort}
            </button>
          ))}
        </div>
      </div>

      {/* Selection bar */}
      <div className="flex items-center justify-between px-6 py-3 mx-4 mt-2">
        <button
          onClick={allSelected ? onDeselectAll : onSelectAll}
          className="flex items-center gap-2 text-xs text-foreground/60 hover:text-foreground transition-colors"
        >
          <div
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-lg border-2 transition-all",
              allSelected ? "bg-primary border-primary" : "border-foreground/30 hover:border-foreground/50"
            )}
          >
            {allSelected && <Check className="h-3 w-3 text-white" />}
          </div>
          {allSelected ? "Deselect all" : "Select all"}
        </button>
        {selectedSongs.size > 0 && (
          <span className="text-xs font-semibold rounded-full bg-primary/15 text-primary px-3 py-1">{selectedSongs.size} selected</span>
        )}
      </div>

      {/* Song list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="flex flex-col gap-2">
          {filteredSongs.map((song, index) => {
            const isSelected = selectedSongs.has(song.id)
            return (
              <button
                key={song.id}
                onClick={() => onToggleSong(song.id)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 text-left transition-all rounded-2xl group",
                  isSelected ? "glass-strong shadow-lg" : "hover:bg-white/40"
                )}
                aria-label={`${isSelected ? "Deselect" : "Select"} ${song.title} by ${song.artist}`}
              >
                {/* Selection indicator */}
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all",
                    isSelected ? "bg-primary border-primary" : "border-foreground/20 group-hover:border-foreground/40"
                  )}
                >
                  {isSelected ? (
                    <Check className="h-3.5 w-3.5 text-white" />
                  ) : (
                    <span className="text-[10px] font-mono text-foreground/50">{index + 1}</span>
                  )}
                </div>

                {/* Album art placeholder */}
                <div className={cn("h-12 w-12 shrink-0 rounded-xl flex items-center justify-center", song.coverColor)}>
                  <Music className="h-5 w-5 text-foreground/80" />
                </div>

                {/* Song info */}
                <div className="min-w-0 flex-1">
                  <p className={cn("truncate text-sm font-semibold", isSelected ? "text-primary" : "text-foreground")}>
                    {song.title}
                    {song.featuredArtists.length > 0 && (
                      <span className="text-foreground/50 font-normal"> ft. {song.featuredArtists.join(", ")}</span>
                    )}
                  </p>
                  <p className="truncate text-xs text-foreground/60">
                    {song.artist} &middot; {song.album}
                  </p>
                </div>

                {/* Meta */}
                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  <span className="rounded-full bg-white/50 px-2 py-1 text-[9px] font-mono text-foreground/70">
                    {song.releaseYear}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-1 text-[9px] font-semibold",
                      song.popularity >= 90 && "bg-primary/15 text-primary",
                      song.popularity >= 70 && song.popularity < 90 && "bg-amber-500/15 text-amber-600",
                      song.popularity < 70 && "bg-blue-500/15 text-blue-600"
                    )}
                  >
                    {song.popularity}
                  </span>
                  <span className="text-[10px] font-mono text-foreground/50">{song.duration}</span>
                </div>

                <Grip className="h-4 w-4 shrink-0 text-foreground/20 group-hover:text-foreground/40" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
