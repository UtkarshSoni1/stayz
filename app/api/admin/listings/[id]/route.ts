import { NextRequest, NextResponse } from "next/server"
import { requireAdminApi } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { deleteListing } from "@/lib/listing-service"
import type { ListingStatus } from "@prisma/client"
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/listing"

const VALID_STATUSES: ListingStatus[] = ["ACTIVE", "DRAFT", "RENTED", "SUSPENDED"]

// ─── GET /api/admin/listings/[id] ────────────────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAdminApi()
    if (error) return error

    const { id } = await params

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        amenities: { include: { amenity: true } },
        highlights: { orderBy: { sortOrder: "asc" } },
        sleepingArrangements: { orderBy: { sortOrder: "asc" } },
        thingsToKnow: { orderBy: { sortOrder: "asc" } },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            phone: true,
            whatsappNumber: true,
            isSuperhost: true,
            responseRate: true,
            responseTimeLabel: true,
          },
        },
        _count: {
          select: {
            bookingRequests: true,
            reviews: true,
            saves: true,
          },
        },
      },
    })

    if (!listing) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Listing not found." },
        { status: 404 }
      )
    }

    // Booking requests grouped by status
    const bookingRequestsByStatus = await prisma.bookingRequest.groupBy({
      by: ["status"],
      where: { listingId: id },
      _count: { _all: true },
    })

    const bookingCounts: Record<string, number> = {
      PENDING: 0,
      ACCEPTED: 0,
      REJECTED: 0,
    }
    for (const g of bookingRequestsByStatus) {
      bookingCounts[g.status] = g._count._all
    }

    return NextResponse.json<ApiSuccessResponse<unknown>>({
      success: true,
      data: {
        ...listing,
        bookingRequestsByStatus: bookingCounts,
      },
    })
  } catch (err) {
    console.error("[GET /api/admin/listings/[id]]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to fetch listing details." },
      { status: 500 }
    )
  }
}

// ─── PATCH /api/admin/listings/[id] ──────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAdminApi()
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

    const status =
      body && typeof body === "object"
        ? (body as Record<string, unknown>).status
        : undefined

    if (!status || !VALID_STATUSES.includes(status as ListingStatus)) {
      return NextResponse.json<ApiErrorResponse>(
        {
          success: false,
          error: `Body must be { status: ${VALID_STATUSES.map((s) => `"${s}"`).join(" | ")} }.`,
        },
        { status: 422 }
      )
    }

    const { id } = await params

    const existing = await prisma.listing.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!existing) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Listing not found." },
        { status: 404 }
      )
    }

    const isAvailable = status === "ACTIVE"

    const updated = await prisma.listing.update({
      where: { id },
      data: { status: status as ListingStatus, isAvailable },
      select: { id: true, status: true, isAvailable: true, updatedAt: true },
    })

    return NextResponse.json<ApiSuccessResponse<typeof updated>>({
      success: true,
      data: updated,
    })
  } catch (err) {
    console.error("[PATCH /api/admin/listings/[id]]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to update listing status." },
      { status: 500 }
    )
  }
}

// ─── DELETE /api/admin/listings/[id] ─────────────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAdminApi()
    if (error) return error

    const { id } = await params

    // Reuse deleteListing which already accepts userRole and skips owner check for ADMIN
    const result = await deleteListing(id, user.id, "ADMIN")

    if (!result.ok) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: result.message },
        { status: result.status }
      )
    }

    return NextResponse.json<ApiSuccessResponse<null>>({
      success: true,
      data: null,
    })
  } catch (err) {
    console.error("[DELETE /api/admin/listings/[id]]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to delete listing." },
      { status: 500 }
    )
  }
}
