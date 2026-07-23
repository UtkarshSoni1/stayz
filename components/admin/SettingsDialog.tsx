"use client";

import { useEffect, useState } from "react";
import { Settings } from "lucide-react";
import type { PlatformSettings } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldTitle, FieldDescription } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  maintenanceMode: boolean;
  signupsEnabled: boolean;
  autoApproveListings: boolean;
  featuredCities: string; // stored as comma-separated string; parsed on submit
  supportEmail: string;
}

const DEFAULT_FORM: FormState = {
  maintenanceMode: false,
  signupsEnabled: true,
  autoApproveListings: true,
  featuredCities: "",
  supportEmail: "",
};

function settingsToForm(s: PlatformSettings): FormState {
  return {
    maintenanceMode: s.maintenanceMode,
    signupsEnabled: s.signupsEnabled,
    autoApproveListings: s.autoApproveListings,
    featuredCities: s.featuredCities.join(", "),
    supportEmail: s.supportEmail ?? "",
  };
}

// ─── Toggle row ───────────────────────────────────────────────────────────────

function ToggleRow({
  id,
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <Field orientation="horizontal" className="items-center">
      <div className="flex-1 min-w-0">
        <FieldTitle className="text-white/80">{label}</FieldTitle>
        {description && (
          <FieldDescription className="text-white/40">{description}</FieldDescription>
        )}
      </div>
      {/* Styled checkbox acting as a toggle */}
      <label
        htmlFor={id}
        className="relative inline-flex h-5 w-9 cursor-pointer items-center"
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span className="absolute inset-0 rounded-full border border-stayz-border-default bg-stayz-surface-hover transition-colors peer-checked:border-slate-500/40 peer-checked:bg-slate-600/60 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" />
        <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white/30 shadow transition-transform peer-checked:translate-x-4 peer-checked:bg-white" />
      </label>
    </Field>
  );
}

// ─── Main Dialog ──────────────────────────────────────────────────────────────

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { toast } = useToast();

  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch on open
  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setLoading(true);

    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        if (res.success) {
          setForm(settingsToForm(res.data as PlatformSettings));
        } else {
          toast("Failed to load settings.", "error");
        }
      })
      .catch(() => {
        if (!cancelled) toast("Failed to load settings.", "error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, toast]);

  function patch<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        maintenanceMode: form.maintenanceMode,
        signupsEnabled: form.signupsEnabled,
        autoApproveListings: form.autoApproveListings,
        featuredCities: form.featuredCities
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        supportEmail: form.supportEmail.trim() || null,
      };

      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (json.success) {
        toast("Settings saved.", "success");
        onOpenChange(false);
      } else {
        toast(json.error ?? "Failed to save settings.", "error");
      }
    } catch {
      toast("An unexpected error occurred.", "error");
    } finally {
      setSaving(false);
    }
  }

  const busy = loading || saving;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-stayz-surface-card border-stayz-border-subtle text-white sm:max-w-lg">
        {/* ── Header ── */}
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stayz-surface-hover">
              <Settings className="h-4 w-4 text-slate-400" />
            </div>
            <DialogTitle className="text-white">Platform Settings</DialogTitle>
          </div>
          <DialogDescription className="text-white/40 pl-12">
            Changes take effect immediately and are persisted globally.
          </DialogDescription>
        </DialogHeader>

        {/* ── Form ── */}
        {loading ? (
          <div className="space-y-4 py-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 rounded-lg bg-stayz-surface-hover animate-pulse" />
            ))}
          </div>
        ) : (
          <FieldGroup className="gap-5">
            {/* ── Toggles ── */}
            <div className="rounded-xl border border-stayz-border-subtle bg-stayz-surface-hover divide-y divide-stayz-border-subtle px-4 py-1">
              <div className="py-3">
                <ToggleRow
                  id="maintenanceMode"
                  label="Maintenance Mode"
                  description="Disables public access (enforcement wired separately)"
                  checked={form.maintenanceMode}
                  onChange={(v) => patch("maintenanceMode", v)}
                  disabled={busy}
                />
              </div>
              <div className="py-3">
                <ToggleRow
                  id="signupsEnabled"
                  label="Signups Enabled"
                  description="Allow new users to register"
                  checked={form.signupsEnabled}
                  onChange={(v) => patch("signupsEnabled", v)}
                  disabled={busy}
                />
              </div>
              <div className="py-3">
                <ToggleRow
                  id="autoApproveListings"
                  label="Auto-approve New Listings"
                  description="Listings go ACTIVE immediately without admin review"
                  checked={form.autoApproveListings}
                  onChange={(v) => patch("autoApproveListings", v)}
                  disabled={busy}
                />
              </div>
            </div>

            {/* ── Featured Cities ── */}
            <Field orientation="vertical">
              <FieldTitle className="text-white/70 text-sm font-medium">
                Featured Cities
              </FieldTitle>
              <FieldDescription className="text-white/40 text-xs mb-1">
                Comma-separated list shown prominently on the homepage
              </FieldDescription>
              <Input
                value={form.featuredCities}
                onChange={(e) => patch("featuredCities", e.target.value)}
                placeholder="Mumbai, Delhi, Bangalore"
                disabled={busy}
                className="bg-stayz-surface-hover border-stayz-border-default text-white placeholder:text-white/20 focus-visible:border-slate-500/40 focus-visible:ring-slate-500/20"
              />
            </Field>

            {/* ── Support Email ── */}
            <Field orientation="vertical">
              <FieldTitle className="text-white/70 text-sm font-medium">
                Support Email
              </FieldTitle>
              <FieldDescription className="text-white/40 text-xs mb-1">
                Displayed as the contact address in transactional emails
              </FieldDescription>
              <Input
                type="email"
                value={form.supportEmail}
                onChange={(e) => patch("supportEmail", e.target.value)}
                placeholder="support@stayz.in"
                disabled={busy}
                className="bg-stayz-surface-hover border-stayz-border-default text-white placeholder:text-white/20 focus-visible:border-slate-500/40 focus-visible:ring-slate-500/20"
              />
            </Field>
          </FieldGroup>
        )}

        {/* ── Footer ── */}
        <DialogFooter className="mt-2">
          <Button
            variant="ghost"
            className="text-white/60 hover:text-white hover:bg-stayz-surface-hover"
            onClick={() => onOpenChange(false)}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            className="bg-slate-500/10 text-slate-300 border-slate-500/20 hover:bg-slate-500/20 hover:text-white"
            onClick={handleSave}
            disabled={busy}
          >
            {saving ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
