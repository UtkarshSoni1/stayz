"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, MessageCircle, CheckCircle, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  phone: string | null;
  whatsappNumber: string | null;
  bio?: string | null;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUser: UserProfile;
}

export function EditProfileModal({ isOpen, onClose, initialUser }: EditProfileModalProps) {
  const router = useRouter();
  const [name, setName] = useState(initialUser.name ?? "");
  const [phone, setPhone] = useState(initialUser.phone ?? "");
  const [whatsappNumber, setWhatsappNumber] = useState(initialUser.whatsappNumber ?? "");
  const [bio, setBio] = useState(initialUser.bio ?? "");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Sync state with initialUser when modal opens or initialUser updates
  useEffect(() => {
    if (isOpen) {
      setName(initialUser.name ?? "");
      setPhone(initialUser.phone ?? "");
      setWhatsappNumber(initialUser.whatsappNumber ?? "");
      setBio(initialUser.bio ?? "");
      setStatus(null);
    }
  }, [isOpen, initialUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim() || null,
          whatsappNumber: whatsappNumber.trim() || null,
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
        message: "Profile updated successfully!",
      });

      router.refresh();
      // Delay closing slightly so user can see the success state
      setTimeout(() => {
        onClose();
      }, 1000);
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
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-lg bg-[#111111] border border-white/10 text-white rounded-2xl p-6 md:p-8">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-white">Profile Settings</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Update your contact information. These details will be visible to guests who want to enquire about your active listings.
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
          {/* Email (Readonly) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Email Address (Cannot be changed)
            </label>
            <input
              type="text"
              disabled
              value={initialUser.email ?? ""}
              className="w-full bg-[#1c1c1c] border border-white/5 text-muted-foreground px-4 py-3 rounded-xl text-sm cursor-not-allowed outline-none"
            />
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <label htmlFor="modal-name" className="text-xs font-semibold uppercase tracking-widest text-primary">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-4 h-4 text-muted-foreground" />
              <input
                id="modal-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-[#181818] border border-white/10 focus:border-primary/50 pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-colors text-white"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label htmlFor="modal-bio" className="text-xs font-semibold uppercase tracking-widest text-primary">
              Bio / Description
            </label>
            <textarea
              id="modal-bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell guests about yourself or your properties..."
              className="w-full bg-[#181818] border border-white/10 focus:border-primary/50 px-4 py-3 rounded-xl text-sm outline-none transition-colors text-white resize-none"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label htmlFor="modal-phone" className="text-xs font-semibold uppercase tracking-widest text-primary">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 w-4 h-4 text-muted-foreground" />
              <input
                id="modal-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-[#181818] border border-white/10 focus:border-primary/50 pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-colors text-white"
              />
            </div>
            <p className="text-[11px] text-muted-foreground leading-normal">
              Allows guests to call you directly by clicking the &quot;Call Owner&quot; CTA.
            </p>
          </div>

          {/* WhatsApp Number */}
          <div className="space-y-2">
            <label htmlFor="modal-whatsapp" className="text-xs font-semibold uppercase tracking-widest text-primary">
              WhatsApp Number
            </label>
            <div className="relative">
              <MessageCircle className="absolute left-4 top-3.5 w-4 h-4 text-muted-foreground" />
              <input
                id="modal-whatsapp"
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-[#181818] border border-white/10 focus:border-primary/50 pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-colors text-white"
              />
            </div>
            <p className="text-[11px] text-muted-foreground leading-normal">
              Allows guests to message you directly on WhatsApp.
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
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
