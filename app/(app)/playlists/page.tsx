"use client"

import { useRouter } from "next/navigation"
import { songs, suggestedPlaylists } from "@/lib/mock-data"
import { useAppState } from "@/contexts/app-state-context"
import { MyPlaylistsView } from "@/components/my-playlists/my-playlists-view"

export default function PlaylistsPage() {
  const router = useRouter()
  const { acceptedPlaylists } = useAppState()
  return (
    <MyPlaylistsView
      playlists={suggestedPlaylists}
      songs={songs}
      acceptedPlaylists={acceptedPlaylists}
      onViewPlaylist={(id) => router.push(`/playlists/${id}`)}
      onViewSuggestions={() => router.push("/suggestions")}
    />
  )
}
