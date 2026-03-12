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
  handleToggleSong: (songId: string) => void
  handleSelectAll: (songIds: string[]) => void
  handleDeselectAll: () => void
}

const AppStateContext = createContext<AppStateContextValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set())

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

  const value: AppStateContextValue = {
    selectedSongs,
    handleToggleSong,
    handleSelectAll,
    handleDeselectAll,
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
