import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-helpers"
import { getMyListings } from "@/lib/listing-service"
import type { ApiErrorResponse, ApiSuccessResponse, MyListingDTO } from "@/types/listing"
import type { ListingStatus, RoomType } from "@prisma/client"

// ─── GET /api/listings/my ─────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { user, error } = await requireAuth()
    if (error) return error

    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")?.trim() || undefined
    const rawStatus = searchParams.get("status") || "ALL"
    const rawRoomType = searchParams.get("roomType") || "ALL"
    const sort = (searchParams.get("sort") || "NEWEST") as
      | "NEWEST"
      | "OLDEST"
      | "RENT_HIGH_LOW"
      | "RENT_LOW_HIGH"

    const status =
      rawStatus === "ALL"
        ? "ALL"
        : (rawStatus as ListingStatus)

    const roomType =
      rawRoomType === "ALL"
        ? "ALL"
        : (rawRoomType as RoomType)

    const listings = await getMyListings(user.id, { search, status, roomType, sort })

    return NextResponse.json<ApiSuccessResponse<MyListingDTO[]>>(
      { success: true, data: listings },
      { status: 200 }
    )
  } catch (err) {
    console.error("[GET /api/listings/my]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to fetch your listings." },
      { status: 500 }
    )
  }
}
