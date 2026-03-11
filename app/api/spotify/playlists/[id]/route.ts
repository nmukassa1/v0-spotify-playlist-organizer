import { getSpotifyPlaylistWithTracks } from "@/lib/spotify-server";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/spotify/playlists/[id]
 * Fetches a single playlist with all its tracks.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "Playlist ID required" },
      { status: 400 },
    );
  }

  const result = await getSpotifyPlaylistWithTracks(id);

  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json(result.data);
}
