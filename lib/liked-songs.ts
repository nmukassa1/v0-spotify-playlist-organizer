/**
 * Client-safe helpers for liked songs: fetch all (paginated) and group by year.
 */
import type { SpotifySavedTrack, SpotifySavedTracksResponse } from "@/lib/spotify-types"

const LIKED_API = "/api/spotify/liked"
const PAGE_SIZE = 50

/** Extract release year from album.release_date (e.g. "2020-03-14" or "2020"). */
export function getReleaseYear(saved: SpotifySavedTrack): string {
  const date = saved.track?.album?.release_date
  if (!date || typeof date !== "string") return "Unknown"
  const year = date.slice(0, 4)
  return /^\d{4}$/.test(year) ? year : "Unknown"
}

/** Fetch all liked songs by paginating the API. */
export async function fetchAllLikedSongs(): Promise<SpotifySavedTrack[]> {
  const all: SpotifySavedTrack[] = []
  let offset = 0
  let total = 1

  while (offset < total) {
    const url = `${LIKED_API}?limit=${PAGE_SIZE}&offset=${offset}`
    const res = await fetch(url)
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }))
      throw new Error((err as { error?: string }).error ?? "Failed to load liked songs")
    }
    const data = (await res.json()) as SpotifySavedTracksResponse
    all.push(...data.items)
    total = data.total
    offset += data.items.length
    if (data.items.length === 0) break
  }

  return all
}

/** Group saved tracks by release year. Returns entries sorted by year descending. */
export function groupLikedSongsByYear(
  tracks: SpotifySavedTrack[]
): { year: string; tracks: SpotifySavedTrack[] }[] {
  const byYear = new Map<string, SpotifySavedTrack[]>()
  for (const t of tracks) {
    const year = getReleaseYear(t)
    if (!byYear.has(year)) byYear.set(year, [])
    byYear.get(year)!.push(t)
  }
  const entries = Array.from(byYear.entries()).map(([year, tracks]) => ({ year, tracks }))
  entries.sort((a, b) => {
    if (a.year === "Unknown") return 1
    if (b.year === "Unknown") return -1
    return Number(b.year) - Number(a.year)
  })
  return entries
}
