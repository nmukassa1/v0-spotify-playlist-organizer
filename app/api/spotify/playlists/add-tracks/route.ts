import { NextRequest, NextResponse } from "next/server"
import { addTracksToPlaylist } from "@/lib/spotify-server"

interface AddTracksBody {
  playlistIds?: string[]
  uris?: string[]
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as AddTracksBody
  const playlistIds = body.playlistIds ?? []
  const uris = body.uris ?? []

  if (!Array.isArray(playlistIds) || playlistIds.length === 0) {
    return NextResponse.json(
      { error: "playlistIds must be a non-empty array" },
      { status: 400 }
    )
  }

  if (!Array.isArray(uris) || uris.length === 0) {
    return NextResponse.json(
      { error: "uris must be a non-empty array" },
      { status: 400 }
    )
  }

  const uniqueUris = Array.from(new Set(uris))

  for (const playlistId of playlistIds) {
    const result = await addTracksToPlaylist(playlistId, uniqueUris)
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error, playlistId },
        { status: result.status }
      )
    }
  }

  return NextResponse.json({ ok: true })
}

