import { getSpotifyPlaylists } from "@/lib/spotify-server"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/spotify/playlists
 * Proxies Spotify's current user playlists. Token is used only on the server.
 * Query: limit (default 50), offset (default 0)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 50))
  const offset = Math.max(0, Number(searchParams.get("offset")) || 0)

  const result = await getSpotifyPlaylists(limit, offset)

  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status }
    )
  }

  return NextResponse.json(result.data)
}
