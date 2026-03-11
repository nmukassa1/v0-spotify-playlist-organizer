import { Home, Library, ListMusic } from "lucide-react"

export const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, href: "/dashboard" },
  { id: "library", label: "Liked Songs", icon: Library, href: "/library" },
  { id: "playlists", label: "My Playlists", icon: ListMusic, href: "/playlists" },
] as const

export type NavViewId = (typeof navItems)[number]["id"]
