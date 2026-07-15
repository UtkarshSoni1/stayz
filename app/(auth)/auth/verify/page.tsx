"use client";

import Link from "next/link";
import { ResendButton } from "@/components/auth/resend-button";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

// ─── Status Configs ────────────────────────────────────────────────────────────

const CONFIGS = {
  idle: {
    icon: "✉️",
    heading: "Verify your email",
    body: "Click the button below to securely verify your email address and activate your account.",
    showResend: false,
  },
  loading: {
    icon: "⏳",
    heading: "Verifying...",
    body: "Please wait while we verify your email securely.",
    showResend: false,
  },
  success: {
    icon: "✅",
    heading: "Email verified!",
    body: "Your account is now active. You can sign in and start exploring listings.",
    cta: (
      <Link
        href="/login"
        className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
      >
        Sign in
      </Link>
    ),
    showResend: false,
  },
  expired: {
    icon: "⏱",
    heading: "Verification link expired",
    body: "This link is only valid for 2 hours. Request a new one below and check your inbox.",
    showResend: true,
  },
  invalid: {
    icon: "❌",
    heading: "Invalid verification link",
    body: "This link has already been used or is not valid. Request a new verification email below.",
    showResend: true,
  },
} as const;

type StatusKey = keyof typeof CONFIGS;

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<StatusKey>(token ? "idle" : "invalid");

  const handleVerify = async () => {
    if (!token) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
      } else {
        if (data.error?.includes("expired")) {
          setStatus("expired");
        } else {
          setStatus("invalid");
        }
      }
    } catch (err) {
      setStatus("invalid");
    }
  };

  const config = CONFIGS[status];

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/8 bg-zinc-900 p-8 text-center shadow-2xl">
          {/* Icon */}
          <div className="mb-5 flex items-center justify-center">
            <span
              className="flex h-16 w-16 items-center justify-center rounded-full text-3xl"
              style={{
                background:
                  status === "success"
                    ? "rgba(34,197,94,0.12)"
                    : status === "expired"
                    ? "rgba(234,179,8,0.12)"
                    : status === "idle" || status === "loading"
                    ? "rgba(59,130,246,0.12)"
                    : "rgba(239,68,68,0.12)",
              }}
            >
              {status === "loading" ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/50 border-t-white" />
              ) : (
                config.icon
              )}
            </span>
          </div>

          {/* Heading */}
          <h1 className="mb-3 text-xl font-bold text-white">
            {config.heading}
          </h1>

          {/* Body */}
          <p className="mb-6 text-sm leading-relaxed text-white/50">
            {config.body}
          </p>

          {/* Action Button for Idle State */}
          {status === "idle" && (
            <button
              onClick={handleVerify}
              className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Verify Email Now
            </button>
          )}

          {/* CTA */}
          {"cta" in config && config.cta}

          {/* Resend */}
          {config.showResend && (
            <div className="mt-2 flex flex-col gap-3">
              <ResendButton email={undefined} />
              <Link
                href="/login"
                className="text-xs text-white/30 hover:text-white/60 transition"
              >
                Back to Sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
