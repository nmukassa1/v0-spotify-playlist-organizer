import { getSpotifyPlaylists, createSpotifyPlaylist } from "@/lib/spotify-server"
import { NextRequest, NextResponse } from "next/server"

const PLAYLIST_NAME_MAX_LENGTH = 100

/** Sanitize playlist name for security (XSS prevention): trim, length limit, strip unsafe chars */
function sanitizePlaylistName(value: unknown): string {
  if (value == null || typeof value !== "string") return ""
  let s = value.trim()
  // Remove control chars and characters that could be used in HTML/script injection
  s = s.replace(/[\0-\x1f\x7f<>"`]/g, "")
  return s.slice(0, PLAYLIST_NAME_MAX_LENGTH)
}

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

/**
 * POST /api/spotify/playlists
 * Create a new playlist for the current user. Body: { name: string, description?: string, public?: boolean }
 */
export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    )
  }

  const name = sanitizePlaylistName(
    body && typeof body === "object" && "name" in body ? (body as { name?: unknown }).name : undefined
  )
  if (!name) {
    return NextResponse.json(
      { error: "Playlist name is required and must be non-empty after sanitization" },
      { status: 400 }
    )
  }

  const description =
    body && typeof body === "object" && "description" in body
      ? typeof (body as { description?: unknown }).description === "string"
        ? (body as { description: string }).description.slice(0, 300)
        : undefined
      : undefined
  const isPublic =
    body && typeof body === "object" && "public" in body
      ? Boolean((body as { public?: unknown }).public)
      : false

  const result = await createSpotifyPlaylist({
    name,
    description: description ?? null,
    public: isPublic,
  })

  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status }
    )
  }

  return NextResponse.json(result.data)
}
