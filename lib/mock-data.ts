export interface Song {
  id: string
  title: string
  artist: string
  featuredArtists: string[]
  album: string
  duration: string
  durationSeconds: number
  addedAt: string
  releaseYear: number
  popularity: number // 0-100
  coverColor: string
  /** Optional image URL (e.g. from Spotify album art) */
  imageUrl?: string
}

export type PlaylistCategory = "artist" | "features" | "year" | "popularity" | "duration"

export interface SuggestedPlaylist {
  id: string
  name: string
  description: string
  category: PlaylistCategory
  songCount: number
  color: string
  icon: string
  songs: string[]
}

export const songs: Song[] = [
  { id: "1", title: "Blinding Lights", artist: "The Weeknd", featuredArtists: [], album: "After Hours", duration: "3:20", durationSeconds: 200, addedAt: "2025-12-15", releaseYear: 2020, popularity: 95, coverColor: "bg-red-500" },
  { id: "2", title: "Watermelon Sugar", artist: "Harry Styles", featuredArtists: [], album: "Fine Line", duration: "2:54", durationSeconds: 174, addedAt: "2025-11-20", releaseYear: 2019, popularity: 88, coverColor: "bg-pink-500" },
  { id: "3", title: "Levitating", artist: "Dua Lipa", featuredArtists: ["DaBaby"], album: "Future Nostalgia", duration: "3:23", durationSeconds: 203, addedAt: "2025-10-05", releaseYear: 2020, popularity: 91, coverColor: "bg-blue-500" },
  { id: "4", title: "Midnight Rain", artist: "Taylor Swift", featuredArtists: [], album: "Midnights", duration: "2:54", durationSeconds: 174, addedAt: "2025-09-18", releaseYear: 2022, popularity: 82, coverColor: "bg-indigo-500" },
  { id: "5", title: "As It Was", artist: "Harry Styles", featuredArtists: [], album: "Harry's House", duration: "2:47", durationSeconds: 167, addedAt: "2025-08-22", releaseYear: 2022, popularity: 93, coverColor: "bg-yellow-500" },
  { id: "6", title: "Heat Waves", artist: "Glass Animals", featuredArtists: [], album: "Dreamland", duration: "3:59", durationSeconds: 239, addedAt: "2025-07-14", releaseYear: 2020, popularity: 87, coverColor: "bg-orange-500" },
  { id: "7", title: "HUMBLE.", artist: "Kendrick Lamar", featuredArtists: [], album: "DAMN.", duration: "2:57", durationSeconds: 177, addedAt: "2025-06-30", releaseYear: 2017, popularity: 89, coverColor: "bg-cyan-500" },
  { id: "8", title: "Ivy", artist: "Frank Ocean", featuredArtists: [], album: "Blonde", duration: "4:09", durationSeconds: 249, addedAt: "2025-06-01", releaseYear: 2016, popularity: 72, coverColor: "bg-green-500" },
  { id: "9", title: "Pink + White", artist: "Frank Ocean", featuredArtists: [], album: "Blonde", duration: "3:04", durationSeconds: 184, addedAt: "2025-05-20", releaseYear: 2016, popularity: 78, coverColor: "bg-pink-300" },
  { id: "10", title: "Redbone", artist: "Childish Gambino", featuredArtists: [], album: "Awaken, My Love!", duration: "5:26", durationSeconds: 326, addedAt: "2025-05-10", releaseYear: 2016, popularity: 83, coverColor: "bg-red-700" },
  { id: "11", title: "SICKO MODE", artist: "Travis Scott", featuredArtists: ["Drake"], album: "Astroworld", duration: "5:12", durationSeconds: 312, addedAt: "2025-04-25", releaseYear: 2018, popularity: 90, coverColor: "bg-stone-500" },
  { id: "12", title: "Sunflower", artist: "Post Malone", featuredArtists: ["Swae Lee"], album: "Spider-Man: Into the Spider-Verse", duration: "2:38", durationSeconds: 158, addedAt: "2025-04-12", releaseYear: 2018, popularity: 92, coverColor: "bg-yellow-400" },
  { id: "13", title: "After Dark", artist: "Mr.Kitty", featuredArtists: [], album: "Time", duration: "4:26", durationSeconds: 266, addedAt: "2025-03-28", releaseYear: 2014, popularity: 45, coverColor: "bg-slate-800" },
  { id: "14", title: "Electric Feel", artist: "MGMT", featuredArtists: [], album: "Oracular Spectacular", duration: "3:49", durationSeconds: 229, addedAt: "2025-03-15", releaseYear: 2007, popularity: 76, coverColor: "bg-violet-500" },
  { id: "15", title: "Breathe Deeper", artist: "Tame Impala", featuredArtists: [], album: "The Slow Rush", duration: "6:12", durationSeconds: 372, addedAt: "2025-03-01", releaseYear: 2020, popularity: 62, coverColor: "bg-teal-500" },
  { id: "16", title: "505", artist: "Arctic Monkeys", featuredArtists: [], album: "Favourite Worst Nightmare", duration: "4:13", durationSeconds: 253, addedAt: "2025-02-20", releaseYear: 2007, popularity: 85, coverColor: "bg-zinc-700" },
  { id: "17", title: "Do I Wanna Know?", artist: "Arctic Monkeys", featuredArtists: [], album: "AM", duration: "4:32", durationSeconds: 272, addedAt: "2025-02-10", releaseYear: 2013, popularity: 88, coverColor: "bg-neutral-700" },
  { id: "18", title: "Lost in Yesterday", artist: "Tame Impala", featuredArtists: [], album: "The Slow Rush", duration: "4:09", durationSeconds: 249, addedAt: "2025-01-28", releaseYear: 2020, popularity: 68, coverColor: "bg-amber-600" },
  { id: "19", title: "Starboy", artist: "The Weeknd", featuredArtists: ["Daft Punk"], album: "Starboy", duration: "3:50", durationSeconds: 230, addedAt: "2025-01-15", releaseYear: 2016, popularity: 91, coverColor: "bg-yellow-600" },
  { id: "20", title: "Chanel", artist: "Frank Ocean", featuredArtists: [], album: "Single", duration: "3:31", durationSeconds: 211, addedAt: "2025-01-05", releaseYear: 2017, popularity: 70, coverColor: "bg-emerald-600" },
  { id: "21", title: "bad guy", artist: "Billie Eilish", featuredArtists: [], album: "WHEN WE ALL FALL ASLEEP", duration: "3:14", durationSeconds: 194, addedAt: "2024-12-20", releaseYear: 2019, popularity: 94, coverColor: "bg-lime-400" },
  { id: "22", title: "Vienna", artist: "Billy Joel", featuredArtists: [], album: "The Stranger", duration: "3:34", durationSeconds: 214, addedAt: "2024-12-10", releaseYear: 1977, popularity: 80, coverColor: "bg-amber-400" },
  { id: "23", title: "Gorgeous", artist: "Kanye West", featuredArtists: ["Kid Cudi", "Raekwon"], album: "My Beautiful Dark Twisted Fantasy", duration: "5:57", durationSeconds: 357, addedAt: "2024-11-28", releaseYear: 2010, popularity: 73, coverColor: "bg-sky-400" },
  { id: "24", title: "Nights", artist: "Frank Ocean", featuredArtists: [], album: "Blonde", duration: "5:07", durationSeconds: 307, addedAt: "2024-11-15", releaseYear: 2016, popularity: 81, coverColor: "bg-blue-800" },
  { id: "25", title: "Love Galore", artist: "SZA", featuredArtists: ["Travis Scott"], album: "Ctrl", duration: "4:33", durationSeconds: 273, addedAt: "2024-11-01", releaseYear: 2017, popularity: 79, coverColor: "bg-rose-500" },
  { id: "26", title: "Runaway", artist: "Kanye West", featuredArtists: ["Pusha T"], album: "My Beautiful Dark Twisted Fantasy", duration: "9:07", durationSeconds: 547, addedAt: "2024-10-20", releaseYear: 2010, popularity: 84, coverColor: "bg-red-600" },
  { id: "27", title: "Thinkin Bout You", artist: "Frank Ocean", featuredArtists: [], album: "Channel Orange", duration: "3:20", durationSeconds: 200, addedAt: "2024-10-10", releaseYear: 2012, popularity: 82, coverColor: "bg-orange-400" },
  { id: "28", title: "Save Your Tears", artist: "The Weeknd", featuredArtists: ["Ariana Grande"], album: "After Hours", duration: "3:35", durationSeconds: 215, addedAt: "2024-09-28", releaseYear: 2020, popularity: 93, coverColor: "bg-fuchsia-500" },
]

