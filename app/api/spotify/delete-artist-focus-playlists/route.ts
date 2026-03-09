import { getSpotifyPlaylists, unfollowPlaylist } from "@/lib/spotify-server";
import type { SpotifyPlaylistItem } from "@/lib/spotify-types";
import { NextResponse } from "next/server";

const ARTIST_FOCUS_PREFIX = "Artist Focus:";

function isArtistFocusPlaylist(name: string): boolean {
  return name.trimStart().startsWith(ARTIST_FOCUS_PREFIX);
}

/**
 * POST /api/spotify/delete-artist-focus-playlists
 * Deletes (unfollows) all playlists whose name starts with "Artist Focus:".
 * Temporary utility for the organize-by-artist-focus modal.
 */
export async function POST() {
  const limit = 50;
  let offset = 0;
  const toDelete: SpotifyPlaylistItem[] = [];

  // Paginate through all user playlists
  while (true) {
    const result = await getSpotifyPlaylists(limit, offset);
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    const { items, total } = result.data;
    toDelete.push(...items.filter((p) => isArtistFocusPlaylist(p.name)));

    if (offset + items.length >= total || items.length === 0) break;
    offset += limit;
  }

  const deleted: string[] = [];
  for (const playlist of toDelete) {
    const unfollow = await unfollowPlaylist(playlist.uri);
    if ("ok" in unfollow) {
      deleted.push(playlist.id);
    }
  }

  return NextResponse.json({
    deleted: deleted.length,
    totalFound: toDelete.length,
    ids: deleted,
  });
}

