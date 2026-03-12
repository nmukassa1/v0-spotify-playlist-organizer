/**
 * Client-safe playlist name validation and sanitization (XSS prevention).
 * Mirrors server logic in app/api/spotify/playlists/route.ts.
 */

export const PLAYLIST_NAME_MAX_LENGTH = 100;

/** Unsafe chars for XSS prevention: control chars and HTML/script-related */
const UNSAFE_PATTERN = /[\0-\x1f\x7f<>"`]/g;

/**
 * Sanitize a playlist name: trim, remove unsafe chars, enforce max length.
 */
export function sanitizePlaylistName(value: string): string {
  let s = value.trim();
  s = s.replace(UNSAFE_PATTERN, "");
  return s.slice(0, PLAYLIST_NAME_MAX_LENGTH);
}

/**
 * Validate for display: returns error message or null if valid.
 */
export function validatePlaylistName(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Playlist name is required.";
  const sanitized = sanitizePlaylistName(value);
  if (!sanitized) return "Playlist name cannot be empty or contain invalid characters.";
  if (value.length > PLAYLIST_NAME_MAX_LENGTH)
    return `Name must be ${PLAYLIST_NAME_MAX_LENGTH} characters or fewer.`;
  return null;
}
