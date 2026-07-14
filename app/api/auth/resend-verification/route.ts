/**
 * POST /api/auth/resend-verification
 *
 * Resends a verification email. Designed to be safe against:
 *   - Email enumeration: always returns 200 for unknown emails
 *   - Replay: invalidates existing tokens before creating a new one
 *   - Flood: rate-limited to one email per 60 seconds per address
 *
 * Body: { email: string }
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createVerificationToken, checkResendRateLimit } from "@/lib/verification-token";
import { sendVerificationEmail } from "@/lib/email";

// Generic success — never reveals whether the email exists
const OK = NextResponse.json(
  {
    success: true,
    message: "If an unverified account with that email exists, a new verification email has been sent.",
  },
  { status: 200 }
);

export async function POST(req: Request) {
  // ── 1. Parse + basic validation ───────────────────────────────────────────
  let email: string;
  try {
    const body = await req.json();
    if (typeof body?.email !== "string" || !body.email.trim()) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required." },
        { status: 400 }
      );
    }
    email = body.email.trim().toLowerCase();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  try {
    // ── 2. Look up user — silently return OK if not found (no enumeration) ─
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, emailVerified: true },
    });

    if (!user) return OK; // No such account — don't leak this

    // ── 3. Already verified ────────────────────────────────────────────────
    if (user.emailVerified) {
      return NextResponse.json(
        {
          success: false,
          error: "This email address is already verified. You can sign in.",
        },
        { status: 409 }
      );
    }

    // ── 4. Rate limit — one email per 60 seconds ───────────────────────────
    const rateLimitResult = await checkResendRateLimit(email);
    if (rateLimitResult.limited) {
      return NextResponse.json(
        {
          success: false,
          error: `Please wait ${rateLimitResult.retryAfterSeconds} seconds before requesting another email.`,
          retryAfterSeconds: rateLimitResult.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    // ── 5. Invalidate old tokens + issue new one + send ────────────────────
    const rawToken = await createVerificationToken(email); // atomic replace
    await sendVerificationEmail(email, rawToken);

    return OK;
  } catch (err) {
    console.error("[POST /api/auth/resend-verification]", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
