"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface SongSelectionBarProps {
  allSelected: boolean
  selectedCount: number
  onSelectAll: () => void
  onDeselectAll: () => void
  onAddToPlaylist?: () => void
}

export function SongSelectionBar({
  allSelected,
  selectedCount,
  onSelectAll,
  onDeselectAll,
  onAddToPlaylist,
}: SongSelectionBarProps) {
  return (
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
      <div className="flex items-center gap-3">
        {selectedCount > 0 && (
          <span className="text-xs font-mono text-primary">{selectedCount} selected</span>
        )}
        <button
          type="button"
          onClick={onAddToPlaylist}
          disabled={!onAddToPlaylist || selectedCount === 0}
          className="inline-flex items-center rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add To Playlist
        </button>
      </div>
    </div>
  )
}
