import { readFile } from "fs/promises";
import { join } from "path";
import { uploadPlaylistCover } from "@/lib/spotify-server";
import { NextRequest, NextResponse } from "next/server";

const PLAYLIST_IMAGE_MAX_BYTES = 256 * 1024;

/**
 * PUT /api/spotify/playlists/[id]/images/placeholder
 * Upload the default placeholder image (public/placeholder-music.jpg) as the playlist cover.
 * Used when the user creates a playlist without selecting a custom image.
 */
export async function PUT(
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

  let buffer: Buffer;
  try {
    const path = join(process.cwd(), "public", "placeholder-music.jpg");
    buffer = await readFile(path);
  } catch {
    return NextResponse.json(
      { error: "Placeholder image not found" },
      { status: 500 },
    );
  }

  if (buffer.length > PLAYLIST_IMAGE_MAX_BYTES) {
    return NextResponse.json(
      { error: "Placeholder image exceeds 256 KB. Use a smaller placeholder-music.jpg." },
      { status: 400 },
    );
  }

  const base64 = buffer.toString("base64");
  const result = await uploadPlaylistCover(id, base64);

  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return new NextResponse(null, { status: 202 });
}
