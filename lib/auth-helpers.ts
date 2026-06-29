import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { ApiErrorResponse } from "@/types/listing"

export interface AuthenticatedUser {
  id: string
  role?: string
}

/**
 * Resolves the current Auth.js session and returns the user object.
 * If there is no valid session it returns a ready-to-send 401 NextResponse.
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
