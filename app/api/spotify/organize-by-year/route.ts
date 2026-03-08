import {
  createSpotifyPlaylist,
  addTracksToPlaylist,
} from "@/lib/spotify-server";
import { NextRequest, NextResponse } from "next/server";

/** POST /api/spotify/organize-by-year
 * Body: { playlists: { year: string, trackIds: string[] }[] }
 * Creates one playlist per release-year group that has tracks (as shown in the UI).
 * Only years that have at least one track are included — no playlists for empty years or for a continuous year range.
 */
export async function POST(request: NextRequest) {
  let body: { playlists?: { year: string; trackIds: string[] }[] };
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

  // Only include release-year groups that have at least one track (match UI — no playlists for years with no songs)
  const playlistsWithTracks: { year: string; uris: string[] }[] = [];
  for (const entry of raw) {
    if (!entry?.year || !Array.isArray(entry.trackIds)) continue;
    const uris = entry.trackIds
      .filter((id): id is string => typeof id === "string" && id.length > 0)
      .map((id) =>
        id.startsWith("spotify:track:") ? id : `spotify:track:${id}`,
      );
    if (uris.length === 0) continue;
    playlistsWithTracks.push({ year: entry.year, uris });
  }

  if (playlistsWithTracks.length === 0) {
    return NextResponse.json(
      { error: "No playlists with tracks to create" },
      { status: 400 },
    );
  }

  const created: {
    year: string;
    playlistId: string;
    name: string;
    trackCount: number;
  }[] = [];

  for (const { year, uris } of playlistsWithTracks) {
    const name =
      year === "Unknown" ? "Released: Unknown year" : `Released: ${year}`;
    const createResult = await createSpotifyPlaylist({
      name,
      description:
        year === "Unknown"
          ? "Released songs with unknown release date"
          : `Released songs released in ${year}`,
      public: false,
    });

    if ("error" in createResult) {
      console.error("Failed to create playlist:", createResult.error);
      return NextResponse.json(
        { error: createResult.error, created },
        { status: createResult.status },
      );
    }

    // const addResult = await addTracksToPlaylist(createResult.data.id, uris);
    // if ("error" in addResult) {
    //   console.error("Failed to add tracks to playlist:", addResult.error);
    //   return NextResponse.json(
    //     { error: addResult.error, created },
    //     { status: addResult.status },
    //   );
    // }

    created.push({
      year,
      playlistId: createResult.data.id,
      name: createResult.data.name,
      trackCount: uris.length,
    });
  }

  return NextResponse.json({ created });
}
