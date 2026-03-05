import { getSpotifyAccessToken } from "@/lib/spotify-server"
import { NextResponse } from "next/server"

/**
 * GET /api/spotify/token
 * Returns the user's Spotify access token (e.g. for Web Playback SDK).
 * Prefer using /api/spotify/playlists and other proxy routes so the token stays server-side.
 */
export async function GET() {
  try {
    const accessToken = await getSpotifyAccessToken()

    if (!accessToken) {
      return NextResponse.json(
        { error: "No Spotify token found. Please reconnect your Spotify account." },
        { status: 404 }
      )
    }

    return NextResponse.json({ accessToken })
  } catch (error) {
    console.error("Failed to get Spotify token:", error)
    return NextResponse.json(
      { error: "Failed to retrieve Spotify access token" },
      { status: 500 }
    )
  }
}