export const suggestedPlaylists: SuggestedPlaylist[] = [
  // Artist playlists
  {
    id: "pl-artist-1",
    name: "Frank Ocean Collection",
    description: "All your Frank Ocean tracks in one place",
    category: "artist",
    songCount: 5,
    color: "from-green-600/20 to-emerald-800/20",
    icon: "user",
    songs: ["8", "9", "20", "24", "27"],
  },
  {
    id: "pl-artist-2",
    name: "The Weeknd Collection",
    description: "Every Weeknd track from your liked songs",
    category: "artist",
    songCount: 3,
    color: "from-red-600/20 to-rose-800/20",
    icon: "user",
    songs: ["1", "19", "28"],
  },
  {
    id: "pl-artist-3",
    name: "Arctic Monkeys Collection",
    description: "Your Arctic Monkeys favourites together",
    category: "artist",
    songCount: 2,
    color: "from-zinc-600/20 to-neutral-800/20",
    icon: "user",
    songs: ["16", "17"],
  },
  // Features playlist
  {
    id: "pl-feat-1",
    name: "Features & Collabs",
    description: "All songs with featured artists",
    category: "features",
    songCount: 7,
    color: "from-blue-500/20 to-indigo-700/20",
    icon: "users",
    songs: ["3", "11", "12", "19", "23", "25", "26", "28"],
  },
  // Year playlists
  {
    id: "pl-year-1",
    name: "2020 Releases",
    description: "Songs released in 2020",
    category: "year",
    songCount: 5,
    color: "from-amber-500/20 to-orange-700/20",
    icon: "calendar",
    songs: ["1", "3", "6", "15", "18", "28"],
  },
  {
    id: "pl-year-2",
    name: "2016 Releases",
    description: "Songs released in 2016",
    category: "year",
    songCount: 4,
    color: "from-cyan-500/20 to-teal-700/20",
    icon: "calendar",
    songs: ["8", "9", "10", "19", "24"],
  },
  // Popularity playlists
  {
    id: "pl-pop-1",
    name: "Top Hits (90+)",
    description: "Your most popular bangers by stream count",
    category: "popularity",
    songCount: 7,
    color: "from-yellow-500/20 to-amber-700/20",
    icon: "trending",
    songs: ["1", "3", "5", "11", "12", "21", "28"],
  },
  {
    id: "pl-pop-2",
    name: "Hidden Gems",
    description: "Underrated tracks with lower popularity",
    category: "popularity",
    songCount: 4,
    color: "from-purple-500/20 to-violet-700/20",
    icon: "gem",
    songs: ["13", "15", "18", "20"],
  },
  // Duration playlists
  {
    id: "pl-dur-1",
    name: "Extended Jams (5+ min)",
    description: "Longer tracks for when you want to sink in",
    category: "duration",
    songCount: 5,
    color: "from-teal-500/20 to-cyan-700/20",
    icon: "clock",
    songs: ["10", "11", "15", "23", "24", "26"],
  },
  {
    id: "pl-dur-2",
    name: "Quick Hits (Under 3 min)",
    description: "Short and sweet bangers",
    category: "duration",
    songCount: 4,
    color: "from-pink-500/20 to-rose-700/20",
    icon: "zap",
    songs: ["2", "5", "7", "12"],
  },
]

export const categoryLabels: Record<PlaylistCategory, string> = {
  artist: "By Artist",
  features: "Features & Collabs",
  year: "By Release Year",
  popularity: "By Popularity",
  duration: "By Duration",
}

export const categoryDescriptions: Record<PlaylistCategory, string> = {
  artist: "Playlists grouped by a single artist",
  features: "Songs with featured / collaborating artists",
  year: "Playlists grouped by release year",
  popularity: "Playlists grouped by popularity tier",
  duration: "Playlists grouped by track length",
}
