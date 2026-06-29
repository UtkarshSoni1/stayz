import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-helpers"
import { markListingRented } from "@/lib/listing-service"
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/listing"

// ─── PATCH /api/listings/[id]/status ─────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    if (!body || typeof body !== "object" || (body as Record<string, unknown>).status !== "RENTED") {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Body must be { status: \"RENTED\" }." },
        { status: 422 }
      )
    }

    const { id } = await params
    const result = await markListingRented(id, user.id)

    if (!result.ok) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: result.message },
        { status: result.status }
      )
    }

    return NextResponse.json<ApiSuccessResponse<null>>(
      { success: true, data: null },
      { status: 200 }
    )
  } catch (err) {
    console.error("[PATCH /api/listings/[id]/status]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to update listing status." },
      { status: 500 }
    )
  }
}
