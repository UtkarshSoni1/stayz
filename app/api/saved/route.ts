import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-helpers"
import { getSavedListings, saveListing } from "@/lib/saved-service"
import type { ApiErrorResponse, ApiSuccessResponse, SavedListingDTO } from "@/types/listing"
import type { RoomType } from "@prisma/client"

// ─── GET /api/saved ───────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { user, error } = await requireAuth()
    if (error) return error

    const { searchParams } = new URL(req.url)

    const search = searchParams.get("search")?.trim() || undefined
    const sort = (searchParams.get("sort") || "NEWEST") as
      | "NEWEST"
      | "OLDEST"
      | "RENT_LOW_HIGH"
      | "RENT_HIGH_LOW"
      | "RATING"
    const city = searchParams.get("city")?.trim() || undefined
    const roomType = (searchParams.get("roomType") || "ALL") as "ALL" | RoomType
    const page = Math.max(1, Number(searchParams.get("page") || 1))
    const limit = Math.min(24, Math.max(1, Number(searchParams.get("limit") || 12)))

    const result = await getSavedListings(user.id, {
      search,
      sort,
      city,
      roomType,
      page,
      limit,
    })

    return NextResponse.json<
      ApiSuccessResponse<{
        items: SavedListingDTO[]
        total: number
        hasMore: boolean
        page: number
        limit: number
      }>
    >({
      success: true,
      data: { ...result, page, limit },
    })
  } catch (err) {
    console.error("[GET /api/saved]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to fetch saved listings." },
      { status: 500 }
    )
  }
}

// ─── POST /api/saved ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { user, error } = await requireAuth()
    if (error) return error

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Invalid JSON body." },
        { status: 400 }
      )
    }

    const listingId =
      typeof body === "object" && body !== null && "listingId" in body
        ? (body as { listingId: unknown }).listingId
        : undefined

    if (typeof listingId !== "string" || !listingId.trim()) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "listingId is required." },
        { status: 422 }
      )
    }

    const result = await saveListing(user.id, listingId)
    if (!result.ok) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: result.message },
        { status: result.status }
      )
    }

    return NextResponse.json<ApiSuccessResponse<{ saved: true }>>(
      { success: true, data: { saved: true } },
      { status: 201 }
    )
  } catch (err) {
    console.error("[POST /api/saved]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to save listing." },
      { status: 500 }
    )
  }
}
