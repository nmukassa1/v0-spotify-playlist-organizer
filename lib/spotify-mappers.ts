import type { Song } from "@/lib/mock-data"
import type { SpotifySavedTrack } from "@/lib/spotify-types"

const COVER_COLORS = [
  "bg-red-500",
  "bg-pink-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-emerald-500",
  "bg-cyan-500",
  "bg-rose-500",
  "bg-fuchsia-500",
  "bg-sky-500",
  "bg-lime-500",
] as const

function pickCoverColor(trackId: string): string {
  let hash = 0
  for (let i = 0; i < trackId.length; i++) {
    hash = (hash << 5) - hash + trackId.charCodeAt(i)
    hash |= 0
  }
  return COVER_COLORS[Math.abs(hash) % COVER_COLORS.length]
}

function msToDuration(ms: number): { formatted: string; seconds: number } {
  const seconds = Math.round(ms / 1000)
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return {
    formatted: `${m}:${s.toString().padStart(2, "0")}`,
    seconds,
  }
}

function parseReleaseYear(releaseDate?: string): number {
  if (!releaseDate) return 0
  const year = parseInt(releaseDate.slice(0, 4), 10)
  return Number.isNaN(year) ? 0 : year
}

/**
 * Maps a Spotify saved track to the app's Song type.
 */
export function mapSpotifySavedTrackToSong(item: SpotifySavedTrack): Song {
  const { track } = item
  const [primaryArtist, ...restArtists] = track.artists ?? []
  const { formatted, seconds } = msToDuration(track.duration_ms ?? 0)
  const imageUrl = track.album?.images?.[0]?.url

  return {
    id: track.id,
    title: track.name,
    artist: primaryArtist?.name ?? "Unknown",
    featuredArtists: restArtists.map((a) => a.name),
    album: track.album?.name ?? "",
    duration: formatted,
    durationSeconds: seconds,
    addedAt: item.added_at?.slice(0, 10) ?? "",
    releaseYear: parseReleaseYear(track.album?.release_date),
    popularity: track.popularity ?? 0,
    coverColor: pickCoverColor(track.id),
    ...(imageUrl && { imageUrl }),
  }
}

/**
 * Maps an array of Spotify saved tracks to Song[].
 */
export function mapSpotifySavedTracksToSongs(items: SpotifySavedTrack[]): Song[] {
  return items.map(mapSpotifySavedTrackToSong)
}
