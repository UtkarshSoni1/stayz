import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { validateRegister, normaliseRegister } from "@/lib/validations/auth";
import { createVerificationToken } from "@/lib/verification-token";
import { sendVerificationEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // ── 0. Rate Limiting (Prevent Email Bombing) ─────────────────────────────
  // Use x-forwarded-for if behind a proxy (like Vercel), otherwise fallback
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const rateLimit = checkRateLimit(ip, 5, 60 * 60 * 1000); // 5 requests per hour

  if (!rateLimit.success) {
    return NextResponse.json(
      { success: false, error: "Too many registration attempts. Please try again later." },
      { status: 429 }
    );
  }

  // ── 1. Parse body ─────────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  // ── 2. Server-side validation ─────────────────────────────────────────────
  const { valid, fieldErrors } = validateRegister(body);
  if (!valid) {
    return NextResponse.json(
      { success: false, error: "Validation failed.", fieldErrors },
      { status: 400 }
    );
  }

  // ── 3. Normalise (trim name, lowercase email) ─────────────────────────────
  const { name, email, password } = normaliseRegister(
    body as Record<string, unknown>
  );

  try {
    // ── 4. Duplicate email check ───────────────────────────────────────────
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    
    // Note: Returning 409 allows user enumeration, but is kept for UX reasons.
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // ── 5. Hash password only after validation passes ─────────────────────
    const hashedPassword = await bcrypt.hash(password, 12);

    // ── 6. Atomic User & Token Creation ────────────────────────────────────
    // Wrapped in a transaction so if token creation fails, the user isn't orphaned
    console.log("[register] Starting transaction for email:", email);
    const { user, rawToken } = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { name, email, password: hashedPassword },
        select: { id: true, email: true },
      });

      const generatedToken = await createVerificationToken(email, tx);
      console.log("[register] Transaction created token:", generatedToken);

      return { user: newUser, rawToken: generatedToken };
    });
    console.log("[register] Transaction successful. rawToken:", rawToken);

    // ── 7. Send verification email ─────────────────────────────────────────
    console.log("[register] Calling sendVerificationEmail with:", rawToken);
    sendVerificationEmail(email, rawToken).catch((emailErr) => {
      console.error("[register] Failed to send verification email:", emailErr);
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Account created. Please check your email to verify your address before signing in.",
        user: { id: user.id, email: user.email },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/auth/register]", err);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}