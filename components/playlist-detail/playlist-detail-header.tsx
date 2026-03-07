"use client"

import { ArrowLeft, Check, Plus, Music, Play, Shuffle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SuggestedPlaylist } from "@/lib/mock-data"
import { categoryLabels } from "@/lib/mock-data"

interface PlaylistDetailHeaderProps {
  playlist: SuggestedPlaylist
  activeSongCount: number
  totalDuration: string
  isAccepted: boolean
  onBack: () => void
  onAccept: () => void
}

export function PlaylistDetailHeader({
  playlist,
  activeSongCount,
  totalDuration,
  isAccepted,
  onBack,
  onAccept,
}: PlaylistDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border p-4 sm:p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors self-start"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to suggestions
      </button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-4">
          <div className={cn("flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br", playlist.color)}>
            <Music className="h-7 w-7 sm:h-8 sm:w-8 text-foreground" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              {categoryLabels[playlist.category]}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">{playlist.name}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{playlist.description}</p>
            <p className="text-xs font-mono text-muted-foreground/60 mt-1">
              {activeSongCount} tracks &middot; {totalDuration}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2.5 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors">
            <Shuffle className="h-3.5 w-3.5" />
            Shuffle
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2.5 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors">
            <Play className="h-3.5 w-3.5" />
            Preview All
          </button>
          <button
            onClick={onAccept}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors",
              isAccepted
                ? "bg-primary/10 text-primary"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {isAccepted ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Accepted
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                Accept Playlist
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
