"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Sparkles, Menu, X } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { navItems } from "@/lib/nav-config"

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/playlists") return pathname === "/playlists" || pathname.startsWith("/playlists/")
    return pathname === href
  }

  return (
    <header className="lg:hidden border-b border-border bg-sidebar">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
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
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary transition-colors"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-4 w-4 text-foreground" /> : <Menu className="h-4 w-4 text-foreground" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav className="border-t border-border px-3 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      )}
    </header>
  )
}
