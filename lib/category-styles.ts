import type { PlaylistCategory } from "@/lib/mock-data"
import type { ComponentType } from "react"
import { User, Users, Calendar, Star, Timer, Zap } from "lucide-react"

export const categoryIcons: Record<PlaylistCategory, ComponentType<{ className?: string }>> = {
  artist: User,
  features: Users,
  year: Calendar,
  popularity: Star,
  duration: Timer,
}

export const categoryIconByKey: Record<string, ComponentType<{ className?: string }>> = {
  user: User,
  users: Users,
  calendar: Calendar,
  trending: Star,
  gem: Star,
  clock: Timer,
  zap: Zap,
}

export const categoryAccents: Record<PlaylistCategory, { text: string; bg: string }> = {
  artist: { text: "text-chart-1", bg: "bg-chart-1/10" },
  features: { text: "text-chart-2", bg: "bg-chart-2/10" },
  year: { text: "text-chart-3", bg: "bg-chart-3/10" },
  popularity: { text: "text-chart-5", bg: "bg-chart-5/10" },
  duration: { text: "text-chart-4", bg: "bg-chart-4/10" },
}

export const categoryBadgeStyles: Record<PlaylistCategory, { bg: string; text: string }> = {
  artist: { bg: "bg-chart-1/15", text: "text-chart-1" },
  features: { bg: "bg-chart-2/15", text: "text-chart-2" },
  year: { bg: "bg-chart-3/15", text: "text-chart-3" },
  popularity: { bg: "bg-chart-5/15", text: "text-chart-5" },
  duration: { bg: "bg-chart-4/15", text: "text-chart-4" },
}
