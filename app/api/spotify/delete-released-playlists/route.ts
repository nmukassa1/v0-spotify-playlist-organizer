import { getSpotifyPlaylists, unfollowPlaylist } from "@/lib/spotify-server";
import type { SpotifyPlaylistItem } from "@/lib/spotify-types";
import { NextResponse } from "next/server";

const RELEASED_PREFIX = "Released ";
const RELEASED_PREFIX_LOWER = "released ";

function isReleasedPlaylist(name: string): boolean {
  return (
    name.startsWith(RELEASED_PREFIX) || name.startsWith(RELEASED_PREFIX_LOWER)
  );
}

/**
 * POST /api/spotify/delete-released-playlists
 * Deletes (unfollows) all playlists whose name starts with "Released " or "released ".
 * Temporary utility for the organize-by-year modal.
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
    console.log(
      "Playlist name starts with 'Released':",
      result.data.items[0].name.startsWith("Released:"),
    );

    const { items, total } = result.data;
    // toDelete.push(...items.filter((p) => isReleasedPlaylist(p.name)));
    toDelete.push(...items.filter((p) => p.name.startsWith("Released:")));
    console.log("toDelete", toDelete.length);
    if (offset + items.length >= total || items.length === 0) break;
    offset += limit;
  }

  console.log("toDelete", toDelete);

  const deleted: string[] = [];
  for (const playlist of toDelete) {
    // const unfollow = await unfollowPlaylist(playlist.id);
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
