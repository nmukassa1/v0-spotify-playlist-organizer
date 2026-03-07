"use client"

import { useState } from "react"
import type { Song } from "@/lib/mock-data"
import { SongSearchBar, type SortOption } from "./song-search-bar"
import { SongSelectionBar } from "./song-selection-bar"
import { SongListItem } from "./song-list-item"

interface SongListProps {
  songs: Song[]
  selectedSongs: Set<string>
  onToggleSong: (songId: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
  /** When true, shows loading state instead of the list */
  isLoading?: boolean
  /** Optional error message to display */
  error?: string | null
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
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("recent")

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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center text-muted-foreground">
        <p className="text-sm">{error}</p>
      </div>
    )
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
          <p className="text-sm text-muted-foreground">Loading your liked songs...</p>
        </div>
      </div>
    )
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
          <p className="text-sm">No liked songs yet. Connect Spotify and add some.</p>
        </div>
      </div>
    )
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
    </div>
  )
}
