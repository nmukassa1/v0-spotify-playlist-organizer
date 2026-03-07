"use client"

import { SidebarLogo } from "./sidebar-logo"
import { SidebarNav } from "./sidebar-nav"
import { SidebarUser } from "./sidebar-user"

interface AppSidebarProps {
  unsortedCount: number
  playlistCount: number
}

export function AppSidebar({
  unsortedCount,
  playlistCount,
}: AppSidebarProps) {
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-sidebar">
      <SidebarLogo />
      <SidebarNav
        unsortedCount={unsortedCount}
        playlistCount={playlistCount}
      />
      <SidebarUser />
    </aside>
  )
}
