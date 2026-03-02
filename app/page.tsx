"use client"

import { useState, useCallback } from "react"
import { songs, suggestedPlaylists } from "@/lib/mock-data"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileHeader } from "@/components/mobile-header"
import { DashboardView } from "@/components/dashboard-view"
import { SongList } from "@/components/song-list"
import { PlaylistSuggestions } from "@/components/playlist-suggestions"
import { PlaylistDetail } from "@/components/playlist-detail"
import { MyPlaylistsView } from "@/components/my-playlists-view"

export default function Home() {
  const [activeView, setActiveView] = useState("dashboard")
  const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set())
  const [acceptedPlaylists, setAcceptedPlaylists] = useState<Set<string>>(new Set())
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null)
  const [removedSongs, setRemovedSongs] = useState<Map<string, Set<string>>>(new Map())

  const handleToggleSong = useCallback((songId: string) => {
    setSelectedSongs((prev) => {
      const next = new Set(prev)
      if (next.has(songId)) {
        next.delete(songId)
      } else {
        next.add(songId)
      }
      return next
    })
  }, [])

  const handleSelectAll = useCallback(() => {
    setSelectedSongs(new Set(songs.map((s) => s.id)))
  }, [])

  const handleDeselectAll = useCallback(() => {
    setSelectedSongs(new Set())
  }, [])

  const handleAcceptPlaylist = useCallback((playlistId: string) => {
    setAcceptedPlaylists((prev) => {
      const next = new Set(prev)
      if (next.has(playlistId)) {
        next.delete(playlistId)
      } else {
        next.add(playlistId)
      }
      return next
    })
  }, [])

  const handleViewPlaylist = useCallback((playlistId: string) => {
    setActivePlaylistId(playlistId)
    setActiveView("playlist-detail")
  }, [])

  const handleRemoveSong = useCallback((songId: string) => {
    if (!activePlaylistId) return
    setRemovedSongs((prev) => {
      const next = new Map(prev)
      const playlistRemoved = new Set(next.get(activePlaylistId) || [])
      playlistRemoved.add(songId)
      next.set(activePlaylistId, playlistRemoved)
      return next
    })
  }, [activePlaylistId])

  const handleRestoreSong = useCallback((songId: string) => {
    if (!activePlaylistId) return
    setRemovedSongs((prev) => {
      const next = new Map(prev)
      const playlistRemoved = new Set(next.get(activePlaylistId) || [])
      playlistRemoved.delete(songId)
      next.set(activePlaylistId, playlistRemoved)
      return next
    })
  }, [activePlaylistId])

  const activePlaylist = activePlaylistId
    ? suggestedPlaylists.find((p) => p.id === activePlaylistId)
    : null

  const renderContent = () => {
    if (activeView === "playlist-detail" && activePlaylist) {
      return (
        <PlaylistDetail
          playlist={activePlaylist}
          songs={songs}
          isAccepted={acceptedPlaylists.has(activePlaylist.id)}
          removedSongs={removedSongs.get(activePlaylist.id) || new Set()}
          onAccept={() => handleAcceptPlaylist(activePlaylist.id)}
          onBack={() => setActiveView("suggestions")}
          onRemoveSong={handleRemoveSong}
          onRestoreSong={handleRestoreSong}
        />
      )
    }

    switch (activeView) {
      case "dashboard":
        return (
          <DashboardView
            songs={songs}
            playlists={suggestedPlaylists}
            acceptedPlaylists={acceptedPlaylists}
            onNavigate={setActiveView}
          />
        )
      case "library":
        return (
          <SongList
            songs={songs}
            selectedSongs={selectedSongs}
            onToggleSong={handleToggleSong}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
          />
        )
      case "suggestions":
        return (
          <PlaylistSuggestions
            playlists={suggestedPlaylists}
            songs={songs}
            acceptedPlaylists={acceptedPlaylists}
            onAcceptPlaylist={handleAcceptPlaylist}
            onViewPlaylist={handleViewPlaylist}
          />
        )
      case "playlists":
        return (
          <MyPlaylistsView
            playlists={suggestedPlaylists}
            songs={songs}
            acceptedPlaylists={acceptedPlaylists}
            onNavigate={setActiveView}
            onViewPlaylist={handleViewPlaylist}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-dvh flex-col bg-background">
      <MobileHeader activeView={activeView} onViewChange={setActiveView} />
      <div className="flex flex-1 overflow-scroll">
        <AppSidebar
          activeView={activeView}
          onViewChange={setActiveView}
          unsortedCount={songs.length}
          playlistCount={acceptedPlaylists.size}
        />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
