"use client"

import { cn } from "@/lib/utils"
import { Home, Library, Sparkles, ListMusic, ChevronRight } from "lucide-react"
import { UserButton, useUser } from "@clerk/nextjs"

interface AppSidebarProps {
  activeView: string
  onViewChange: (view: string) => void
  unsortedCount: number
  playlistCount: number
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "library", label: "Liked Songs", icon: Library },
  { id: "suggestions", label: "Organize", icon: Sparkles },
  { id: "playlists", label: "My Playlists", icon: ListMusic },
]

export function AppSidebar({ activeView, onViewChange, unsortedCount, playlistCount }: AppSidebarProps) {
  const { user } = useUser()

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-white/30 glass-strong">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/20">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
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
                    "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-foreground/70 hover:text-foreground hover:bg-white/40"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.id === "library" && (
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-mono", isActive ? "bg-white/30 text-white" : "bg-primary/15 text-primary")}>
                      {unsortedCount}
                    </span>
                  )}
                  {item.id === "playlists" && (
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-mono", isActive ? "bg-white/30 text-white" : "bg-primary/15 text-primary")}>
                      {playlistCount}
                    </span>
                  )}
                  {isActive && <ChevronRight className="h-3 w-3 shrink-0 text-white" />}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="border-t border-white/20 px-4 py-4">
        <div className="flex items-center gap-3 rounded-2xl bg-white/40 p-3">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-10 w-10 rounded-xl",
              },
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {user?.firstName || user?.username || "User"}
            </p>
            <p className="text-[11px] text-foreground/60 truncate">
              {user?.primaryEmailAddress?.emailAddress || "Spotify Connected"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
