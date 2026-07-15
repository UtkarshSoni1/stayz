import type { RoomType, GenderPreference, Furnishing, ListingStatus } from "@prisma/client"

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

  // Pricing
  monthlyRent: number
  securityDeposit?: number // maps to Listing.deposit

  // Room Details
  roomType: RoomType
  furnishing: Furnishing
  genderPreference: GenderPreference

  // Amenities — list of amenity name strings e.g. ["WIFI", "AC"]
  amenities: string[]

  // Status
  status: "DRAFT" | "ACTIVE"
}

export type UpdateListingPayload = Partial<Omit<CreateListingPayload, "amenities">> & {
  amenities?: string[]
  images?: { url: string; publicId: string; sortOrder: number }[]
}

export interface UpdateStatusPayload {
  status: "RENTED"
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

/** Shape returned by GET /api/listings/my for each listing card */
export interface MyListingDTO {
  id: string
  title: string
  city: string
  locality: string
  rent: number         // maps to Listing.monthlyRent
  roomType: RoomType
  furnishing: Furnishing
  genderPreference: GenderPreference
  status: ListingStatus
  coverImage: string   // first image url or placeholder
  rating: number | null
  reviews: number
  saves: number
  createdAt: string    // ISO date string
}

/** Shape returned by GET /api/saved for each saved listing card */
export interface SavedListingDTO {
  id: string
  title: string
  city: string
  locality: string
  rent: number         // maps to Listing.monthlyRent
  roomType: RoomType
  furnishing: Furnishing
  genderPreference: GenderPreference
  isAvailable: boolean
  status: ListingStatus
  coverImage: string   // first image url or placeholder
  rating: number | null
  reviews: number
  savedAt: string      // ISO date string — when the user saved it
}

/** Shape returned by GET /api/dashboard/summary */
export interface DashboardSummaryDTO {
  total: number
  active: number
  draft: number
  rented: number
  avgRating: number | null
  totalReviews: number
  totalSaves: number
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
