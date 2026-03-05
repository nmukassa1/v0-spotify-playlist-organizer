"use client"

import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

export type SortOption = "recent" | "artist" | "title" | "year" | "popularity"

const SORT_OPTIONS: SortOption[] = ["recent", "title", "artist", "year", "popularity"]

interface SongSearchBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
}

export function SongSearchBar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: SongSearchBarProps) {
  return (
    <div className="flex flex-col gap-3 px-4 py-3 border-b border-border sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by title, artist, or album..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg bg-secondary pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Search songs"
        />
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {SORT_OPTIONS.map((sort) => (
          <button
            key={sort}
            onClick={() => onSortChange(sort)}
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
  )
}
