"use client"

import { cn } from "@/lib/utils"
import { Home, Library, Sparkles, ListMusic, Settings, ChevronRight } from "lucide-react"

interface AppSidebarProps {
  activeView: string
  onViewChange: (view: string) => void
  unsortedCount: number
  playlistCount: number
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "library", label: "Liked Songs", icon: Library },
  { id: "suggestions", label: "Smart Sort", icon: Sparkles },
  { id: "playlists", label: "My Playlists", icon: ListMusic },
]

export function AppSidebar({ activeView, onViewChange, unsortedCount, playlistCount }: AppSidebarProps) {
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-sidebar-foreground">Sortify</h1>
          <p className="text-xs text-muted-foreground font-mono">playlist organizer</p>
        </div>
      </div>

      {/* Navigation */}
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

      {/* Bottom section */}
      <div className="border-t border-sidebar-border px-3 py-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
        <div className="mt-3 mx-3 rounded-lg bg-secondary/50 p-3">
          <p className="text-xs font-medium text-sidebar-foreground">Connect Spotify</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">Link your account to import your liked songs</p>
          <button className="mt-2 w-full rounded-md bg-primary py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            Connect
          </button>
        </div>
      </div>
    </aside>
  )
}
