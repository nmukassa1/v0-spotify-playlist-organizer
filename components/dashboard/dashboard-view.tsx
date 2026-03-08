"use client"

import type { Song, SuggestedPlaylist } from "@/lib/mock-data"
import { Music, Sparkles, ListMusic, TrendingUp } from "lucide-react"
import { DashboardWelcome } from "./dashboard-welcome"
import { StatCard } from "./stat-card"
import { DashboardLibraryBreakdown } from "./dashboard-library-breakdown"
import { DashboardQuickActions } from "./dashboard-quick-actions"
import { DashboardRecentlyAdded } from "./dashboard-recently-added"
import type { CategorySummaryItem } from "./dashboard-view-types"

interface DashboardViewProps {
  songs: Song[]
  playlists: SuggestedPlaylist[]
  acceptedPlaylists: Set<string>
  /** Total liked songs count from API (for stat). When not set, uses songs.length */
  totalLikedSongs?: number
  /** When true, stat cards and recently added show loading state */
  isLoading?: boolean
  /** Real "Released:" playlist data for the year row. When set, year row shows range and count from Spotify. */
  releasedYearSummary?: {
    range: string
    playlistCount: number
    playlists: unknown[]
    isLoading?: boolean
  }
}

export function DashboardView({
  songs,
  playlists,
  acceptedPlaylists,
  totalLikedSongs,
  isLoading,
  releasedYearSummary,
}: DashboardViewProps) {
  const likedCount = totalLikedSongs ?? songs.length
  const uniqueArtists = new Set(songs.map((s) => s.artist)).size
  const featureTracks = songs.filter((s) => s.featuredArtists.length > 0).length
  const yearRangeFromSongs =
    songs.length > 0
      ? `${Math.min(...songs.map((s) => s.releaseYear))} - ${Math.max(...songs.map((s) => s.releaseYear))}`
      : "—"
  const yearRange = releasedYearSummary ? releasedYearSummary.range : yearRangeFromSongs
  const avgPopularity =
    songs.length > 0 ? Math.round(songs.reduce((a, s) => a + s.popularity, 0) / songs.length) : 0
  const avgDuration =
    songs.length > 0
      ? (() => {
          const avg = songs.reduce((a, s) => a + s.durationSeconds, 0) / songs.length
          const m = Math.floor(avg / 60)
          const s = Math.round(avg % 60)
          return `${m}:${s.toString().padStart(2, "0")}`
        })()
      : "—"

  const categorySummary: CategorySummaryItem[] = [
    { category: "artist", stat: `${uniqueArtists}`, detail: "unique artists" },
    { category: "features", stat: `${featureTracks}`, detail: "collab tracks" },
    { category: "year", stat: yearRange, detail: "year range" },
    { category: "popularity", stat: `${avgPopularity}`, detail: "avg popularity" },
    { category: "duration", stat: avgDuration, detail: "avg track length" },
  ]

  const totalOrganized = playlists
    .filter((p) => acceptedPlaylists.has(p.id))
    .reduce((acc, p) => acc + p.songCount, 0)

  const recentlyAddedSongs = songs.filter((_, i) => i < 5)

  const playlistsByCategory = playlists.reduce(
    (acc, p) => {
      if (!acc[p.category]) acc[p.category] = []
      acc[p.category].push(p)
      return acc
    },
    {} as Record<string, unknown[]>
  )
  if (releasedYearSummary) {
    playlistsByCategory["year"] = releasedYearSummary.playlists
  }

  const statCards = [
    { label: "Liked Songs", value: likedCount, icon: Music, accent: "text-chart-1", bg: "bg-chart-1/10", isLoading },
    { label: "Suggestions Ready", value: playlists.length, icon: Sparkles, accent: "text-chart-3", bg: "bg-chart-3/10", isLoading: false },
    { label: "Playlists Created", value: acceptedPlaylists.size, icon: ListMusic, accent: "text-chart-2", bg: "bg-chart-2/10", isLoading: false },
    { label: "Songs Organized", value: totalOrganized, icon: TrendingUp, accent: "text-chart-5", bg: "bg-chart-5/10", isLoading: false },
  ]

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 overflow-y-auto">
      <DashboardWelcome songCount={likedCount} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            accent={stat.accent}
            bg={stat.bg}
            isLoading={stat.isLoading}
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardLibraryBreakdown
          summary={categorySummary}
          playlistsByCategory={playlistsByCategory}
        />
      <DashboardQuickActions
          suggestionsHref="/suggestions"
          libraryHref="/library"
        />
      </div>

      <DashboardRecentlyAdded
        songs={recentlyAddedSongs}
        viewAllHref="/library"
        isLoading={isLoading}
      />
    </div>
  )
}
