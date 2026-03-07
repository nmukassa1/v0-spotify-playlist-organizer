# Sortify — Spotify Playlist Organizer

Organize your liked songs into playlists by artist, features, release year, popularity, and duration. Built with Next.js, Clerk auth, and a modular component structure.

---

## Tech stack

- **Framework:** Next.js 16 (App Router)
- **Auth:** Clerk
- **UI:** React 19, Tailwind CSS 4, Radix UI primitives, Lucide icons
- **Language:** TypeScript

---

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). For auth, configure Clerk via `.env.local` (see [Clerk docs](https://clerk.com/docs)).

---

## Codebase structure

```
├── app/                    # Next.js App Router
├── components/             # React components (by feature + shared UI)
├── lib/                    # Shared data, config, utilities
├── hooks/                  # Custom React hooks
├── public/                 # Static assets
└── styles/                 # Global CSS
```

---

### `app/`

| Path | Purpose |
|------|--------|
| `layout.tsx` | Root layout: ClerkProvider, fonts (Inter, Space Mono), dark theme, Analytics |
| `page.tsx` | Main app: view state, nav handlers, composes sidebar + main content router |
| `globals.css` | Global styles and Tailwind |
| `sign-in/[[...sign-in]]/page.tsx` | Clerk sign-in catch-all |
| `sign-up/[[...sign-up]]/page.tsx` | Clerk sign-up catch-all |
| `api/spotify/token/route.ts` | Returns Spotify access token for current user (e.g. for Web Playback SDK). |
| `api/spotify/status/route.ts` | Returns `{ connected }` for Spotify connection status. |
| `api/spotify/playlists/route.ts` | Proxies Spotify current user playlists (token server-side only). |

**`page.tsx`** holds the single source of truth for:

- `activeView` — which main view is shown (dashboard, library, suggestions, playlists, playlist-detail)
- `selectedSongs` — which songs are selected in the library
- `acceptedPlaylists` — which suggested playlists the user accepted
- `activePlaylistId` — which playlist is open in detail view
- `removedSongs` — per-playlist song removals

It renders `MobileHeader`, `AppSidebar`, and a main content area that switches between the view components.

---

### `components/`

Features are split into folders; each folder has one main view component and smaller, single-purpose components.

#### App shell

| Folder / file | Role |
|---------------|------|
| `app-sidebar/` | Desktop sidebar |
| `app-sidebar/app-sidebar.tsx` | Composes logo, nav, user |
| `app-sidebar/sidebar-logo.tsx` | Sortify logo + tagline |
| `app-sidebar/sidebar-nav.tsx` | Nav items (uses `lib/nav-config`), active state, counts |
| `app-sidebar/sidebar-user.tsx` | User avatar + name (Clerk `UserButton`, `useUser`) |
| `mobile-header/` | Mobile header |
| `mobile-header/mobile-header.tsx` | Logo, user, hamburger menu and nav (same nav config) |

#### Dashboard

| File | Role |
|------|------|
| `dashboard/dashboard-view.tsx` | Entry: stats, breakdown, quick actions, recently added |
| `dashboard/dashboard-welcome.tsx` | “Your Library Overview” heading + description |
| `dashboard/stat-card.tsx` | One stat card (icon, value, label) |
| `dashboard/library-breakdown-row.tsx` | One category row in “Library Breakdown” |
| `dashboard/dashboard-library-breakdown.tsx` | “Library Breakdown” card (5 categories) |
| `dashboard/dashboard-quick-actions.tsx` | “Quick Actions” (Auto-Sort, Browse Songs) |
| `dashboard/dashboard-recently-added.tsx` | “Recently Added” list + rows |
| `dashboard/dashboard-view-types.ts` | `CategorySummaryItem` type |

#### Library (song list)

| File | Role |
|------|------|
| `song-list/song-list.tsx` | Entry: search/sort state, filter/sort logic, composes bar + list |
| `song-list/song-search-bar.tsx` | Search input + sort chips (recent, title, artist, year, popularity) |
| `song-list/song-selection-bar.tsx` | Select all / deselect all + selected count |
| `song-list/song-list-item.tsx` | One selectable song row (cover, title, meta, grip) |

#### Playlist suggestions

| File | Role |
|------|------|
| `playlist-suggestions/playlist-suggestions.tsx` | Entry: intro copy, sections per category |
| `playlist-suggestions/playlist-category-section.tsx` | Category label + grid of suggestion cards |
| `playlist-suggestions/playlist-suggestion-card.tsx` | One card: playlist info, song preview, Accept / Preview |

#### Playlist detail

| File | Role |
|------|------|
| `playlist-detail/playlist-detail.tsx` | Entry: header + active songs + removed section |
| `playlist-detail/playlist-detail-header.tsx` | Back, playlist meta, Shuffle / Preview / Accept |
| `playlist-detail/playlist-detail-song-row.tsx` | One song row with remove button |
| `playlist-detail/removed-songs-section.tsx` | “Removed” list with Restore |

#### My playlists

| File | Role |
|------|------|
| `my-playlists/my-playlists-view.tsx` | Entry: header, category sections or empty state |
| `my-playlists/empty-playlists-state.tsx` | Empty state + “View Suggestions” CTA |
| `my-playlists/my-playlist-card.tsx` | One card: cover, song preview, “View all” / menu |

#### Shared / reusable

| Folder / file | Role |
|---------------|------|
| `song/song-cover.tsx` | Colored cover block + Music icon (sizes: sm, md, lg) |
| `song/song-row-mini.tsx` | Compact song row for previews (title, optional duration/year) |
| `playlist/category-badge.tsx` | Category label badge (uses `lib/category-styles`) |
| `theme-provider.tsx` | Theme provider for app (if used) |
| `ui/` | Radix-based primitives (button, card, input, dialog, etc.) |

---

### `lib/`

| File | Purpose |
|------|---------|
| `mock-data.ts` | Types: `Song`, `SuggestedPlaylist`, `PlaylistCategory`. Data: `songs`, `suggestedPlaylists`, `categoryLabels`, `categoryDescriptions`. |
| `nav-config.ts` | `navItems` (id, label, icon) and `NavViewId` for sidebar and mobile nav. |
| `category-styles.ts` | `categoryIcons`, `categoryIconByKey`, `categoryAccents`, `categoryBadgeStyles` for dashboard and playlist UI. |
| `utils.ts` | `cn()` (e.g. `clsx` + `tailwind-merge`) for class names. |
| `spotify-types.ts` | Shared Spotify API types (playlists response, etc.). Safe to import from client. |
| `spotify-server.ts` | **Server-only.** Gets Spotify access token via Clerk and calls Spotify Web API. Used only in API routes. |

---

## Spotify integration (token + state)

**Access token**

- The access token is **never stored in client state**. It is obtained **only on the server** in `lib/spotify-server.ts` using Clerk’s `getUserOauthAccessToken(userId, "spotify")`.
- Users must connect Spotify via Clerk (OAuth). Configure Spotify as a connected provider in the Clerk dashboard.

**API routes**

| Route | Purpose |
|-------|---------|
| `GET /api/spotify/status` | Returns `{ connected: true }` or `{ connected: false }`. Use to gate UI (e.g. “Connect Spotify” vs show data). |
| `GET /api/spotify/playlists` | Proxies Spotify’s current user playlists. Query: `limit`, `offset`. Token is used only on the server. |
| `GET /api/spotify/token` | Returns `{ accessToken }` for the current user. Use only when the client needs the token (e.g. Web Playback SDK). Prefer proxy routes so the token stays server-side. |

**State management**

- **Server state** (playlists, status) is fetched from these API routes. **SWR** is used so that:
  - Any component can call `useSpotifyPlaylists()` or `useSpotifyStatus()` and get the same cached data (SWR keys are the shared source of truth).
  - No separate React Context is needed for playlists; SWR handles caching and revalidation.
- **Hooks** in `hooks/use-spotify.ts`:
  - `useSpotifyStatus()` — `isConnected`, `isLoading`, `error`, `mutate`
  - `useSpotifyPlaylists(limit?, offset?)` — `playlists`, `total`, `isLoading`, `error`, `mutate`
  - `useSpotify(limit?)` — combines both (connection + playlists) for convenience.
- Use `mutate` / `mutatePlaylists` after creating or updating playlists so the list revalidates.

**Adding more Spotify data**

1. Add a server helper in `lib/spotify-server.ts` (e.g. `getSpotifyLikedSongs()`) that uses `getSpotifyAccessToken()` and `spotifyFetch()`.
2. Add an API route under `app/api/spotify/...` that calls that helper and returns JSON.
3. Add a hook in `hooks/use-spotify.ts` that uses `useSWR` with the new route. All components using that hook will share the same cache.

---

### `hooks/`

- `use-toast.ts` — toast notifications (used by `ui/toast`).
- `use-mobile.ts` — breakpoint hook for responsive behavior.
- `use-spotify.ts` — `useSpotifyStatus()`, `useSpotifyPlaylists()`, `useSpotify()` for Spotify connection and playlists (SWR-backed).

---

## Data flow (high level)

1. **`app/page.tsx`** reads `songs` and `suggestedPlaylists` from `lib/mock-data` and owns all view and selection state.
2. **Navigation** is driven by `activeView` and `setActiveView`; sidebar and mobile header use `lib/nav-config` and call `onViewChange`.
3. **Views** receive only the props they need (songs, playlists, selection sets, callbacks); they do not import mock data directly except where a subcomponent needs a static list.
4. **Shared UI** (e.g. `SongCover`, `CategoryBadge`, `song-row-mini`) lives under `components/song/` and `components/playlist/` and is used by dashboard, song list, suggestions, playlist detail, and my playlists.

Replacing mock data with real Spotify API calls would mean changing `lib/mock-data.ts` (or adding a `lib/spotify.ts`) and keeping the same component interfaces where possible.

---

## Scripts

| Command | Description |
|--------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
