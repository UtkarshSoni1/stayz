"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, AlignLeft, CheckCircle, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    name: string;
    bio: string | null;
    image: string | null;
  };
}

/**
 * Lightweight edit-profile modal for the user profile page.
 * Calls the existing PATCH /api/user endpoint (now extended to accept `bio`).
 */
export function EditProfileModal({
  isOpen,
  onClose,
  initialData,
}: EditProfileModalProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData.name);
  const [bio, setBio] = useState(initialData.bio ?? "");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Sync state when modal opens or data changes
  useEffect(() => {
    if (isOpen) {
      setName(initialData.name);
      setBio(initialData.bio ?? "");
      setStatus(null);
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          bio: bio.trim() || null,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setStatus({
          type: "error",
          message: result.error ?? "Failed to update profile.",
        });
        return;
      }

      setStatus({
        type: "success",
        message: "Profile updated!",
      });

      router.refresh();
      setTimeout(() => onClose(), 800);
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-lg bg-[#111111] border border-white/10 text-white rounded-2xl p-6 md:p-8">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-white">
            Edit Profile
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Update your name and bio. Changes are visible on your public profile.
          </DialogDescription>
        </DialogHeader>

        {status && (
          <div
            className={`flex items-start gap-3 p-4 rounded-xl border mb-4 text-sm ${
              status.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-destructive/10 border-destructive/20 text-destructive"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <p>{status.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-2">
            <label
              htmlFor="edit-name"
              className="text-xs font-semibold uppercase tracking-widest text-primary"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-4 h-4 text-muted-foreground" />
              <input
                id="edit-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-[#181818] border border-white/10 focus:border-primary/50 pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-colors text-white"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label
              htmlFor="edit-bio"
              className="text-xs font-semibold uppercase tracking-widest text-primary"
            >
              Bio
            </label>
            <div className="relative">
              <AlignLeft className="absolute left-4 top-3.5 w-4 h-4 text-muted-foreground" />
              <textarea
                id="edit-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell others a bit about yourself..."
                maxLength={300}
                rows={3}
                className="w-full bg-[#181818] border border-white/10 focus:border-primary/50 pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-colors text-white resize-none"
              />
            </div>
            <p className="text-[11px] text-muted-foreground text-right">
              {bio.length}/300
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#222] hover:bg-[#333] text-white py-3 rounded-xl font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:opacity-90 text-primary-foreground py-3 rounded-xl font-bold transition-all disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
