"use client"

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react"

type AppStateContextValue = {
  selectedSongs: Set<string>
  acceptedPlaylists: Set<string>
  removedSongs: Map<string, Set<string>>
  handleToggleSong: (songId: string) => void
  handleSelectAll: (songIds: string[]) => void
  handleDeselectAll: () => void
  handleAcceptPlaylist: (playlistId: string) => void
  handleRemoveSong: (playlistId: string, songId: string) => void
  handleRestoreSong: (playlistId: string, songId: string) => void
}

const AppStateContext = createContext<AppStateContextValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set())
  const [acceptedPlaylists, setAcceptedPlaylists] = useState<Set<string>>(new Set())
  const [removedSongs, setRemovedSongs] = useState<Map<string, Set<string>>>(new Map())

  const handleToggleSong = useCallback((songId: string) => {
    setSelectedSongs((prev) => {
      const next = new Set(prev)
      if (next.has(songId)) next.delete(songId)
      else next.add(songId)
      return next
    })
  }, [])

  const handleSelectAll = useCallback((songIds: string[]) => {
    setSelectedSongs(new Set(songIds))
  }, [])

  const handleDeselectAll = useCallback(() => {
    setSelectedSongs(new Set())
  }, [])

  const handleAcceptPlaylist = useCallback((playlistId: string) => {
    setAcceptedPlaylists((prev) => {
      const next = new Set(prev)
      if (next.has(playlistId)) next.delete(playlistId)
      else next.add(playlistId)
      return next
    })
  }, [])

  const handleRemoveSong = useCallback((playlistId: string, songId: string) => {
    setRemovedSongs((prev) => {
      const next = new Map(prev)
      const playlistRemoved = new Set(next.get(playlistId) || [])
      playlistRemoved.add(songId)
      next.set(playlistId, playlistRemoved)
      return next
    })
  }, [])

  const handleRestoreSong = useCallback((playlistId: string, songId: string) => {
    setRemovedSongs((prev) => {
      const next = new Map(prev)
      const playlistRemoved = new Set(next.get(playlistId) || [])
      playlistRemoved.delete(songId)
      next.set(playlistId, playlistRemoved)
      return next
    })
  }, [])

  const value: AppStateContextValue = {
    selectedSongs,
    acceptedPlaylists,
    removedSongs,
    handleToggleSong,
    handleSelectAll,
    handleDeselectAll,
    handleAcceptPlaylist,
    handleRemoveSong,
    handleRestoreSong,
  }

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider")
  return ctx
}
