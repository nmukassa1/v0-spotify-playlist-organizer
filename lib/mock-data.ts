export interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: string
  addedAt: string
  genre: string
  mood: string
  energy: "low" | "medium" | "high"
  coverColor: string
}

export interface SuggestedPlaylist {
  id: string
  name: string
  description: string
  songCount: number
  color: string
  icon: string
  songs: string[] // song ids
}

export const songs: Song[] = [
  { id: "1", title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", duration: "3:20", addedAt: "2025-12-15", genre: "Synth-pop", mood: "energetic", energy: "high", coverColor: "bg-red-500" },
  { id: "2", title: "Watermelon Sugar", artist: "Harry Styles", album: "Fine Line", duration: "2:54", addedAt: "2025-11-20", genre: "Pop", mood: "happy", energy: "medium", coverColor: "bg-pink-500" },
  { id: "3", title: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", duration: "3:23", addedAt: "2025-10-05", genre: "Disco-pop", mood: "energetic", energy: "high", coverColor: "bg-blue-500" },
  { id: "4", title: "Midnight Rain", artist: "Taylor Swift", album: "Midnights", duration: "2:54", addedAt: "2025-09-18", genre: "Electro-pop", mood: "melancholic", energy: "low", coverColor: "bg-indigo-500" },
  { id: "5", title: "As It Was", artist: "Harry Styles", album: "Harry's House", duration: "2:47", addedAt: "2025-08-22", genre: "Synth-pop", mood: "nostalgic", energy: "medium", coverColor: "bg-yellow-500" },
  { id: "6", title: "Heat Waves", artist: "Glass Animals", album: "Dreamland", duration: "3:59", addedAt: "2025-07-14", genre: "Indie Pop", mood: "dreamy", energy: "medium", coverColor: "bg-orange-500" },
  { id: "7", title: "Neon Lights", artist: "Daft Punk", album: "Random Access Memories", duration: "4:12", addedAt: "2025-06-30", genre: "Electronic", mood: "energetic", energy: "high", coverColor: "bg-cyan-500" },
  { id: "8", title: "Ivy", artist: "Frank Ocean", album: "Blonde", duration: "4:09", addedAt: "2025-06-01", genre: "R&B", mood: "melancholic", energy: "low", coverColor: "bg-green-500" },
  { id: "9", title: "Pink + White", artist: "Frank Ocean", album: "Blonde", duration: "3:04", addedAt: "2025-05-20", genre: "R&B", mood: "dreamy", energy: "low", coverColor: "bg-pink-300" },
  { id: "10", title: "Redbone", artist: "Childish Gambino", album: "Awaken, My Love!", duration: "5:26", addedAt: "2025-05-10", genre: "Funk", mood: "chill", energy: "medium", coverColor: "bg-red-700" },
  { id: "11", title: "Motion Sickness", artist: "Phoebe Bridgers", album: "Stranger in the Alps", duration: "3:48", addedAt: "2025-04-25", genre: "Indie Rock", mood: "melancholic", energy: "medium", coverColor: "bg-stone-500" },
  { id: "12", title: "Gym Class", artist: "Lil Peep", album: "Come Over When You're Sober", duration: "2:28", addedAt: "2025-04-12", genre: "Emo Rap", mood: "nostalgic", energy: "medium", coverColor: "bg-gray-600" },
  { id: "13", title: "After Dark", artist: "Mr.Kitty", album: "Time", duration: "4:26", addedAt: "2025-03-28", genre: "Synthwave", mood: "dark", energy: "medium", coverColor: "bg-slate-800" },
  { id: "14", title: "Electric Feel", artist: "MGMT", album: "Oracular Spectacular", duration: "3:49", addedAt: "2025-03-15", genre: "Psychedelic", mood: "energetic", energy: "high", coverColor: "bg-violet-500" },
  { id: "15", title: "Breathe Deeper", artist: "Tame Impala", album: "The Slow Rush", duration: "6:12", addedAt: "2025-03-01", genre: "Psychedelic Pop", mood: "dreamy", energy: "medium", coverColor: "bg-teal-500" },
  { id: "16", title: "505", artist: "Arctic Monkeys", album: "Favourite Worst Nightmare", duration: "4:13", addedAt: "2025-02-20", genre: "Indie Rock", mood: "dark", energy: "high", coverColor: "bg-zinc-700" },
  { id: "17", title: "Do I Wanna Know?", artist: "Arctic Monkeys", album: "AM", duration: "4:32", addedAt: "2025-02-10", genre: "Indie Rock", mood: "dark", energy: "medium", coverColor: "bg-neutral-700" },
  { id: "18", title: "Lost in Yesterday", artist: "Tame Impala", album: "The Slow Rush", duration: "4:09", addedAt: "2025-01-28", genre: "Psychedelic Pop", mood: "nostalgic", energy: "medium", coverColor: "bg-amber-600" },
  { id: "19", title: "Starboy", artist: "The Weeknd", album: "Starboy", duration: "3:50", addedAt: "2025-01-15", genre: "R&B", mood: "energetic", energy: "high", coverColor: "bg-yellow-600" },
  { id: "20", title: "Chanel", artist: "Frank Ocean", album: "Single", duration: "3:31", addedAt: "2025-01-05", genre: "R&B", mood: "chill", energy: "low", coverColor: "bg-emerald-600" },
  { id: "21", title: "bad guy", artist: "Billie Eilish", album: "WHEN WE ALL FALL ASLEEP", duration: "3:14", addedAt: "2024-12-20", genre: "Electro-pop", mood: "dark", energy: "high", coverColor: "bg-lime-400" },
  { id: "22", title: "Vienna", artist: "Billy Joel", album: "The Stranger", duration: "3:34", addedAt: "2024-12-10", genre: "Soft Rock", mood: "nostalgic", energy: "low", coverColor: "bg-amber-400" },
  { id: "23", title: "Summertime Magic", artist: "Childish Gambino", album: "Summer Pack", duration: "3:14", addedAt: "2024-11-28", genre: "R&B", mood: "happy", energy: "medium", coverColor: "bg-sky-400" },
  { id: "24", title: "Nights", artist: "Frank Ocean", album: "Blonde", duration: "5:07", addedAt: "2024-11-15", genre: "R&B", mood: "melancholic", energy: "medium", coverColor: "bg-blue-800" },
]

export const suggestedPlaylists: SuggestedPlaylist[] = [
  {
    id: "pl-1",
    name: "Late Night Drive",
    description: "Dark, moody tracks for midnight cruising",
    songCount: 6,
    color: "from-blue-600/20 to-indigo-900/20",
    icon: "moon",
    songs: ["4", "13", "16", "17", "21", "24"],
  },
  {
    id: "pl-2",
    name: "Golden Hour",
    description: "Warm, feel-good vibes for sunset moments",
    songCount: 5,
    color: "from-orange-500/20 to-amber-600/20",
    icon: "sun",
    songs: ["2", "5", "6", "23", "22"],
  },
  {
    id: "pl-3",
    name: "High Energy",
    description: "Upbeat bangers to get you moving",
    songCount: 6,
    color: "from-emerald-500/20 to-green-600/20",
    icon: "zap",
    songs: ["1", "3", "7", "14", "19", "21"],
  },
  {
    id: "pl-4",
    name: "Daydream",
    description: "Dreamy, ethereal sounds for deep thought",
    songCount: 5,
    color: "from-pink-500/20 to-rose-600/20",
    icon: "cloud",
    songs: ["9", "15", "18", "8", "6"],
  },
  {
    id: "pl-5",
    name: "Smooth & Slow",
    description: "R&B and soul for winding down",
    songCount: 5,
    color: "from-teal-500/20 to-cyan-600/20",
    icon: "wine",
    songs: ["8", "10", "20", "24", "9"],
  },
]
