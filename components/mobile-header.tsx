"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Sparkles, Menu, X, Home, Library, ListMusic } from "lucide-react"
import { UserButton } from "@clerk/nextjs"

interface MobileHeaderProps {
  activeView: string
  onViewChange: (view: string) => void
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "library", label: "Liked Songs", icon: Library },
  { id: "suggestions", label: "Organize", icon: Sparkles },
  { id: "playlists", label: "My Playlists", icon: ListMusic },
]

export function MobileHeader({ activeView, onViewChange }: MobileHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="lg:hidden border-b border-white/20 glass-strong">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <h1 className="text-base font-bold text-foreground">Sortify</h1>
        </div>
        <div className="flex items-center gap-2">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-7 w-7",
              },
            }}
          />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-2xl hover:bg-white/40 transition-colors"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav className="border-t border-white/20 px-3 py-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id)
                  setIsOpen(false)
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all mb-1",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-foreground/70 hover:text-foreground hover:bg-white/40"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            )
          })}
        </nav>
      )}
    </header>
  )
}
