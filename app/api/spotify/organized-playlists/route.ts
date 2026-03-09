import { getSpotifyPlaylists } from "@/lib/spotify-server";
import type { SpotifyPlaylistItem } from "@/lib/spotify-types";
import { NextResponse } from "next/server";

function isOrganizedPlaylist(name: string): boolean {
  const n = name.trim();
  return (
    n.toLowerCase().startsWith("released:") ||
    n.toLowerCase().startsWith("artist focus:")
  );
}

/**
 * GET /api/spotify/organized-playlists
 * Returns playlists created by this app (Released: and Artist Focus:).
 */
export async function GET() {
  const limit = 50;
  let offset = 0;
  const playlists: SpotifyPlaylistItem[] = [];

  while (true) {
    const result = await getSpotifyPlaylists(limit, offset);
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }
    const { items, total } = result.data;
    playlists.push(...items.filter((p) => isOrganizedPlaylist(p.name)));
    if (offset + items.length >= total || items.length === 0) break;
    offset += limit;
  }

  return NextResponse.json({ count: playlists.length, playlists });
}
