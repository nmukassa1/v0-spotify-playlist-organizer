"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Music, Users } from "lucide-react";
import { OrganizeByYearPreviewModal } from "@/components/dashboard/organize-by-year-preview-modal";
import { OrganizeByArtistFocusPreviewModal } from "@/components/dashboard/organize-by-artist-focus-preview-modal";

interface QuickActionItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

function QuickActionItem({
  title,
  description,
  icon,
  href,
  onClick,
  variant = "secondary",
}: QuickActionItemProps) {
  const isPrimary = variant === "primary";
  const content = (
    <>
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          isPrimary ? "bg-primary" : "bg-secondary"
        }`}
      >
        <span
          className={isPrimary ? "text-primary-foreground" : "text-foreground"}
        >
          {icon}
        </span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 rounded-lg p-4 text-left transition-colors group ${
          isPrimary
            ? "bg-primary/10 hover:bg-primary/15"
            : "bg-secondary/50 hover:bg-secondary"
        }`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg p-4 text-left transition-colors group cursor-pointer ${
        isPrimary
          ? "bg-primary/10 hover:bg-primary/15"
          : "bg-secondary/50 hover:bg-secondary"
      }`}
    >
      {content}
    </button>
  );
}

interface DashboardQuickActionsProps {
  libraryHref: string;
}

export function DashboardQuickActions({
  libraryHref,
}: DashboardQuickActionsProps) {
  const [yearPreviewOpen, setYearPreviewOpen] = useState(false);
  const [artistFocusPreviewOpen, setArtistFocusPreviewOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Quick Actions
      </h3>
      <div className="flex flex-col gap-2">
        <QuickActionItem
          title="Organize by decade"
          description="Create playlists by 10-year release range"
          icon={<Calendar className="h-4 w-4" />}
          onClick={() => setYearPreviewOpen(true)}
          variant="primary"
        />
        <QuickActionItem
          title="Organize by solo vs features"
          description="Split tracks: solo artist or with collaborators"
          icon={<Users className="h-4 w-4" />}
          onClick={() => setArtistFocusPreviewOpen(true)}
        />
        <QuickActionItem
          title="Browse All Songs"
          description="View and manually pick tracks"
          icon={<Music className="h-4 w-4" />}
          href={libraryHref}
        />
      </div>
      <OrganizeByYearPreviewModal
        open={yearPreviewOpen}
        onOpenChange={setYearPreviewOpen}
      />
      <OrganizeByArtistFocusPreviewModal
        open={artistFocusPreviewOpen}
        onOpenChange={setArtistFocusPreviewOpen}
      />
    </div>
  );
}
