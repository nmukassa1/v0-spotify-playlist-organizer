/**
 * Server-only Spotify API helpers.
 * Use only in API routes or server components (never import from client).
 */
import { auth, clerkClient } from "@clerk/nextjs/server"
import type { SpotifyPlaylistsResponse, SpotifySavedTracksResponse } from "@/lib/spotify-types"

const SPOTIFY_API_BASE = "https://api.spotify.com/v1"

export async function getSpotifyAccessToken(): Promise<string | null> {
  const { userId } = await auth()
  if (!userId) return null

  try {
    const client = await clerkClient()
    const res = await client.users.getUserOauthAccessToken(userId, "oauth_spotify")
    const token = res.data[0]?.token ?? null
    return token
  } catch {
    return null
  }
}

export async function spotifyFetch<T>(
  path: string,
  options?: RequestInit
): Promise<{ data: T } | { error: string; status: number }> {
  const token = await getSpotifyAccessToken()
  if (!token) {
    return { error: "Not connected to Spotify", status: 401 }
  }

  const url = path.startsWith("http") ? path : `${SPOTIFY_API_BASE}${path}`
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const text = await res.text()
    return { error: text || res.statusText, status: res.status }
  }

  const data = (await res.json()) as T
  return { data }
}

export async function getSpotifyPlaylists(limit = 50, offset = 0) {
  return spotifyFetch<SpotifyPlaylistsResponse>(
    `/me/playlists?limit=${limit}&offset=${offset}`
  )
}

/** User's Liked Songs (saved tracks). Requires scope user-library-read. */
export async function getSpotifySavedTracks(limit = 50, offset = 0) {
  return spotifyFetch<SpotifySavedTracksResponse>(
    `/me/tracks?limit=${limit}&offset=${offset}`
  )
}
