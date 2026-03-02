"use client"

import { cn } from "@/lib/utils"
import type { Song, SuggestedPlaylist, PlaylistCategory } from "@/lib/mock-data"
import { categoryLabels } from "@/lib/mock-data"
import { Music, Sparkles, ListMusic, TrendingUp, ArrowRight, Clock, User, Users, Calendar, Star, Timer } from "lucide-react"

interface DashboardViewProps {
  songs: Song[]
  playlists: SuggestedPlaylist[]
  acceptedPlaylists: Set<string>
  onNavigate: (view: string) => void
}

const categoryIcons: Record<PlaylistCategory, React.ComponentType<{ className?: string }>> = {
  artist: User,
  features: Users,
  year: Calendar,
  popularity: Star,
  duration: Timer,
}

const categoryAccents: Record<PlaylistCategory, { text: string; bg: string }> = {
  artist: { text: "text-chart-1", bg: "bg-chart-1/10" },
  features: { text: "text-chart-2", bg: "bg-chart-2/10" },
  year: { text: "text-chart-3", bg: "bg-chart-3/10" },
  popularity: { text: "text-chart-5", bg: "bg-chart-5/10" },
  duration: { text: "text-chart-4", bg: "bg-chart-4/10" },
}

export function DashboardView({ songs, playlists, acceptedPlaylists, onNavigate }: DashboardViewProps) {
  // Compute summary stats per category
  const uniqueArtists = new Set(songs.map((s) => s.artist)).size
  const featureTracks = songs.filter((s) => s.featuredArtists.length > 0).length
  const yearRange = (() => {
    const years = songs.map((s) => s.releaseYear)
    return `${Math.min(...years)} - ${Math.max(...years)}`
  })()
  const avgPopularity = Math.round(songs.reduce((a, s) => a + s.popularity, 0) / songs.length)
  const avgDuration = (() => {
    const avg = songs.reduce((a, s) => a + s.durationSeconds, 0) / songs.length
    const m = Math.floor(avg / 60)
    const s = Math.round(avg % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
  })()

  const categorySummary: { category: PlaylistCategory; stat: string; detail: string }[] = [
    { category: "artist", stat: `${uniqueArtists}`, detail: "unique artists" },
    { category: "features", stat: `${featureTracks}`, detail: "collab tracks" },
    { category: "year", stat: yearRange, detail: "year range" },
    { category: "popularity", stat: `${avgPopularity}`, detail: "avg popularity" },
    { category: "duration", stat: avgDuration, detail: "avg track length" },
  ]

  const totalOrganized = playlists
    .filter((p) => acceptedPlaylists.has(p.id))
    .reduce((acc, p) => acc + p.songCount, 0)

  const sortedSongs = songs.filter((_, i) => i < 5)

  // Playlists by category
  const playlistsByCategory = playlists.reduce(
    (acc, p) => {
      if (!acc[p.category]) acc[p.category] = []
      acc[p.category].push(p)
      return acc
    },
    {} as Record<string, SuggestedPlaylist[]>
  )

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 overflow-y-auto">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-foreground text-balance">Your Library Overview</h2>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          {songs.length} liked songs ready to organize by artist, features, year, popularity, or duration.
        </p>
      </div>

      {/* Top-level stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Liked Songs", value: songs.length, icon: Music, accent: "text-chart-1", bg: "bg-chart-1/10" },
          { label: "Suggestions Ready", value: playlists.length, icon: Sparkles, accent: "text-chart-3", bg: "bg-chart-3/10" },
          { label: "Playlists Created", value: acceptedPlaylists.size, icon: ListMusic, accent: "text-chart-2", bg: "bg-chart-2/10" },
          { label: "Songs Organized", value: totalOrganized, icon: TrendingUp, accent: "text-chart-5", bg: "bg-chart-5/10" },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
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
        {/* Organization Summary */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Library Breakdown</h3>
            <span className="text-[10px] font-mono text-muted-foreground">5 ways to sort</span>
          </div>
          <div className="flex flex-col gap-3">
            {categorySummary.map(({ category, stat, detail }) => {
              const Icon = categoryIcons[category]
              const accent = categoryAccents[category]
              const count = playlistsByCategory[category]?.length || 0
              return (
                <div key={category} className="flex items-center gap-3">
                  <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", accent.bg)}>
                    <Icon className={cn("h-4 w-4", accent.text)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">{categoryLabels[category]}</p>
                    <p className="text-[11px] text-muted-foreground">{detail}</p>
                  </div>
                  <span className="text-sm font-bold font-mono text-foreground">{stat}</span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                    {count} {count === 1 ? "playlist" : "playlists"}
                  </span>
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
                <p className="text-xs text-muted-foreground">Organize by artist, year, popularity & more</p>
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
                <p className="text-xs text-muted-foreground">View and manually pick tracks</p>
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
          <button onClick={() => onNavigate("library")} className="flex items-center gap-1 text-xs text-primary hover:underline">
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
                <p className="text-sm font-medium text-foreground truncate">
                  {song.title}
                  {song.featuredArtists.length > 0 && (
                    <span className="text-muted-foreground font-normal"> ft. {song.featuredArtists.join(", ")}</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
              </div>
              <span className="hidden sm:block text-[10px] font-mono text-muted-foreground/60">{song.releaseYear}</span>
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
