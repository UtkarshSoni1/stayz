"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

// ── Types ──────────────────────────────────────────────────────────────────────
interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  _?: string;
}

// ── Component ──────────────────────────────────────────────────────────────────
export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  /** Clear a specific field error when the user starts typing. */
  function clearError(field: keyof FieldErrors) {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    setGlobalError(null);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGlobalError(null);

    // Client-side password match check — server still validates independently
    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match." });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        fieldErrors?: FieldErrors;
      };

      if (!res.ok) {
        // Surface structured field errors if present, otherwise show global banner
        if (data.fieldErrors && Object.keys(data.fieldErrors).length > 0) {
          setFieldErrors(data.fieldErrors);
        } else {
          setGlobalError(
            data.error ?? "Something went wrong. Please try again."
          );
        }
        return;
      }

      // Success — redirect to the email-sent confirmation page
      router.push(`/auth/verify-email-sent?email=${encodeURIComponent(email)}`);
    } catch {
      setGlobalError(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit} noValidate>
            <FieldGroup>
              {/* ── Heading ─────────────────────────────────────────────── */}
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Join StayZ</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Find your vibe. Find your place.
                </p>
              </div>

              {/* ── Global error (e.g. 409 duplicate email, 500) ─────────── */}
              {globalError && (
                <p
                  role="alert"
                  className="rounded-md bg-destructive/10 px-3 py-2 text-center text-sm text-destructive"
                >
                  {globalError}
                </p>
              )}

              {/* ── Name ────────────────────────────────────────────────── */}
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Raj Kewat"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearError("name");
                  }}
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={fieldErrors.name ? "name-error" : undefined}
                  required
                />
                {fieldErrors.name && (
                  <p
                    id="name-error"
                    role="alert"
                    className="mt-1 text-xs text-destructive"
                  >
                    {fieldErrors.name}
                  </p>
                )}
              </Field>

              {/* ── Email ───────────────────────────────────────────────── */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError("email");
                  }}
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={
                    fieldErrors.email ? "email-error" : undefined
                  }
                  required
                />
                {fieldErrors.email && (
                  <p
                    id="email-error"
                    role="alert"
                    className="mt-1 text-xs text-destructive"
                  >
                    {fieldErrors.email}
                  </p>
                )}
              </Field>

              {/* ── Passwords ───────────────────────────────────────────── */}
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearError("password");
                      }}
                      aria-invalid={!!fieldErrors.password}
                      aria-describedby="password-hint password-error"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        clearError("confirmPassword");
                      }}
                      aria-invalid={!!fieldErrors.confirmPassword}
                      aria-describedby={
                        fieldErrors.confirmPassword
                          ? "confirm-password-error"
                          : undefined
                      }
                      required
                    />
                  </Field>
                </Field>

                {/* Password requirements hint */}
                <FieldDescription id="password-hint">
                  Min 8 characters · at least one uppercase, lowercase &amp; number
                </FieldDescription>

                {fieldErrors.password && (
                  <p
                    id="password-error"
                    role="alert"
                    className="mt-1 text-xs text-destructive"
                  >
                    {fieldErrors.password}
                  </p>
                )}
                {fieldErrors.confirmPassword && (
                  <p
                    id="confirm-password-error"
                    role="alert"
                    className="mt-1 text-xs text-destructive"
                  >
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </Field>

              {/* ── Submit ──────────────────────────────────────────────── */}
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating…" : "Create Account"}
                </Button>
              </Field>

              {/* ── OAuth ───────────────────────────────────────────────── */}
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() =>
                    signIn("google", { callbackUrl: "/user/dashboard" })
                  }
                >
                  Continue with Google
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Already have an account?{" "}
                <Link href="/login">Sign in</Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="relative hidden bg-muted md:block" />
        </CardContent>
      </Card>
    </div>
  );
}
