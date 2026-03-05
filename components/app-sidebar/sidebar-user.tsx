"use client"

import { UserButton } from "@clerk/nextjs"
import { useUser } from "@clerk/nextjs"

export function SidebarUser() {
  const { user } = useUser()
  return (
    <div className="border-t border-sidebar-border px-4 py-4">
      <div className="flex items-center gap-3">
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-9 w-9",
            },
          }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-sidebar-foreground truncate">
            {user?.firstName || user?.username || "User"}
          </p>
          <p className="text-[11px] text-muted-foreground truncate">
            {user?.primaryEmailAddress?.emailAddress || "Spotify Connected"}
          </p>
        </div>
      </div>
    </div>
  )
}
