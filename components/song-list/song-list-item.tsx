"use client"

import { Check, Grip } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Song } from "@/lib/mock-data"
import { SongCover } from "@/components/song/song-cover"

interface SongListItemProps {
  song: Song
  index: number
  isSelected: boolean
  onToggle: () => void
}

export function SongListItem({ song, index, isSelected, onToggle }: SongListItemProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors group",
        isSelected ? "bg-primary/5" : "hover:bg-secondary/50"
      )}
      aria-label={`${isSelected ? "Deselect" : "Select"} ${song.title} by ${song.artist}`}
    >
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

      <SongCover
        colorClass={song.coverColor}
        imageUrl={song.imageUrl}
        size="lg"
        className="rounded-md"
      />

      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-sm font-medium", isSelected ? "text-primary" : "text-foreground")}>
          {song.title}
          {song.featuredArtists.length > 0 && (
            <span className="text-muted-foreground font-normal"> ft. {song.featuredArtists.join(", ")}</span>
          )}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {song.artist} &middot; {song.album}
        </p>
      </div>

      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground">
          {song.releaseYear}
        </span>
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[9px] font-medium",
            song.popularity >= 90 && "bg-chart-1/15 text-chart-1",
            song.popularity >= 70 && song.popularity < 90 && "bg-chart-3/15 text-chart-3",
            song.popularity < 70 && "bg-chart-2/15 text-chart-2"
          )}
        >
          pop {song.popularity}
        </span>
        <span className="text-[10px] font-mono text-muted-foreground/60">{song.duration}</span>
      </div>

      <Grip className="h-4 w-4 shrink-0 text-muted-foreground/30 group-hover:text-muted-foreground/60" />
    </button>
  )
}
