"use client"

import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import { navItems } from "@/lib/nav-config"

interface SidebarNavProps {
  activeView: string
  onViewChange: (view: string) => void
  unsortedCount: number
  playlistCount: number
}

export function SidebarNav({
  activeView,
  onViewChange,
  unsortedCount,
  playlistCount,
}: SidebarNavProps) {
  return (
    <nav className="flex-1 px-3 py-4">
      <div className="mb-2 px-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Navigate</p>
      </div>
      <ul className="flex flex-col gap-1" role="navigation" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id
          return (
            <li key={item.id}>
              <button
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.id === "library" && (
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                    {unsortedCount}
                  </span>
                )}
                {item.id === "playlists" && (
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                    {playlistCount}
                  </span>
                )}
                {isActive && <ChevronRight className="h-3 w-3 shrink-0 text-sidebar-primary" />}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
