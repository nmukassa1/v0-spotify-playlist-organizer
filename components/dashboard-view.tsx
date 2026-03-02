"use client"

import { cn } from "@/lib/utils"
import type { Song, SuggestedPlaylist } from "@/lib/mock-data"
import { Music, Sparkles, ListMusic, TrendingUp, ArrowRight, Clock } from "lucide-react"

interface DashboardViewProps {
  songs: Song[]
  playlists: SuggestedPlaylist[]
  acceptedPlaylists: Set<string>
  onNavigate: (view: string) => void
}

export function DashboardView({ songs, playlists, acceptedPlaylists, onNavigate }: DashboardViewProps) {
  const moodCounts = songs.reduce(
    (acc, song) => {
      acc[song.mood] = (acc[song.mood] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const topMoods = Object.entries(moodCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const sortedSongs = songs.filter((_, i) => i < 5)

  const totalOrganized = playlists
    .filter((p) => acceptedPlaylists.has(p.id))
    .reduce((acc, p) => acc + p.songCount, 0)

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 overflow-y-auto">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-foreground text-balance">Your Library Overview</h2>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          You have {songs.length} liked songs waiting to be organized into the perfect playlists.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Liked Songs",
            value: songs.length,
            icon: Music,
            accent: "text-chart-1",
            bg: "bg-chart-1/10",
          },
          {
            label: "Suggestions Ready",
            value: playlists.length,
            icon: Sparkles,
            accent: "text-chart-3",
            bg: "bg-chart-3/10",
          },
          {
            label: "Playlists Created",
            value: acceptedPlaylists.size,
            icon: ListMusic,
            accent: "text-chart-2",
            bg: "bg-chart-2/10",
          },
          {
            label: "Songs Organized",
            value: totalOrganized,
            icon: TrendingUp,
            accent: "text-chart-5",
            bg: "bg-chart-5/10",
          },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
            >
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", stat.bg)}>
                <Icon className={cn("h-5 w-5", stat.accent)} />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Mood Breakdown */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Mood Breakdown</h3>
            <span className="text-[10px] font-mono text-muted-foreground">{Object.keys(moodCounts).length} moods detected</span>
          </div>
          <div className="flex flex-col gap-3">
            {topMoods.map(([mood, count]) => {
              const percentage = Math.round((count / songs.length) * 100)
              return (
                <div key={mood} className="flex items-center gap-3">
                  <span className="w-20 text-xs text-muted-foreground capitalize">{mood}</span>
                  <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[11px] font-mono text-muted-foreground">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onNavigate("suggestions")}
              className="flex items-center gap-3 rounded-lg bg-primary/10 p-4 text-left transition-colors hover:bg-primary/15 group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Auto-Sort My Library</p>
                <p className="text-xs text-muted-foreground">Let AI organize your songs by mood</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
            <button
              onClick={() => onNavigate("library")}
              className="flex items-center gap-3 rounded-lg bg-secondary/50 p-4 text-left transition-colors hover:bg-secondary group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                <Music className="h-4 w-4 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Browse All Songs</p>
                <p className="text-xs text-muted-foreground">Manually pick and organize tracks</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Recently Added */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Recently Added</h3>
          <button
            onClick={() => onNavigate("library")}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            View all <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="flex flex-col gap-1">
          {sortedSongs.map((song) => (
            <div key={song.id} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-secondary/50 transition-colors">
              <div className={cn("h-8 w-8 shrink-0 rounded flex items-center justify-center", song.coverColor)}>
                <Music className="h-3 w-3 text-foreground/80" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{song.title}</p>
                <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground/50">
                <Clock className="h-3 w-3" />
                <span className="text-[10px] font-mono">{song.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
