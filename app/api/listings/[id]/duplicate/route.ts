import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-helpers"
import { duplicateListing } from "@/lib/listing-service"
import type { ApiErrorResponse, ApiSuccessResponse, MyListingDTO } from "@/types/listing"

// ─── POST /api/listings/[id]/duplicate ────────────────────────────────────────
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAuth()
    if (error) return error

    const { id } = await params
    const result = await duplicateListing(id, user.id)

    if (!result.ok) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: result.message },
        { status: result.status }
      )
    }

    return NextResponse.json<ApiSuccessResponse<MyListingDTO>>(
      { success: true, data: result.listing },
      { status: 201 }
    )
  } catch (err) {
    console.error("[POST /api/listings/[id]/duplicate]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to duplicate listing." },
      { status: 500 }
    )
  }
}
