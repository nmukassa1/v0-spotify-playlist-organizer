"use client"

import { ArrowRight, Music, Sparkles } from "lucide-react"

interface QuickActionItemProps {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
  variant?: "primary" | "secondary"
}

function QuickActionItem({
  title,
  description,
  icon,
  onClick,
  variant = "secondary",
}: QuickActionItemProps) {
  const isPrimary = variant === "primary"
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg p-4 text-left transition-colors group ${
        isPrimary
          ? "bg-primary/10 hover:bg-primary/15"
          : "bg-secondary/50 hover:bg-secondary"
      }`}
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          isPrimary ? "bg-primary" : "bg-secondary"
        }`}
      >
        <span className={isPrimary ? "text-primary-foreground" : "text-foreground"}>
          {icon}
        </span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </button>
  )
}

interface DashboardQuickActionsProps {
  onNavigateToSuggestions: () => void
  onNavigateToLibrary: () => void
}

export function DashboardQuickActions({
  onNavigateToSuggestions,
  onNavigateToLibrary,
}: DashboardQuickActionsProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="flex flex-col gap-2">
        <QuickActionItem
          title="Auto-Sort My Library"
          description="Organize by artist, year, popularity & more"
          icon={<Sparkles className="h-4 w-4" />}
          onClick={onNavigateToSuggestions}
          variant="primary"
        />
        <QuickActionItem
          title="Browse All Songs"
          description="View and manually pick tracks"
          icon={<Music className="h-4 w-4" />}
          onClick={onNavigateToLibrary}
          variant="secondary"
        />
      </div>
    </div>
  )
}
