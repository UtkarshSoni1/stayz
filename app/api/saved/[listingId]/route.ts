import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-helpers"
import { unsaveListing } from "@/lib/saved-service"
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/listing"

// ─── DELETE /api/saved/:listingId ─────────────────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ listingId: string }> }
) {
  try {
    const { user, error } = await requireAuth()
    if (error) return error

    const { listingId } = await params

    if (!listingId?.trim()) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "listingId is required." },
        { status: 422 }
      )
    }

    const result = await unsaveListing(user.id, listingId)
    if (!result.ok) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: result.message },
        { status: result.status }
      )
    }

    return NextResponse.json<ApiSuccessResponse<{ removed: true }>>({
      success: true,
      data: { removed: true },
    })
  } catch (err) {
    console.error("[DELETE /api/saved/:listingId]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to remove saved listing." },
      { status: 500 }
    )
  }
}
