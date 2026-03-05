"use client"

import { cn } from "@/lib/utils"
import type { CategorySummaryItem } from "./dashboard-view-types"
import { LibraryBreakdownRow } from "./library-breakdown-row"

interface DashboardLibraryBreakdownProps {
  summary: CategorySummaryItem[]
  playlistsByCategory: Record<string, unknown[]>
}

export function DashboardLibraryBreakdown({
  summary,
  playlistsByCategory,
}: DashboardLibraryBreakdownProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Library Breakdown</h3>
        <span className="text-[10px] font-mono text-muted-foreground">5 ways to sort</span>
      </div>
      <div className="flex flex-col gap-3">
        {summary.map(({ category, stat, detail }) => (
          <LibraryBreakdownRow
            key={category}
            category={category}
            stat={stat}
            detail={detail}
            playlistCount={(playlistsByCategory[category] ?? []).length}
          />
        ))}
      </div>
    </div>
  )
}
