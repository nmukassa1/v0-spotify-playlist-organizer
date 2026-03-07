"use client"

import { useRouter } from "next/navigation"
import { songs, suggestedPlaylists } from "@/lib/mock-data"
import { useAppState } from "@/contexts/app-state-context"
import { PlaylistSuggestions } from "@/components/playlist-suggestions/playlist-suggestions"

export default function SuggestionsPage() {
  const router = useRouter()
  const { acceptedPlaylists, handleAcceptPlaylist } = useAppState()
  return (
    <PlaylistSuggestions
      playlists={suggestedPlaylists}
      songs={songs}
      acceptedPlaylists={acceptedPlaylists}
      onAcceptPlaylist={handleAcceptPlaylist}
      onViewPlaylist={(id) => router.push(`/playlists/${id}`)}
    />
  )
}
