"use client"

import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: number | string
  icon: React.ComponentType<{ className?: string }>
  accent: string
  bg: string
  /** When true, shows a loading placeholder instead of value */
  isLoading?: boolean
}

export function StatCard({ label, value, icon: Icon, accent, bg, isLoading }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", bg)}>
        <Icon className={cn("h-5 w-5", accent)} />
      </div>
      <div>
        <p className="text-2xl font-bold font-mono text-foreground">
          {isLoading ? "—" : value}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}
