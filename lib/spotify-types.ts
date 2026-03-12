/**
 * Shared Spotify API types (safe to import from client).
 * Server-side fetching is in lib/spotify-server.ts.
 */

export interface SpotifyPlaylistItem {
  id: string;
  uri: string;
  name: string;
  description: string | null;
  public: boolean;
  items: { href: string; total: number };
  images: Array<{ url: string; height: number | null; width: number | null }>;
  owner: { display_name?: string; id: string };
}

export interface SpotifyPlaylistsResponse {
  href: string;
  items: SpotifyPlaylistItem[];
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
  total: number;
}

/** Artist in a track */
export interface SpotifyArtist {
  id: string;
  name: string;
}

/** Album in a track */
export interface SpotifyAlbum {
  id: string;
  name: string;
  release_date?: string;
  images: Array<{ url: string; height: number | null; width: number | null }>;
}

/** Full track object from Spotify (simplified) */
export interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  popularity: number;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  track_number?: number;
}

/** Saved track: when it was added + the track */
export interface SpotifySavedTrack {
  added_at: string;
  track: SpotifyTrack;
}

export interface SpotifySavedTracksResponse {
  href: string;
  items: SpotifySavedTrack[];
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
  total: number;
}
