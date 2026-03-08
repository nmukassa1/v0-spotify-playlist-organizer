/**
 * Server-only Spotify API helpers.
 * Use only in API routes or server components (never import from client).
 */
import { auth, clerkClient } from "@clerk/nextjs/server";
import type {
  SpotifyPlaylistsResponse,
  SpotifySavedTracksResponse,
} from "@/lib/spotify-types";

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

export async function getSpotifyAccessToken(): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) return null;

  try {
    const client = await clerkClient();
    const res = await client.users.getUserOauthAccessToken(userId, "spotify");
    const token = res.data[0]?.token ?? null;
    return token;
  } catch {
    return null;
  }
}

export async function spotifyFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<{ data: T } | { error: string; status: number }> {
  const token = await getSpotifyAccessToken();
  if (!token) {
    return { error: "Not connected to Spotify", status: 401 };
  }

  const url = path.startsWith("http") ? path : `${SPOTIFY_API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    return { error: text || res.statusText, status: res.status };
  }

  if (res.status === 204) {
    return { data: undefined as unknown as T };
  }

  const text = await res.text();
  if (!text || text.trim() === "") {
    return { data: undefined as unknown as T };
  }

  const data = JSON.parse(text) as T;
  return { data };
}

export async function getSpotifyPlaylists(limit = 50, offset = 0) {
  return spotifyFetch<SpotifyPlaylistsResponse>(
    `/me/playlists?limit=${limit}&offset=${offset}`,
  );
}

/** Unfollow (remove from library) a playlist. Returns 204 on success. */
export async function unfollowPlaylist(
  playlistUri: string,
): Promise<{ ok: true } | { error: string; status: number }> {
  const result = await spotifyFetch<undefined>(
    `/me/library?uris=${playlistUri}`,
    { method: "DELETE" },
  );
  if ("error" in result) return result;
  return { ok: true };
}

/** User's Liked Songs (saved tracks). Requires scope user-library-read. */
export async function getSpotifySavedTracks(limit = 50, offset = 0) {
  return spotifyFetch<SpotifySavedTracksResponse>(
    `/me/tracks?limit=${limit}&offset=${offset}`,
  );
}

/** Playlist tracks response (items may have null track if unavailable). */
interface PlaylistTracksResponse {
  items: Array<{ track: { id: string } | null }>;
  next: string | null;
  total: number;
}

/**
 * Fetch all track IDs in a playlist. Uses Set for O(1) membership and limit=100 for minimal requests.
 */
export async function getPlaylistTrackIds(
  playlistId: string,
): Promise<{ data: Set<string> } | { error: string; status: number }> {
  const ids = new Set<string>();
  const limit = 100;
  let offset = 0;

  for (;;) {
    const result = await spotifyFetch<PlaylistTracksResponse>(
      `/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`,
    );
    if ("error" in result) return result;
    const { items, next } = result.data;
    for (const item of items) {
      if (item.track?.id) ids.add(item.track.id);
    }
    if (!next || items.length === 0) break;
    offset += limit;
  }

  return { data: ids };
}

/** Fetch all liked saved tracks (paginated). For refresh/sync use. */
export async function getAllLikedTracks(): Promise<
  | { data: import("@/lib/spotify-types").SpotifySavedTrack[] }
  | { error: string; status: number }
> {
  const all: import("@/lib/spotify-types").SpotifySavedTrack[] = [];
  const limit = 50;
  let offset = 0;

  for (;;) {
    const result = await getSpotifySavedTracks(limit, offset);
    if ("error" in result) return result;
    const { items, total } = result.data;
    all.push(...items);
    if (all.length >= total || items.length === 0) break;
    offset += limit;
  }

  return { data: all };
}

/** Create a playlist for the current user. Requires scope playlist-modify-public or playlist-modify-private. */
export async function createSpotifyPlaylist(body: {
  name: string;
  description?: string | null;
  public?: boolean;
}) {
  const token = await getSpotifyAccessToken();
  if (!token) {
    return { error: "Not connected to Spotify", status: 401 };
  }

  return spotifyFetch<{
    id: string;
    name: string;
    external_urls: { spotify: string };
  }>("/me/playlists", {
    method: "POST",
    body: JSON.stringify({
      name: body.name,
      description: body.description ?? undefined,
      public: body.public ?? false,
    }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

/** Add tracks to a playlist. URIs must be "spotify:track:id". Max 100 per request. Requires Spotify access token. */
export async function addTracksToPlaylist(
  playlistId: string,
  uris: string[],
): Promise<
  { data: { snapshot_id: string } } | { error: string; status: number }
> {
  // const token = await getSpotifyAccessToken();
  // if (!token) {
  //   return { error: "Not connected to Spotify", status: 401 };
  // }

  // console.log("uris", uris);

  let lastSnapshotId = "";
  const BATCH = 100;
  for (let i = 0; i < uris.length; i += BATCH) {
    const chunk = uris.slice(i, i + BATCH);
    // console.log("chunk", chunk.join(","));
    const result = await spotifyFetch<{ snapshot_id: string }>(
      `/playlists/${playlistId}/items?uris=${chunk.join(",")}`,
      {
        method: "POST",
      },
    );
    if ("error" in result) return result;
    if (result.data?.snapshot_id) lastSnapshotId = result.data.snapshot_id;
  }
  return { data: { snapshot_id: lastSnapshotId } };
  // return { data: { snapshot_id: "" } };
}
