import type { CreateListingPayload } from "@/types/listing"

export interface ValidationResult {
  valid: boolean
  fieldErrors: Record<string, string>
}

const VALID_ROOM_TYPES = ["SINGLE", "SHARED", "PG", "FLAT"] as const
const VALID_FURNISHING = ["FURNISHED", "SEMI_FURNISHED", "UNFURNISHED"] as const
const VALID_GENDER = ["MALE", "FEMALE", "ANY"] as const
const VALID_STATUS = ["DRAFT", "ACTIVE"] as const

// Known amenity slugs that match what the client sends
const VALID_AMENITIES = [
  "WIFI", "AC", "PARKING", "LAUNDRY", "KITCHEN", "BALCONY",
  "POWER_BACKUP", "REFRIGERATOR", "GEYSER", "CCTV", "LIFT", "RO_WATER",
] as const

export function validateCreateListing(body: unknown): ValidationResult {
  const errors: Record<string, string> = {}

  if (!body || typeof body !== "object") {
    return { valid: false, fieldErrors: { _: "Invalid request body" } }
  }

  const data = body as Record<string, unknown>

  // ── title ────────────────────────────────────────────────────────────────────
  if (!data.title || typeof data.title !== "string" || !data.title.trim()) {
    errors.title = "Listing title is required"
  } else if (data.title.trim().length < 10) {
    errors.title = "Title must be at least 10 characters"
  } else if (data.title.trim().length > 120) {
    errors.title = "Title must be 120 characters or fewer"
  }

  // ── description ──────────────────────────────────────────────────────────────
  if (!data.description || typeof data.description !== "string" || !data.description.trim()) {
    errors.description = "Description is required"
  } else if (data.description.trim().length < 30) {
    errors.description = "Description must be at least 30 characters"
  } else if (data.description.trim().length > 2000) {
    errors.description = "Description must be 2000 characters or fewer"
  }

  // ── city ─────────────────────────────────────────────────────────────────────
  if (!data.city || typeof data.city !== "string" || !data.city.trim()) {
    errors.city = "City is required"
  }

  // ── locality ─────────────────────────────────────────────────────────────────
  if (!data.locality || typeof data.locality !== "string" || !data.locality.trim()) {
    errors.locality = "Locality is required"
  }

  // ── pincode ──────────────────────────────────────────────────────────────────
  if (!data.pincode || typeof data.pincode !== "string" || !data.pincode.trim()) {
    errors.pincode = "Pincode is required"
  } else if (!/^\d{6}$/.test(data.pincode.trim())) {
    errors.pincode = "Enter a valid 6-digit pincode"
  }

  // ── monthlyRent ──────────────────────────────────────────────────────────────
  const rent = Number(data.monthlyRent)
  if (!data.monthlyRent || isNaN(rent) || rent <= 0) {
    errors.monthlyRent = "Monthly rent must be a positive number"
  } else if (rent > 10_000_000) {
    errors.monthlyRent = "Rent value seems unrealistic"
  }

  // ── securityDeposit (optional) ───────────────────────────────────────────────
  if (data.securityDeposit !== undefined && data.securityDeposit !== null && data.securityDeposit !== "") {
    const dep = Number(data.securityDeposit)
    if (isNaN(dep) || dep < 0) {
      errors.securityDeposit = "Security deposit must be a non-negative number"
    }
  }

  // ── roomType ─────────────────────────────────────────────────────────────────
  if (!data.roomType || !VALID_ROOM_TYPES.includes(data.roomType as never)) {
    errors.roomType = "Please select a valid room type"
  }

  // ── furnishing ───────────────────────────────────────────────────────────────
  if (!data.furnishing || !VALID_FURNISHING.includes(data.furnishing as never)) {
    errors.furnishing = "Please select a valid furnishing type"
  }

  // ── genderPreference ─────────────────────────────────────────────────────────
  if (!data.genderPreference || !VALID_GENDER.includes(data.genderPreference as never)) {
    errors.genderPreference = "Please select a valid gender preference"
  }

  // ── availableFrom ────────────────────────────────────────────────────────────
  if (!data.availableFrom || typeof data.availableFrom !== "string") {
    errors.availableFrom = "Availability date is required"
  } else if (isNaN(Date.parse(data.availableFrom))) {
    errors.availableFrom = "Enter a valid date"
  }

  // ── phone ────────────────────────────────────────────────────────────────────
  if (!data.phone || typeof data.phone !== "string" || !data.phone.trim()) {
    errors.phone = "Phone number is required"
  } else if (!/^\d{10}$/.test(data.phone.trim())) {
    errors.phone = "Enter a valid 10-digit phone number"
  }

  // ── amenities (optional, validate each entry) ────────────────────────────────
  if (data.amenities !== undefined) {
    if (!Array.isArray(data.amenities)) {
      errors.amenities = "Amenities must be an array"
    } else {
      const invalid = (data.amenities as unknown[]).filter(
        (a) => typeof a !== "string" || !VALID_AMENITIES.includes(a as never)
      )
      if (invalid.length > 0) {
        errors.amenities = `Unknown amenities: ${invalid.join(", ")}`
      }
    }
  }

  // ── status ───────────────────────────────────────────────────────────────────
  if (!data.status || !VALID_STATUS.includes(data.status as never)) {
    errors.status = "Status must be DRAFT or ACTIVE"
  }

  return {
    valid: Object.keys(errors).length === 0,
    fieldErrors: errors,
  }
}

