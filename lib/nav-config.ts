import { Home, Library, Sparkles, ListMusic } from "lucide-react"

export const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "library", label: "Liked Songs", icon: Library },
  { id: "suggestions", label: "Organize", icon: Sparkles },
  { id: "playlists", label: "My Playlists", icon: ListMusic },
] as const

export type NavViewId = (typeof navItems)[number]["id"]
