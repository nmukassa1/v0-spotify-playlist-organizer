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
}

export function SongList({ songs, selectedSongs, onToggleSong, onSelectAll, onDeselectAll }: SongListProps) {
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
