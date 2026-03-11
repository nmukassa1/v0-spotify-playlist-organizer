"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type {
  SpotifyPlaylistsResponse,
  SpotifySavedTracksResponse,
} from "@/lib/spotify-types";

const STATUS_KEY = "/api/spotify/status";
const PLAYLISTS_KEY = "/api/spotify/playlists";
const LIKED_KEY = "/api/spotify/liked";
const RELEASED_PLAYLISTS_KEY = "/api/spotify/released-playlists";

export interface SpotifyPlaylistWithTracks {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  trackCount: number;
  tracks: Array<{
    added_at?: string;
    track: {
      id: string;
      name: string;
      duration_ms: number;
      popularity: number;
      artists: Array<{ id: string; name: string }>;
      album: {
        id: string;
        name: string;
        release_date?: string;
        images: Array<{ url: string }>;
      };
    };
  }>;
}

/** Centralized query keys for cache invalidation */
export const spotifyKeys = {
  all: ["spotify"] as const,
  status: () => [...spotifyKeys.all, "status"] as const,
  liked: (limit: number, offset: number) =>
    [...spotifyKeys.all, "liked", limit, offset] as const,
  likedAll: () => [...spotifyKeys.all, "liked-all"] as const,
  playlists: (limit: number, offset: number) =>
    [...spotifyKeys.all, "playlists", limit, offset] as const,
  playlist: (id: string) => [...spotifyKeys.all, "playlist", id] as const,
  releasedPlaylists: () => [...spotifyKeys.all, "released-playlists"] as const,
};

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? "Request failed");
  }
  return res.json();
}

/**
 * Fetches Spotify connection status. Use for gating UI (e.g. "Connect Spotify" vs show data).
 */
export function useSpotifyStatus(
  options?: Omit<
    UseQueryOptions<{ connected: boolean }, Error>,
    "queryKey" | "queryFn"
  >,
) {
  const query = useQuery({
    queryKey: spotifyKeys.status(),
    queryFn: () => fetcher<{ connected: boolean }>(STATUS_KEY),
    refetchOnWindowFocus: false,
    ...options,
  });
  return {
    isConnected: query.data?.connected ?? false,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    mutate: query.refetch,
  };
}

/**
 * Fetches the current user's Liked Songs (saved tracks). Token is used only on the server.
 */
export function useSpotifyLikedSongs(
  limit = 50,
  offset = 0,
  options?: Omit<
    UseQueryOptions<SpotifySavedTracksResponse, Error>,
    "queryKey" | "queryFn"
  >,
) {
  const query = useQuery({
    queryKey: spotifyKeys.liked(limit, offset),
    queryFn: () =>
      fetcher<SpotifySavedTracksResponse>(
        `${LIKED_KEY}?limit=${limit}&offset=${offset}`,
      ),
    refetchOnWindowFocus: true,
    ...options,
  });
  return {
    tracks: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    mutate: query.refetch,
  };
}

/**
 * Fetches a single playlist with all its tracks by Spotify playlist ID.
 */
export function useSpotifyPlaylist(
  playlistId: string | null,
  options?: Omit<
    UseQueryOptions<SpotifyPlaylistWithTracks, Error>,
    "queryKey" | "queryFn"
  >,
) {
  const query = useQuery({
    queryKey: spotifyKeys.playlist(playlistId ?? ""),
    queryFn: () =>
      fetcher<SpotifyPlaylistWithTracks>(
        `${PLAYLISTS_KEY}/${playlistId}`,
      ),
    enabled: !!playlistId,
    refetchOnWindowFocus: true,
    ...options,
  });
  return {
    playlist: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    mutate: query.refetch,
  };
}

/**
 * Fetches the current user's Spotify playlists. Token is used only on the server (proxied via API).
 */
export function useSpotifyPlaylists(
  limit = 50,
  offset = 0,
  options?: Omit<
    UseQueryOptions<SpotifyPlaylistsResponse, Error>,
    "queryKey" | "queryFn"
  >,
) {
  const query = useQuery({
    queryKey: spotifyKeys.playlists(limit, offset),
    queryFn: () =>
      fetcher<SpotifyPlaylistsResponse>(
        `${PLAYLISTS_KEY}?limit=${limit}&offset=${offset}`,
      ),
    refetchOnWindowFocus: true,
    ...options,
  });
  return {
    playlists: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    mutate: query.refetch,
  };
}

/**
 * Combined hook: connection status + liked songs.
 */
export function useSpotify(likedLimit = 50) {
  const status = useSpotifyStatus();
  const liked = useSpotifyLikedSongs(likedLimit, 0);

  return {
    isConnected: status.isConnected,
    tracks: liked.tracks,
    totalTracks: liked.total,
    isLoading: status.isLoading || liked.isLoading,
    error: status.error ?? liked.error,
    mutateLiked: liked.mutate,
    mutateStatus: status.mutate,
  };
}

export interface ReleasedPlaylistsData {
  playlists: Array<{ id: string; name: string }>;
  count: number;
  range: string;
}

/** Response from organized-playlists API */
/**
 * Fetches playlists whose name starts with "Released:" (decade ranges) and the computed year range.
 */
export function useReleasedPlaylists(
  options?: Omit<
    UseQueryOptions<ReleasedPlaylistsData, Error>,
    "queryKey" | "queryFn"
  >,
) {
  const query = useQuery({
    queryKey: spotifyKeys.releasedPlaylists(),
    queryFn: () => fetcher<ReleasedPlaylistsData>(RELEASED_PLAYLISTS_KEY),
    refetchOnWindowFocus: true,
    ...options,
  });
  return {
    playlists: query.data?.playlists ?? [],
    count: query.data?.count ?? 0,
    range: query.data?.range ?? "0",
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    mutate: query.refetch,
  };
}

/** Hook that returns queryClient for invalidating Spotify caches after mutations */
export function useSpotifyQueryClient() {
  return useQueryClient();
}
