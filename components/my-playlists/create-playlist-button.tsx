"use client";

import { useState, useRef } from "react";
import { Plus, ImageIcon, X } from "lucide-react";
import { useSpotifyQueryClient, spotifyKeys } from "@/hooks/use-spotify";
import {
  sanitizePlaylistName,
  validatePlaylistName,
  PLAYLIST_NAME_MAX_LENGTH,
} from "@/lib/playlist-name";
import { fileToCoverBase64 } from "@/lib/playlist-cover";
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
  const [coverBase64, setCoverBase64] = useState<string | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function openModal() {
    setName("");
    setCoverBase64(null);
    setCoverError(null);
    setFieldError(null);
    setSubmitError(null);
    setIsOpen(true);
  }

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    setCoverError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setCoverError("Please choose a JPEG or PNG image.");
      return;
    }
    const base64 = await fileToCoverBase64(file);
    if (base64) {
      setCoverBase64(base64);
    } else {
      setCoverError("Could not process image. Use a smaller or simpler image.");
    }
  }

  function clearCover() {
    setCoverBase64(null);
    setCoverError(null);
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
      const id = data.id;
      if (id && coverBase64) {
        const imgRes = await fetch(`/api/spotify/playlists/${id}/images`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: coverBase64 }),
        });
        if (!imgRes.ok) {
          const errData = await imgRes.json().catch(() => ({}));
          setSubmitError(errData.error ?? "Playlist created but cover upload failed.");
          return;
        }
      }
      setIsOpen(false);
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

              <div className="grid gap-2">
                <span className="text-sm font-medium leading-none">Cover image</span>
                <div className="flex items-start gap-3">
                  {coverBase64 ? (
                    <div className="relative shrink-0">
                      <img
                        src={`data:image/jpeg;base64,${coverBase64}`}
                        alt="Cover preview"
                        className="h-24 w-24 rounded-lg border border-border object-cover"
                      />
                      <button
                        type="button"
                        onClick={clearCover}
                        className="absolute -top-1.5 -right-1.5 rounded-full bg-muted p-1 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        aria-label="Remove cover"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-muted-foreground hover:bg-muted/50 transition-colors">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleCoverChange}
                        className="sr-only"
                        disabled={isCreating}
                      />
                      <ImageIcon className="h-8 w-8" />
                      <span className="mt-1 text-[10px]">Add</span>
                    </label>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Optional. JPEG or PNG, max 256 KB (resized automatically).
                  </p>
                </div>
                {coverError && (
                  <p className="text-xs text-destructive">{coverError}</p>
                )}
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
