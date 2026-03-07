"use client"

interface DashboardWelcomeProps {
  songCount: number
}

export function DashboardWelcome({ songCount }: DashboardWelcomeProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground text-balance">Your Library Overview</h2>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
        {songCount} liked songs ready to organize by artist, features, year, popularity, or duration.
      </p>
    </div>
  )
}
