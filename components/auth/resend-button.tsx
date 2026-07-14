"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface ResendButtonProps {
  /** Pre-fill the email. If omitted, renders an email input. */
  email?: string;
  /** Label shown while idle */
  label?: string;
}

const COOLDOWN_SECONDS = 60;

export function ResendButton({
  email: initialEmail,
  label = "Resend Verification Email",
}: ResendButtonProps) {
  const [email, setEmail] = useState(initialEmail ?? "");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error" | "rate_limited"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(id);
          setStatus("idle");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [countdown]);

  const handleResend = useCallback(async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }

    setStatus("loading");
    setMessage(null);

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = (await res.json()) as {
        success: boolean;
        error?: string;
        retryAfterSeconds?: number;
      };

      if (res.status === 429) {
        const wait = data.retryAfterSeconds ?? COOLDOWN_SECONDS;
        setStatus("rate_limited");
        setCountdown(wait);
        setMessage(`Please wait ${wait} seconds before requesting another email.`);
        return;
      }

      if (res.status === 409) {
        // Already verified — treat as success from UX perspective
        setStatus("success");
        setMessage(
          data.error ??
            "Your email is already verified. You can sign in now."
        );
        return;
      }

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      // Success — start cooldown
      setStatus("rate_limited");
      setCountdown(COOLDOWN_SECONDS);
      setMessage("Verification email sent! Check your inbox (and spam folder).");
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  }, [email]);

  const isDisabled = status === "loading" || status === "rate_limited";

  return (
    <div className="flex w-full flex-col gap-2">
      {/* Email input — only rendered when no email prop was passed */}
      {!initialEmail && (
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isDisabled}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        />
      )}

      <Button
        type="button"
        variant="outline"
        disabled={isDisabled}
        onClick={handleResend}
        className="w-full"
      >
        {status === "loading"
          ? "Sending…"
          : status === "rate_limited" && countdown > 0
          ? `Resend in ${countdown}s`
          : label}
      </Button>

      {/* Status message */}
      {message && (
        <p
          role="alert"
          className={`text-center text-xs ${
            status === "success" || (status === "rate_limited" && countdown > 0)
              ? "text-green-400"
              : "text-destructive"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
