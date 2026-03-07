"use client"

import Link from "next/link"
import { Music, Sparkles } from "lucide-react"

interface EmptyPlaylistsStateProps {
  onViewSuggestions?: () => void
}

export function EmptyPlaylistsState({ onViewSuggestions }: EmptyPlaylistsStateProps) {
  const content = (
    <>
      <Sparkles className="h-4 w-4" />
      View Suggestions
    </>
  )
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
        <Music className="h-7 w-7 text-muted-foreground" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">No playlists yet</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm leading-relaxed">
          Accept playlist suggestions to start building your organized library.
        </p>
      </div>
      {onViewSuggestions ? (
        <button
          onClick={onViewSuggestions}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {content}
        </button>
      ) : (
        <Link
          href="/suggestions"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {content}
        </Link>
      )}
    </div>
  )
}
