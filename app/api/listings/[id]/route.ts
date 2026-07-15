import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/auth-helpers"
import { getListingById, updateListing, deleteListing } from "@/lib/listing-service"
import { validateUpdateListing } from "@/lib/validations/listing"
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/listing"

// ─── GET /api/listings/[id] ────────────────────────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const listing = await getListingById(id)

    if (!listing) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Listing not found." },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiSuccessResponse<typeof listing>>({
      success: true,
      data: listing,
    })
  } catch (err) {
    console.error("[GET /api/listings/[id]]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to fetch listing." },
      { status: 500 }
    )
  }
}

// ─── PATCH /api/listings/[id] ─────────────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAuth()
    if (error) return error

    let rawBody: unknown
    try {
      rawBody = await req.json()
    } catch {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Invalid JSON in request body." },
        { status: 400 }
      )
    }

    const { valid, fieldErrors } = validateUpdateListing(rawBody)
    if (!valid) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Validation failed.", fieldErrors },
        { status: 422 }
      )
    }

    const { id } = await params
    const result = await updateListing(id, user.id, rawBody as Record<string, unknown>)

    if (!result.ok) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: result.message },
        { status: result.status }
      )
    }

    revalidatePath("/listings")
    revalidatePath(`/listings/${id}`)

    return NextResponse.json<ApiSuccessResponse<unknown>>(
      { success: true, data: result.listing },
      { status: 200 }
    )
  } catch (err) {
    console.error("[PATCH /api/listings/[id]]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to update listing." },
      { status: 500 }
    )
  }
}

// ─── DELETE /api/listings/[id] ─────────────────────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAuth()
    if (error) return error

    const { id } = await params
    const result = await deleteListing(id, user.id, user.role)

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
    console.error("[DELETE /api/listings/[id]]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to delete listing." },
      { status: 500 }
    )
  }
}
