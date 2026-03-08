import {
  getSpotifyPlaylists,
  getPlaylistTrackIds,
  getAllLikedTracks,
  addTracksToPlaylist,
} from "@/lib/spotify-server";
import type { SpotifyPlaylistItem, SpotifySavedTrack } from "@/lib/spotify-types";
import { NextResponse } from "next/server";

const RELEASED_PREFIX = "Released:";

function isReleasedPlaylist(name: string): boolean {
  return name.trimStart().toLowerCase().startsWith(RELEASED_PREFIX.toLowerCase());
}

/** Decade start from release_date (e.g. "2020-03-14" -> "2020"). */
function getDecadeStart(releaseDate: string | undefined): string | null {
  if (!releaseDate || typeof releaseDate !== "string") return null;
  const year = releaseDate.slice(0, 4);
  if (!/^\d{4}$/.test(year)) return null;
  const y = Number(year);
  if (!Number.isFinite(y)) return null;
  return String(Math.floor(y / 10) * 10);
}

/** Format "2000" -> "2000 - 2010". */
function formatDecadeRange(decadeStart: string): string {
  const start = Number(decadeStart);
  if (!Number.isFinite(start)) return decadeStart;
  return `${start} - ${start + 10}`;
}

/**
 * POST /api/spotify/organize-by-year/refresh
 *
 * Finds liked songs that are not in any "Released:" playlist and adds them to the
 * correct decade playlist. Uses:
 * - Set for O(1) "already in a released playlist" checks
 * - Single pass over liked tracks to compute missing + group by decade
 * - Parallel fetch of all released-playlist track IDs
 * - Batched adds (100 tracks per request)
 */
export async function POST() {
  // 1. Collect all "Released:" playlists (paginated)
  const releasedPlaylists: SpotifyPlaylistItem[] = [];
  let offset = 0;
  const limit = 50;

  for (;;) {
    const result = await getSpotifyPlaylists(limit, offset);
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }
    const { items, total } = result.data;
    for (const p of items) {
      if (isReleasedPlaylist(p.name)) releasedPlaylists.push(p);
    }
    if (offset + items.length >= total || items.length === 0) break;
    offset += limit;
  }

  if (releasedPlaylists.length === 0) {
    return NextResponse.json({
      added: {},
      totalAdded: 0,
      message: "No Released playlists found. Create them first from the modal.",
    });
  }

  // 2. Build a single Set of every track ID already in any Released playlist (parallel fetches)
  const tracksInReleased = new Set<string>();
  const idResults = await Promise.all(
    releasedPlaylists.map((p) => getPlaylistTrackIds(p.id)),
  );
  for (const res of idResults) {
    if ("error" in res) {
      return NextResponse.json(
        { error: res.error },
        { status: res.status },
      );
    }
    for (const id of res.data) tracksInReleased.add(id);
  }

  // 3. Fetch all liked tracks
  const likedResult = await getAllLikedTracks();
  if ("error" in likedResult) {
    return NextResponse.json(
      { error: likedResult.error },
      { status: likedResult.status },
    );
  }
  const likedTracks = likedResult.data;

  // 4. Single pass: filter to missing and group by decade (Map<yearLabel, trackIds[]>)
  const missingByDecade = new Map<string, string[]>();

  for (const saved of likedTracks as SpotifySavedTrack[]) {
    const id = saved.track?.id;
    if (!id || tracksInReleased.has(id)) continue;

    const decadeStart = getDecadeStart(saved.track?.album?.release_date);
    if (!decadeStart) continue; // skip Unknown

    const yearLabel = formatDecadeRange(decadeStart);
    if (!missingByDecade.has(yearLabel)) missingByDecade.set(yearLabel, []);
    missingByDecade.get(yearLabel)!.push(id);
  }

  // 5. Index Released playlists by year label for O(1) lookup
  const playlistsByYearLabel = new Map<string, SpotifyPlaylistItem>();
  for (const p of releasedPlaylists) {
    const rest = p.name.trim().slice(RELEASED_PREFIX.length).trim();
    if (rest.toLowerCase().startsWith("unknown")) continue;
    const match = rest.match(/^(\d{4})\s*-\s*(\d{4})$/);
    if (match) {
      const label = `${match[1]} - ${match[2]}`;
      playlistsByYearLabel.set(label, p);
    }
  }

  // 6. Add missing tracks to the right playlist (batches of 100)
  const added: Record<string, number> = {};
  const BATCH = 100;

  for (const [yearLabel, trackIds] of missingByDecade) {
    const playlist = playlistsByYearLabel.get(yearLabel);
    if (!playlist || trackIds.length === 0) continue;

    const uris = trackIds.map((id) =>
      id.startsWith("spotify:track:") ? id : `spotify:track:${id}`,
    );
    let addedCount = 0;

    for (let i = 0; i < uris.length; i += BATCH) {
      const chunk = uris.slice(i, i + BATCH);
      const addResult = await addTracksToPlaylist(playlist.id, chunk);
      if ("error" in addResult) {
        return NextResponse.json(
          { error: addResult.error, added, totalAdded: Object.values(added).reduce((a, b) => a + b, 0) },
          { status: addResult.status },
        );
      }
      addedCount += chunk.length;
    }

    added[yearLabel] = (added[yearLabel] ?? 0) + addedCount;
  }

  const totalAdded = Object.values(added).reduce((a, b) => a + b, 0);

  return NextResponse.json({
    added,
    totalAdded,
    message:
      totalAdded > 0
        ? `Added ${totalAdded} track${totalAdded !== 1 ? "s" : ""} to ${Object.keys(added).length} playlist(s).`
        : "All liked songs are already in their decade playlists.",
  });
}
