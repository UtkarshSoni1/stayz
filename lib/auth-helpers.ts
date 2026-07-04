import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"
import type { ApiErrorResponse } from "@/types/listing"

export interface AuthenticatedUser {
  id: string
  role?: string
}

// ─── API Route Guard ──────────────────────────────────────────────────────────

/**
 * Resolves the current Auth.js session and returns the user object.
 * If there is no valid session it returns a ready-to-send 401 NextResponse.
 * Use this inside API route handlers.
 */
export async function requireAuth(): Promise<
  { user: AuthenticatedUser; error: null } | { user: null; error: NextResponse }
> {
  const session = await auth()

  if (!session?.user?.id) {
    const body: ApiErrorResponse = {
      success: false,
      error: "You must be signed in to perform this action.",
    }
    return { user: null, error: NextResponse.json(body, { status: 401 }) }
  }

  return {
    user: { id: session.user.id, role: session.user.role },
    error: null,
  }
}

// ─── Server Component / Page Guards ──────────────────────────────────────────
// These helpers are for use in Server Components (layouts / pages).
// They call redirect() which throws internally — no return value needed.

/**
 * Ensures the current user is authenticated.
 * Redirects to /login if not.
 * Returns the session user object.
 */
export async function requireUser() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }
  return session.user
}

/**
 * Ensures the current user has at least OWNER or ADMIN role.
 * Redirects to /user/dashboard if they are a plain USER.
 * Redirects to /login if not authenticated at all.
 * Returns the session user object.
 */
export async function requireOwner() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }
  const role = session.user.role
  if (role !== "OWNER" && role !== "ADMIN") {
    redirect("/user/dashboard")
  }
  return session.user
}

/**
 * Ensures the current user has the ADMIN role.
 * Redirects to the appropriate dashboard for lower roles.
 * Returns the session user object.
 */
export async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }
  const role = session.user.role
  if (role === "OWNER") {
    redirect("/owner/dashboard")
  }
  if (role !== "ADMIN") {
    redirect("/user/dashboard")
  }
  return session.user
}
