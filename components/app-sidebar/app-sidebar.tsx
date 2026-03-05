"use client"

import { SidebarLogo } from "./sidebar-logo"
import { SidebarNav } from "./sidebar-nav"
import { SidebarUser } from "./sidebar-user"

interface AppSidebarProps {
  activeView: string
  onViewChange: (view: string) => void
  unsortedCount: number
  playlistCount: number
}

export function AppSidebar({
  activeView,
  onViewChange,
  unsortedCount,
  playlistCount,
}: AppSidebarProps) {
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-sidebar">
      <SidebarLogo />
      <SidebarNav
        activeView={activeView}
        onViewChange={onViewChange}
        unsortedCount={unsortedCount}
        playlistCount={playlistCount}
      />
      <SidebarUser />
    </aside>
  )
}
