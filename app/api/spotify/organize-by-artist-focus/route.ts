import {
  createSpotifyPlaylist,
  addTracksToPlaylist,
} from "@/lib/spotify-server";
import { NextRequest, NextResponse } from "next/server";

type ArtistFocusBucketId = "solo" | "with-features";

interface ArtistFocusPlaylistInput {
  bucketId: ArtistFocusBucketId;
  label: string;
  trackIds: string[];
}

interface ArtistFocusPlaylistPayload {
  playlists?: ArtistFocusPlaylistInput[];
}

/** POST /api/spotify/organize-by-artist-focus
 * Body: { playlists: { bucketId: "solo" | "with-features"; label: string; trackIds: string[] }[] }
 * Creates up to two playlists:
 * - "Artist Focus: Solo tracks"
 * - "Artist Focus: With features"
 * Only buckets with at least one track are created.
 */
export async function POST(request: NextRequest) {
  let body: ArtistFocusPlaylistPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const raw = body.playlists;
  if (!Array.isArray(raw) || raw.length === 0) {
    return NextResponse.json(
      { error: "Body must include a non-empty playlists array" },
      { status: 400 },
    );
  }

  const validBucketIds: ArtistFocusBucketId[] = ["solo", "with-features"];

  const playlistsWithTracks: {
    bucketId: ArtistFocusBucketId;
    label: string;
    uris: string[];
  }[] = [];

  for (const entry of raw) {
    if (!entry) continue;
    const { bucketId, label, trackIds } = entry;
    if (!validBucketIds.includes(bucketId) || !label || !Array.isArray(trackIds)) {
      continue;
    }
    const uris = trackIds
      .filter((id): id is string => typeof id === "string" && id.length > 0)
      .map((id) =>
        id.startsWith("spotify:track:") ? id : `spotify:track:${id}`,
      );
    if (uris.length === 0) continue;
    playlistsWithTracks.push({ bucketId, label, uris });
  }

  if (playlistsWithTracks.length === 0) {
    return NextResponse.json(
      { error: "No playlists with tracks to create" },
      { status: 400 },
    );
  }

  const created: {
    bucketId: ArtistFocusBucketId;
    playlistId: string;
    name: string;
    trackCount: number;
  }[] = [];

  for (const { bucketId, label, uris } of playlistsWithTracks) {
    const name = `Artist Focus: ${label}`;
    const description =
      bucketId === "solo"
        ? "Solo tracks from your liked songs (single primary artist, no features)."
        : "Tracks with featured artists or collaborators from your liked songs.";

    const createResult = await createSpotifyPlaylist({
      name,
      description,
      public: false,
    });

    if ("error" in createResult) {
      console.error("Failed to create artist focus playlist:", createResult.error);
      return NextResponse.json(
        { error: createResult.error, created },
        { status: createResult.status },
      );
    }

    const addResult = await addTracksToPlaylist(createResult.data.id, uris);
    if ("error" in addResult) {
      console.error("Failed to add tracks to artist focus playlist:", addResult.error);
      return NextResponse.json(
        { error: addResult.error, created },
        { status: addResult.status },
      );
    }

    created.push({
      bucketId,
      playlistId: createResult.data.id,
      name: createResult.data.name,
      trackCount: uris.length,
    });
  }

  return NextResponse.json({ created });
}

