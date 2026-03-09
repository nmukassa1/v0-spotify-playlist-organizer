"use client"

import { useSpotifyLikedSongs, useOrganizedPlaylistsCount } from "@/hooks/use-spotify"
import { AppStateProvider } from "@/contexts/app-state-context"
import { AppSidebar } from "@/components/app-sidebar/app-sidebar"
import { MobileHeader } from "@/components/mobile-header/mobile-header"

function AppShell({ children }: { children: React.ReactNode }) {
  const { total } = useSpotifyLikedSongs(1, 0)
  const { count: playlistCount } = useOrganizedPlaylistsCount()
  const unsortedCount = total ?? 0
  return (
    <div className="flex h-dvh flex-col bg-background">
      <MobileHeader />
      <div className="flex flex-1 overflow-scroll">
        <AppSidebar
          unsortedCount={unsortedCount}
          playlistCount={playlistCount}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppStateProvider>
      <AppShell>{children}</AppShell>
    </AppStateProvider>
  )
}
