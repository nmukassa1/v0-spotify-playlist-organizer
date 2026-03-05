import { getSpotifyAccessToken } from "@/lib/spotify-server"
import { NextResponse } from "next/server"

/**
 * GET /api/spotify/status
 * Returns whether the current user has a Spotify connection (no token is sent to the client).
 */
export async function GET() {
  const token = await getSpotifyAccessToken()
  if (!token) {
    return NextResponse.json({ connected: false }, { status: 200 })
  }
  return NextResponse.json({ connected: true })
}
