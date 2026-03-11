"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useSpotifyQueryClient, spotifyKeys } from "@/hooks/use-spotify";
import {
  sanitizePlaylistName,
  validatePlaylistName,
  PLAYLIST_NAME_MAX_LENGTH,
} from "@/lib/playlist-name";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreatePlaylistButtonProps {
  /** Called with the new playlist id after successful creation (e.g. to navigate) */
  onCreated?: (id: string) => void;
}

export function CreatePlaylistButton({ onCreated }: CreatePlaylistButtonProps) {
  const queryClient = useSpotifyQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  function openModal() {
    setName("");
    setFieldError(null);
    setSubmitError(null);
    setIsOpen(true);
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setName(v);
    setFieldError(null);
    setSubmitError(null);
    if (v.length > PLAYLIST_NAME_MAX_LENGTH) {
      setFieldError(`Max ${PLAYLIST_NAME_MAX_LENGTH} characters`);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const error = validatePlaylistName(name);
    if (error) {
      setFieldError(error);
      return;
    }
    const sanitized = sanitizePlaylistName(name);
    if (!sanitized) {
      setFieldError("Playlist name is required.");
      return;
    }

    setIsCreating(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/spotify/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: sanitized, public: false }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitError(data.error ?? "Failed to create playlist");
        return;
      }
      await queryClient.invalidateQueries({
        queryKey: spotifyKeys.playlists(50, 0),
      });
      setIsOpen(false);
      const id = data.id;
      if (id) onCreated?.(id);
    } catch {
      setSubmitError("Failed to create playlist");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <>
      <Button type="button" onClick={openModal} className="shrink-0">
        <Plus className="size-4" />
        Create Playlist
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create playlist</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label
                  htmlFor="playlist-name"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Name
                </label>
                <Input
                  id="playlist-name"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="My new playlist"
                  maxLength={PLAYLIST_NAME_MAX_LENGTH + 20}
                  aria-invalid={!!fieldError}
                  aria-describedby={
                    fieldError ? "playlist-name-error" : undefined
                  }
                  disabled={isCreating}
                  autoFocus
                  className="bg-background"
                />
                {fieldError && (
                  <p
                    id="playlist-name-error"
                    className="text-xs text-destructive"
                  >
                    {fieldError}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {name.length} / {PLAYLIST_NAME_MAX_LENGTH} characters. Avoid
                  &lt; &gt; and control characters.
                </p>
              </div>
              {submitError && (
                <p className="text-sm text-destructive">{submitError}</p>
              )}
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || !name.trim()}
              >
                {isCreating ? "Creating…" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
