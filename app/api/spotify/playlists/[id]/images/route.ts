import { uploadPlaylistCover } from "@/lib/spotify-server";
import { NextRequest, NextResponse } from "next/server";

const PLAYLIST_IMAGE_MAX_BYTES = 256 * 1024;

/**
 * PUT /api/spotify/playlists/[id]/images
 * Upload a custom cover image for the playlist. Body: { image: string } (base64-encoded JPEG, no data URI prefix).
 * Max 256 KB. Requires Spotify scopes: ugc-image-upload, playlist-modify-public or playlist-modify-private.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "Playlist ID required" },
      { status: 400 },
    );
  }

  let body: { image?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const raw = body?.image;
  if (typeof raw !== "string" || !raw.trim()) {
    return NextResponse.json(
      { error: "Body must include image (base64 string)" },
      { status: 400 },
    );
  }

  const base64 = raw.replace(/^data:image\/\w+;base64,/, "").replace(/\s/g, "");
  const binaryLength = Math.ceil((base64.length * 3) / 4);
  if (binaryLength > PLAYLIST_IMAGE_MAX_BYTES) {
    return NextResponse.json(
      { error: "Image must be 256 KB or smaller" },
      { status: 400 },
    );
  }

  const result = await uploadPlaylistCover(id, base64);

  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return new NextResponse(null, { status: 202 });
}
