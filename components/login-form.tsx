"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ResendButton } from "@/components/auth/resend-button"

/** All role-based routing is handled by /auth/redirect (server component). */
const AUTH_REDIRECT = "/auth/redirect"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams()
  const registeredParam = searchParams.get("registered")

  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  // When login is blocked because email is unverified, store email for resend
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setUnverifiedEmail(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const emailValue = (formData.get("email") as string).trim().toLowerCase()
    setEmail(emailValue)

    const result = await signIn("credentials", {
      email: emailValue,
      password: formData.get("password") as string,
      redirect: false,
    })

    setLoading(false)

    if (!result?.error) {
      // Success — navigate to the redirect hub
      window.location.href = AUTH_REDIRECT
      return
    }

    // Detect unverified email error — Auth.js v5 exposes the code on result
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const code = (result as any).code as string | undefined

    if (code === "email_not_verified") {
      setUnverifiedEmail(emailValue)
      return
    }

    setError("Invalid email or password. Please try again.")
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit} noValidate>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back to StayZ</h1>
                <p className="text-balance text-muted-foreground">
                  Find your vibe. Find your place.
                </p>
              </div>

              {/* ── Registered banner (redirected from signup) ─────────── */}
              {registeredParam && !unverifiedEmail && !error && (
                <div className="rounded-md border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-center text-sm text-blue-400">
                  Account created — please verify your email before signing in.
                </div>
              )}

              {/* ── Wrong credentials error ────────────────────────────── */}
              {error && (
                <p
                  role="alert"
                  className="rounded-md bg-destructive/10 px-3 py-2 text-center text-sm text-destructive"
                >
                  {error}
                </p>
              )}

              {/* ── Email not verified banner ──────────────────────────── */}
              {unverifiedEmail && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/8 p-4">
                  <p className="mb-3 text-center text-sm font-medium text-amber-400">
                    📧 Please verify your email first
                  </p>
                  <p className="mb-4 text-center text-xs text-white/45">
                    We sent a link to{" "}
                    <strong className="text-white/70">{unverifiedEmail}</strong>
                    . Check your inbox (and spam folder).
                  </p>
                  <ResendButton
                    email={unverifiedEmail}
                    label="Resend Verification Email"
                  />
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  defaultValue={email}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" name="password" type="password" required />
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Signing in…" : "Login"}
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() =>
                    signIn(
                      "google",
                      { redirectTo: AUTH_REDIRECT },
                      { prompt: "select_account" },
                    )
                  }
                >
                  Continue with Google
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Don&apos;t have an account? <Link href="/signup">Sign up</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block" />
        </CardContent>
      </Card>
    </div>
  )
}
