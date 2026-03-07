"use client"

import useSWR from "swr"
import type { SpotifyPlaylistsResponse, SpotifySavedTracksResponse } from "@/lib/spotify-types"

const STATUS_KEY = "/api/spotify/status"
const PLAYLISTS_KEY = "/api/spotify/playlists"
const LIKED_KEY = "/api/spotify/liked"

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error((err as { error?: string }).error ?? "Request failed")
  }
  return res.json()
}

/**
 * Fetches Spotify connection status. Use for gating UI (e.g. "Connect Spotify" vs show data).
 */
export function useSpotifyStatus() {
  const { data, error, isLoading, mutate } = useSWR<{ connected: boolean }>(
    STATUS_KEY,
    fetcher,
    { revalidateOnFocus: false }
  )
  return {
    isConnected: data?.connected ?? false,
    isLoading,
    error: error?.message ?? null,
    mutate,
  }
}

/**
 * Fetches the current user's Liked Songs (saved tracks). Token is used only on the server.
 */
export function useSpotifyLikedSongs(limit = 50, offset = 0) {
  const key = `${LIKED_KEY}?limit=${limit}&offset=${offset}`
  const { data, error, isLoading, mutate } = useSWR<SpotifySavedTracksResponse>(
    key,
    fetcher,
    { revalidateOnFocus: true }
  )
  return {
    tracks: data?.items ?? [],
    total: data?.total ?? 0,
    isLoading,
    error: error?.message ?? null,
    mutate,
  }
}

/**
 * Fetches the current user's Spotify playlists. Token is used only on the server (proxied via API).
 */
export function useSpotifyPlaylists(limit = 50, offset = 0) {
  const key = `${PLAYLISTS_KEY}?limit=${limit}&offset=${offset}`
  const { data, error, isLoading, mutate } = useSWR<SpotifyPlaylistsResponse>(
    key,
    fetcher,
    { revalidateOnFocus: true }
  )
  return {
    playlists: data?.items ?? [],
    total: data?.total ?? 0,
    isLoading,
    error: error?.message ?? null,
    mutate,
  }
}

/**
 * Combined hook: connection status + liked songs.
 */
export function useSpotify(likedLimit = 50) {
  const status = useSpotifyStatus()
  const liked = useSpotifyLikedSongs(likedLimit, 0)

  return {
    isConnected: status.isConnected,
    tracks: liked.tracks,
    totalTracks: liked.total,
    isLoading: status.isLoading || liked.isLoading,
    error: status.error ?? liked.error,
    mutateLiked: liked.mutate,
    mutateStatus: status.mutate,
  }
}