/**
 * Casts the validated raw body into a typed CreateListingPayload.
 * Only call this after validateCreateListing returns valid: true.
 */
export function castPayload(body: Record<string, unknown>): CreateListingPayload {
  return {
    title: (body.title as string).trim(),
    description: (body.description as string).trim(),
    city: (body.city as string).trim(),
    locality: (body.locality as string).trim(),
    address: body.address ? (body.address as string).trim() : undefined,
    pincode: (body.pincode as string).trim(),
    latitude: body.latitude ? Number(body.latitude) : undefined,
    longitude: body.longitude ? Number(body.longitude) : undefined,
    monthlyRent: Number(body.monthlyRent),
    securityDeposit: body.securityDeposit ? Number(body.securityDeposit) : undefined,
    roomType: body.roomType as CreateListingPayload["roomType"],
    furnishing: body.furnishing as CreateListingPayload["furnishing"],
    genderPreference: body.genderPreference as CreateListingPayload["genderPreference"],
    totalSeats: body.totalSeats ? Number(body.totalSeats) : undefined,
    vacantSeats: body.vacantSeats ? Number(body.vacantSeats) : undefined,
    availableFrom: body.availableFrom as string,
    phone: (body.phone as string).trim(),
    amenities: Array.isArray(body.amenities) ? (body.amenities as string[]) : [],
    status: body.status as "DRAFT" | "ACTIVE",
  }
}

// ─── Update Listing Validation (all fields optional) ──────────────────────────

const VALID_STATUS_ALL = ["DRAFT", "ACTIVE", "RENTED"] as const

export function validateUpdateListing(body: unknown): ValidationResult {
  const errors: Record<string, string> = {}

  if (!body || typeof body !== "object") {
    return { valid: false, fieldErrors: { _: "Invalid request body" } }
  }

  const data = body as Record<string, unknown>

  if (data.title !== undefined) {
    if (typeof data.title !== "string" || !data.title.trim()) {
      errors.title = "Title must be a non-empty string"
    } else if (data.title.trim().length < 10) {
      errors.title = "Title must be at least 10 characters"
    } else if (data.title.trim().length > 120) {
      errors.title = "Title must be 120 characters or fewer"
    }
  }

  if (data.description !== undefined) {
    if (typeof data.description !== "string" || data.description.trim().length < 30) {
      errors.description = "Description must be at least 30 characters"
    }
  }

  if (data.monthlyRent !== undefined) {
    const rent = Number(data.monthlyRent)
    if (isNaN(rent) || rent <= 0) errors.monthlyRent = "Monthly rent must be a positive number"
  }

  if (data.pincode !== undefined && data.pincode !== "") {
    if (!/^\d{6}$/.test(String(data.pincode))) {
      errors.pincode = "Enter a valid 6-digit pincode"
    }
  }

  if (data.roomType !== undefined && !VALID_ROOM_TYPES.includes(data.roomType as never)) {
    errors.roomType = "Invalid room type"
  }

  if (data.furnishing !== undefined && !VALID_FURNISHING.includes(data.furnishing as never)) {
    errors.furnishing = "Invalid furnishing type"
  }

  if (data.genderPreference !== undefined && !VALID_GENDER.includes(data.genderPreference as never)) {
    errors.genderPreference = "Invalid gender preference"
  }

  if (data.status !== undefined && !VALID_STATUS_ALL.includes(data.status as never)) {
    errors.status = "Status must be DRAFT, ACTIVE, or RENTED"
  }

  if (data.amenities !== undefined) {
    if (!Array.isArray(data.amenities)) {
      errors.amenities = "Amenities must be an array"
    } else {
      const invalid = (data.amenities as unknown[]).filter(
        (a) => typeof a !== "string" || !VALID_AMENITIES.includes(a as never)
      )
      if (invalid.length > 0) {
        errors.amenities = `Unknown amenities: ${invalid.join(", ")}`
      }
    }
  }

  return { valid: Object.keys(errors).length === 0, fieldErrors: errors }
}
