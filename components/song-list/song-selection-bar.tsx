"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface SongSelectionBarProps {
  allSelected: boolean
  selectedCount: number
  onSelectAll: () => void
  onDeselectAll: () => void
}

export function SongSelectionBar({
  allSelected,
  selectedCount,
  onSelectAll,
  onDeselectAll,
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
      {selectedCount > 0 && (
        <span className="text-xs font-mono text-primary">{selectedCount} selected</span>
      )}
    </div>
  )
}
