"use client"

import { useParams, useRouter } from "next/navigation"
import { songs, suggestedPlaylists } from "@/lib/mock-data"
import { useAppState } from "@/contexts/app-state-context"
import { PlaylistDetail } from "@/components/playlist-detail/playlist-detail"

export default function PlaylistDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = typeof params.id === "string" ? params.id : params.id?.[0] ?? null
  const {
    acceptedPlaylists,
    removedSongs,
    handleAcceptPlaylist,
    handleRemoveSong,
    handleRestoreSong,
  } = useAppState()

  const playlist = id ? suggestedPlaylists.find((p) => p.id === id) : null

  if (!id || !playlist) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-muted-foreground">
        <p>Playlist not found.</p>
      </div>
    )
  }

  return (
    <PlaylistDetail
      playlist={playlist}
      songs={songs}
      isAccepted={acceptedPlaylists.has(playlist.id)}
      removedSongs={removedSongs.get(playlist.id) || new Set()}
      onAccept={() => handleAcceptPlaylist(playlist.id)}
      onBack={() => router.push("/suggestions")}
      onRemoveSong={(songId) => handleRemoveSong(playlist.id, songId)}
      onRestoreSong={(songId) => handleRestoreSong(playlist.id, songId)}
    />
  )
}
