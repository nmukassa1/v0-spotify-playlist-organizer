"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Music,
  Sparkles,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface QuickActionItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary";
}

function QuickActionItem({
  title,
  description,
  icon,
  href,
  variant = "secondary",
}: QuickActionItemProps) {
  const isPrimary = variant === "primary";
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg p-4 text-left transition-colors group ${
        isPrimary
          ? "bg-primary/10 hover:bg-primary/15"
          : "bg-secondary/50 hover:bg-secondary"
      }`}
    >
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
    </Link>
  );
}

interface DashboardQuickActionsProps {
  suggestionsHref: string;
  libraryHref: string;
}

export function DashboardQuickActions({
  suggestionsHref,
  libraryHref,
}: DashboardQuickActionsProps) {
  const [autoSortOpen, setAutoSortOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Quick Actions
      </h3>
      <div className="flex flex-col gap-2">
        <Dialog open={autoSortOpen} onOpenChange={setAutoSortOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-3 rounded-lg p-4 text-left transition-colors group w-full bg-primary/10 hover:bg-primary/15 cursor-pointer"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Auto-Sort My Library
                </p>
                <p className="text-xs text-muted-foreground">
                  Organize by artist, year, popularity & more
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Auto-organize songs</DialogTitle>
              <DialogDescription>
                Choose how you want to organize your library. We&apos;ll create
                or update playlists based on your selection.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2 py-2">
              <Button
                variant="outline"
                className="h-auto justify-start gap-3 py-3 cursor-pointer"
                onClick={() => {
                  /* TODO: organize by year */
                  setAutoSortOpen(false);
                }}
              >
                <Calendar className="h-4 w-4 shrink-0" />
                <span>By year</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto justify-start gap-3 py-3 cursor-pointer"
                onClick={() => {
                  /* TODO: organize by popularity */
                  setAutoSortOpen(false);
                }}
              >
                <TrendingUp className="h-4 w-4 shrink-0" />
                <span>By popularity</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto justify-start gap-3 py-3 cursor-pointer"
                onClick={() => {
                  /* TODO: organize by artist */
                  setAutoSortOpen(false);
                }}
              >
                <User className="h-4 w-4 shrink-0" />
                <span>By artist</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto justify-start gap-3 py-3 cursor-pointer"
                onClick={() => {
                  /* TODO: organize by featured artists */
                  setAutoSortOpen(false);
                }}
              >
                <Users className="h-4 w-4 shrink-0" />
                <span>By featured artists</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <QuickActionItem
          title="Browse All Songs"
          description="View and manually pick tracks"
          icon={<Music className="h-4 w-4" />}
          href={libraryHref}
          variant="secondary"
        />
      </div>
    </div>
  );
}
