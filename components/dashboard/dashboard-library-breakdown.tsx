"use client";

import { Calendar, User, Users } from "lucide-react";

interface DashboardLibraryBreakdownProps {
  decadeRange: string;
  soloCount: number;
  featuresCount: number;
}

export function DashboardLibraryBreakdown({
  decadeRange,
  soloCount,
  featuresCount,
}: DashboardLibraryBreakdownProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">
          Library Breakdown
        </h3>
        <span className="text-[10px] font-mono text-muted-foreground">
          2 ways to sort
        </span>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-chart-3/10">
            <Calendar className="h-4 w-4 text-chart-3" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground">By decade</p>
            <p className="text-[11px] text-muted-foreground">release range</p>
          </div>
          <span className="text-sm font-bold font-mono text-foreground">
            {decadeRange}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-chart-2/10">
            <User className="h-4 w-4 text-chart-2" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground">Solo</p>
            <p className="text-[11px] text-muted-foreground">single artist</p>
          </div>
          <span className="text-sm font-bold font-mono text-foreground">
            {soloCount}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-chart-2/10">
            <Users className="h-4 w-4 text-chart-2" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground">With features</p>
            <p className="text-[11px] text-muted-foreground">collaborations</p>
          </div>
          <span className="text-sm font-bold font-mono text-foreground">
            {featuresCount}
          </span>
        </div>
      </div>
    </div>
  );
}
