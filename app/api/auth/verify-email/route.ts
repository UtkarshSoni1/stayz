/**
 * POST /api/auth/verify-email
 *
 * Validates the one-time email verification token, marks the user as verified,
 * and deletes the token.
 *
 * Body: { token: string }
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { consumeVerificationToken } from "@/lib/verification-token";

export async function POST(req: Request) {
  console.log("[POST /api/auth/verify-email] Request received.");
  try {
    const body = await req.json();
    console.log("[POST /api/auth/verify-email] Body:", body);
    const { token } = body;

    // Reject non-string values or tokens that are not exactly 64 hexadecimal characters
    if (typeof token !== "string" || token.length !== 64 || !/^[0-9a-f]{64}$/i.test(token)) {
      console.log("[POST /api/auth/verify-email] Validation failed for token:", token);
      return NextResponse.json(
        { success: false, error: "Invalid token format." },
        { status: 400 }
      );
    }

    const result = await consumeVerificationToken(token);
    console.log("[POST /api/auth/verify-email] consumeVerificationToken result:", result);

    if (!result.ok) {
      const errorMessage = result.reason === "expired" 
        ? "This verification link has expired. Please request a new one." 
        : "Invalid verification link.";
      return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
    }

    // Find the user by email (the identifier stored in the token)
    const user = await prisma.user.findUnique({
      where: { email: result.email },
      select: { id: true, emailVerified: true },
    });
    console.log("[POST /api/auth/verify-email] Found user:", user);

    if (!user) {
      // Orphaned token — treat as invalid
      return NextResponse.json({ success: false, error: "Account not found." }, { status: 400 });
    }

    // Already verified — idempotent success
    if (!user.emailVerified) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
      console.log("[POST /api/auth/verify-email] Marked user verified.");
    } else {
      console.log("[POST /api/auth/verify-email] User was already verified.");
    }

    return NextResponse.json({ success: true, message: "Email verified successfully." }, { status: 200 });
  } catch (err) {
    console.error("[POST /api/auth/verify-email] Catch Error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
