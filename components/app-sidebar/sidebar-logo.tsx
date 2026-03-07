"use client"

import { Sparkles } from "lucide-react"

export function SidebarLogo() {
  return (
    <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
        <Sparkles className="h-5 w-5 text-primary-foreground" />
      </div>
      <div>
        <h1 className="text-lg font-bold tracking-tight text-sidebar-foreground">Sortify</h1>
        <p className="text-xs text-muted-foreground font-mono">playlist organizer</p>
      </div>
    </div>
  )
}
