"use client";

import type { Song } from "@/lib/mock-data";
import { Music, ListMusic } from "lucide-react";
import { DashboardWelcome } from "./dashboard-welcome";
import { StatCard } from "./stat-card";
import { DashboardLibraryBreakdown } from "./dashboard-library-breakdown";
import { DashboardQuickActions } from "./dashboard-quick-actions";
import { DashboardRecentlyAdded } from "./dashboard-recently-added";

interface DashboardViewProps {
  songs: Song[];
  /** Total liked songs count from API (for stat). When not set, uses songs.length */
  totalLikedSongs?: number;
  /** When true, stat cards and recently added show loading state */
  isLoading?: boolean;
  /** Real "Released:" playlist data for the year row. When set, year row shows range and count from Spotify. */
  releasedYearSummary?: {
    range: string;
    playlistCount: number;
    playlists: unknown[];
    isLoading?: boolean;
  };
  /** Count of user's organized playlists (Released: + Artist Focus:) */
  organizedPlaylistCount?: number;
}

export function DashboardView({
  songs,
  totalLikedSongs,
  isLoading,
  releasedYearSummary,
  organizedPlaylistCount = 0,
}: DashboardViewProps) {
  const likedCount = totalLikedSongs ?? songs.length;
  const featureTracks = songs.filter(
    (s) => s.featuredArtists.length > 0,
  ).length;
  const soloTracks = songs.length - featureTracks;
  const yearRangeFromSongs =
    songs.length > 0
      ? `${Math.min(...songs.map((s) => s.releaseYear))} - ${Math.max(...songs.map((s) => s.releaseYear))}`
      : "—";
  const decadeRange = releasedYearSummary
    ? releasedYearSummary.range
    : yearRangeFromSongs;

  const recentlyAddedSongs = songs.filter((_, i) => i < 5);

  const statCards = [
    {
      label: "Liked Songs",
      value: likedCount,
      icon: Music,
      accent: "text-chart-1",
      bg: "bg-chart-1/10",
      isLoading,
    },
    {
      label: "Playlists Created",
      value: organizedPlaylistCount,
      icon: ListMusic,
      accent: "text-chart-2",
      bg: "bg-chart-2/10",
      isLoading: false,
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 overflow-y-auto">
      <DashboardWelcome songCount={likedCount} />

      <div className="grid gap-3 sm:grid-cols-2">
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

      <div className="">
        <DashboardQuickActions libraryHref="/library" />
      </div>

      <DashboardRecentlyAdded
        songs={recentlyAddedSongs}
        viewAllHref="/library"
        isLoading={isLoading}
      />
    </div>
  );
}
