import { getSpotifyPlaylists } from "@/lib/spotify-server";
import type { SpotifyPlaylistItem } from "@/lib/spotify-types";
import { NextResponse } from "next/server";

/** Match "Released: 2000 - 2010" or "Released: Unknown year" */
const RELEASED_PREFIX = "Released:";

function isReleasedPlaylist(name: string): boolean {
  return name.trimStart().toLowerCase().startsWith(RELEASED_PREFIX.toLowerCase());
}

/** Parse "Released: 2000 - 2010" -> { start: 2000, end: 2010 }, or null for "Released: Unknown year". */
function parseReleasedRange(name: string): { start: number; end: number } | null {
  const trimmed = name.trim();
  if (!trimmed.toLowerCase().startsWith(RELEASED_PREFIX.toLowerCase())) return null;
  const rest = trimmed.slice(RELEASED_PREFIX.length).trim();
  if (rest.toLowerCase().startsWith("unknown")) return null;
  const match = rest.match(/^(\d{4})\s*-\s*(\d{4})$/);
  if (!match) return null;
  const start = parseInt(match[1], 10);
  const end = parseInt(match[2], 10);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
  return { start, end };
}

/**
 * GET /api/spotify/released-playlists
 * Returns the user's playlists whose name starts with "Released:" (decade or unknown),
 * plus the computed year range (min - max) from their names.
 */
export async function GET() {
  const limit = 50;
  let offset = 0;
  const released: SpotifyPlaylistItem[] = [];

  while (true) {
    const result = await getSpotifyPlaylists(limit, offset);
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }
    const { items, total } = result.data;
    released.push(...items.filter((p) => isReleasedPlaylist(p.name)));
    if (offset + items.length >= total || items.length === 0) break;
    offset += limit;
  }

  let minYear: number | null = null;
  let maxYear: number | null = null;
  for (const p of released) {
    const range = parseReleasedRange(p.name);
    if (range) {
      if (minYear === null || range.start < minYear) minYear = range.start;
      if (maxYear === null || range.end > maxYear) maxYear = range.end;
    }
  }

  const rangeLabel =
    minYear !== null && maxYear !== null ? `${minYear} - ${maxYear}` : "0";

  return NextResponse.json({
    playlists: released,
    count: released.length,
    range: rangeLabel,
  });
}
