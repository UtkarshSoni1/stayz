import type { RoomType, GenderPreference, Furnishing } from "@prisma/client"

// ─── Request body sent from the client ────────────────────────────────────────

export interface CreateListingPayload {
  // Property Details
  title: string
  description: string

  // Location
  city: string
  locality: string
  address?: string
  pincode: string
  latitude?: number
  longitude?: number

  // Pricing
  monthlyRent: number
  securityDeposit?: number

  // Room Details
  roomType: RoomType
  furnishing: Furnishing
  genderPreference: GenderPreference
  totalSeats?: number
  vacantSeats?: number
  availableFrom: string // ISO date string e.g. "2025-08-01"

  // Contact
  phone: string

  // Amenities — list of amenity name strings e.g. ["WIFI", "AC"]
  amenities: string[]

  // Status
  status: "DRAFT" | "ACTIVE"
}

// ─── API response shapes ───────────────────────────────────────────────────────

export interface ApiSuccessResponse<T = unknown> {
  success: true
  data: T
}

export interface ApiErrorResponse {
  success: false
  error: string
  fieldErrors?: Record<string, string>
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse
