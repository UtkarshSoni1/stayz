/**
 * lib/validations/auth.ts
 *
 * Server-side validation for authentication endpoints.
 * Follows the same pattern as lib/validations/listing.ts — pure TS, no Zod.
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean
  fieldErrors: Record<string, string>
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ─── validateRegister ─────────────────────────────────────────────────────────

/**
 * Validates and normalises a registration payload.
 * Returns { valid, fieldErrors } following the same shape as validateCreateListing().
 */
export function validateRegister(body: unknown): ValidationResult {
  const errors: Record<string, string> = {}

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { valid: false, fieldErrors: { _: "Invalid request body." } }
  }

  const data = body as Record<string, unknown>

  // ── name ──────────────────────────────────────────────────────────────────────
  if (data.name === undefined || data.name === null) {
    errors.name = "Name is required."
  } else if (typeof data.name !== "string") {
    errors.name = "Name must be a string."
  } else if (!data.name.trim()) {
    errors.name = "Name cannot be blank."
  } else if (data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters."
  } else if (data.name.trim().length > 100) {
    errors.name = "Name must be 100 characters or fewer."
  }

  // ── email ─────────────────────────────────────────────────────────────────────
  if (data.email === undefined || data.email === null) {
    errors.email = "Email is required."
  } else if (typeof data.email !== "string") {
    errors.email = "Email must be a string."
  } else if (!data.email.trim()) {
    errors.email = "Email cannot be blank."
  } else if (data.email.trim().length > 254) {
    errors.email = "Email must be 254 characters or fewer."
  } else if (!EMAIL_REGEX.test(data.email.trim().toLowerCase())) {
    errors.email = "Please enter a valid email address."
  }

  // ── password ──────────────────────────────────────────────────────────────────
  if (data.password === undefined || data.password === null) {
    errors.password = "Password is required."
  } else if (typeof data.password !== "string") {
    errors.password = "Password must be a string."
  } else if (!data.password) {
    errors.password = "Password cannot be blank."
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters."
  } else if (data.password.length > 128) {
    errors.password = "Password must be 128 characters or fewer."
  } else if (!/[A-Z]/.test(data.password)) {
    errors.password = "Password must contain at least one uppercase letter."
  } else if (!/[a-z]/.test(data.password)) {
    errors.password = "Password must contain at least one lowercase letter."
  } else if (!/[0-9]/.test(data.password)) {
    errors.password = "Password must contain at least one number."
  }

  return { valid: Object.keys(errors).length === 0, fieldErrors: errors }
}

/**
 * Normalises a validated register payload (trim + lowercase email).
 * Only call after validateRegister returns valid: true.
 */
export function normaliseRegister(body: Record<string, unknown>): RegisterInput {
  return {
    name: (body.name as string).trim(),
    email: (body.email as string).trim().toLowerCase(),
    password: body.password as string,     // intentionally NOT trimmed
  }
}

// ─── validateLogin ────────────────────────────────────────────────────────────

/**
 * Validates a credentials login payload.
 * Intentionally lenient — we don't reveal which field is wrong to the user;
 * errors only gate the Prisma query, not produce per-field UI feedback.
 */
export function validateLogin(credentials: unknown): ValidationResult {
  const errors: Record<string, string> = {}

  if (!credentials || typeof credentials !== "object" || Array.isArray(credentials)) {
    return { valid: false, fieldErrors: { _: "Invalid credentials payload." } }
  }

  const data = credentials as Record<string, unknown>

  // email
  if (
    typeof data.email !== "string" ||
    !data.email.trim() ||
    !EMAIL_REGEX.test(data.email.trim().toLowerCase())
  ) {
    errors.email = "Invalid email."
  }

  // password — only presence check; strength rules are for registration
  if (typeof data.password !== "string" || !data.password) {
    errors.password = "Password is required."
  }

  return { valid: Object.keys(errors).length === 0, fieldErrors: errors }
}

/**
 * Normalises a validated login payload.
 * Only call after validateLogin returns valid: true.
 */
export function normaliseLogin(credentials: Record<string, unknown>): LoginInput {
  return {
    email: (credentials.email as string).trim().toLowerCase(),
    password: credentials.password as string,
  }
}
