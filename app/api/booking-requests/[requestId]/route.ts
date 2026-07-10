import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/listing"

// ─── PATCH /api/booking-requests/[requestId] ──────────────────────────────────
// Owner-only. Accepts or rejects a booking request.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { user, error } = await requireAuth()
    if (error) return error

    const { requestId } = await params

    // Parse body
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

    if (status !== "ACCEPTED" && status !== "REJECTED") {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: 'Body must be { status: "ACCEPTED" | "REJECTED" }.' },
        { status: 422 }
      )
    }

    // Load the request + its listing to verify ownership
    const bookingRequest = await prisma.bookingRequest.findUnique({
      where: { id: requestId },
      include: {
        listing: { select: { ownerId: true } },
      },
    })

    if (!bookingRequest) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Booking request not found." },
        { status: 404 }
      )
    }

    if (bookingRequest.listing.ownerId !== user.id) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Forbidden." },
        { status: 403 }
      )
    }

    if (bookingRequest.status !== "PENDING") {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "This request has already been responded to." },
        { status: 409 }
      )
    }

    if (status === "ACCEPTED") {
      const { markListingRented } = await import("@/lib/listing-service")
      try {
        const { revalidatePath } = await import("next/cache")
        const updated = await prisma.$transaction(async (tx) => {
          const req = await tx.bookingRequest.update({
            where: { id: requestId },
            data: {
              status: "ACCEPTED",
              respondedAt: new Date(),
            },
            select: {
              id: true,
              status: true,
              respondedAt: true,
              listingId: true,
            },
          })

          const resRented = await markListingRented(req.listingId, user.id, tx)
          if (!resRented.ok) {
            throw new Error(resRented.message)
          }

          // Auto-reject other pending requests for the same listing
          await tx.bookingRequest.updateMany({
            where: {
              listingId: req.listingId,
              status: "PENDING",
              id: { not: requestId },
            },
            data: {
              status: "REJECTED",
              respondedAt: new Date(),
            },
          })

          return req
        })

        // Force revalidation of cached listing & dashboard paths
        try {
          revalidatePath("/listings")
          revalidatePath("/owner/dashboard")
          revalidatePath("/owner/my-listings")
          revalidatePath(`/listings/${updated.listingId}`)
        } catch (e) {
          console.warn("[revalidatePath failed]", e)
        }

        return NextResponse.json<ApiSuccessResponse<typeof updated>>(
          { success: true, data: updated },
          { status: 200 }
        )
      } catch (transactionError: any) {
        return NextResponse.json<ApiErrorResponse>(
          { success: false, error: transactionError.message || "Failed to accept booking request." },
          { status: 500 }
        )
      }
    } else {
      // status === "REJECTED"
      const updated = await prisma.bookingRequest.update({
        where: { id: requestId },
        data: {
          status: "REJECTED",
          respondedAt: new Date(),
        },
        select: {
          id: true,
          status: true,
          respondedAt: true,
          listingId: true,
        },
      })

      try {
        const { revalidatePath } = await import("next/cache")
        revalidatePath(`/listings/${updated.listingId}`)
      } catch (e) {
        console.warn("[revalidatePath failed]", e)
      }

      return NextResponse.json<ApiSuccessResponse<typeof updated>>(
        { success: true, data: updated },
        { status: 200 }
      )
    }
  } catch (err) {
    console.error("[PATCH /api/booking-requests/[requestId]]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to update booking request." },
      { status: 500 }
    )
  }
}
