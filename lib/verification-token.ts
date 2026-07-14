/**
 * lib/verification-token.ts
 *
 * Manages email-verification tokens using the existing VerificationToken
 * Prisma model (identifier / token / expires).
 *
 * Security model:
 *   • Raw 32-byte hex token is sent in the email URL.
 *   • SHA-256 hash of the token is stored in the DB.
 *   • The DB therefore never contains a usable token — only a verifier.
 *   • Tokens expire after 24 hours and are deleted on first use.
 */

import crypto from "crypto"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

// ─── Constants ────────────────────────────────────────────────────────────────

const TTL_MS = 2 * 60 * 60 * 1000       // 2 hours (reduced from 24h for security)
const RATE_LIMIT_SECONDS = 60            // minimum gap between resends

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hashToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex")
}

function generateRawToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

// ─── createVerificationToken ──────────────────────────────────────────────────

/**
 * Deletes any existing tokens for the given email, creates a fresh token,
 * stores its SHA-256 hash in the DB, and returns the raw token for embedding
 * in the verification URL.
 *
 * @param email - The email to verify
 * @param tx - Optional Prisma transaction client to ensure atomic signups
 * @throws never — callers handle their own errors (unless tx throws).
 */
export async function createVerificationToken(
  email: string,
  tx: Prisma.TransactionClient = prisma
): Promise<string> {
  const raw = generateRawToken()
  const hashed = hashToken(raw)
  const expires = new Date(Date.now() + TTL_MS)
  
  console.log(`[createVerificationToken] Email: ${email}`);
  console.log(`[createVerificationToken] Raw Token: ${raw}`);
  console.log(`[createVerificationToken] Hashed Token: ${hashed}`);

  // Use the provided transaction client (or default prisma)
  await tx.verificationToken.deleteMany({ where: { identifier: email } })
  const created = await tx.verificationToken.create({
    data: { identifier: email, token: hashed, expires },
  })
  console.log(`[createVerificationToken] DB record created:`, created);

  return raw
}

// ─── consumeVerificationToken ─────────────────────────────────────────────────

export type ConsumeResult =
  | { ok: true; email: string }
  | { ok: false; reason: "invalid" | "expired" }

/**
 * Looks up and validates a raw verification token.
 * On success: deletes the token from the DB and returns the email.
 * On failure: returns a typed reason — never throws.
 */
export async function consumeVerificationToken(
  rawToken: string
): Promise<ConsumeResult> {
  console.log(`[consumeVerificationToken] Incoming rawToken: ${rawToken}`);
  console.log(`[consumeVerificationToken] Incoming rawToken length: ${rawToken?.length}`);
  
  // Prevent hashing DoS via massive strings
  if (typeof rawToken !== "string" || rawToken.length !== 64) {
    console.log(`[consumeVerificationToken] Failed length check!`);
    return { ok: false, reason: "invalid" }
  }

  const hashed = hashToken(rawToken)
  console.log(`[consumeVerificationToken] Hashed Token to look up: ${hashed}`);

  let record;
  try {
    // Atomic fetch and delete prevents race conditions / unhandled errors
    // Prisma throws P2025 if the record to delete does not exist.
    record = await prisma.verificationToken.delete({
      where: { token: hashed },
    })
    console.log(`[consumeVerificationToken] DB delete result:`, record);
  } catch (error) {
    console.log(`[consumeVerificationToken] DB delete ERROR:`, error);
    return { ok: false, reason: "invalid" }
  }

  if (record.expires < new Date()) {
    console.log(`[consumeVerificationToken] Token EXPIRED. Expires: ${record.expires}, Now: ${new Date()}`);
    return { ok: false, reason: "expired" }
  }

  console.log(`[consumeVerificationToken] SUCCESS. Email: ${record.identifier}`);
  return { ok: true, email: record.identifier }
}

// ─── checkRateLimit ───────────────────────────────────────────────────────────

export type RateLimitResult =
  | { limited: false }
  | { limited: true; retryAfterSeconds: number }

/**
 * Checks if the given email already has an unexpired token that was issued
 * recently (within RATE_LIMIT_SECONDS).
 *
 * We derive createdAt from expires: createdAt ≈ expires − TTL_MS.
 */
export async function checkResendRateLimit(
  email: string
): Promise<RateLimitResult> {
  const existing = await prisma.verificationToken.findFirst({
    where: { identifier: email },
    orderBy: { expires: "desc" },
    select: { expires: true },
  })

  if (!existing) return { limited: false }

  const createdAt = existing.expires.getTime() - TTL_MS
  const ageSeconds = (Date.now() - createdAt) / 1000

  if (ageSeconds < RATE_LIMIT_SECONDS) {
    return {
      limited: true,
      retryAfterSeconds: Math.ceil(RATE_LIMIT_SECONDS - ageSeconds),
    }
  }

  return { limited: false }
}
