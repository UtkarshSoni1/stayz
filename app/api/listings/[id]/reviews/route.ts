import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/listing"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAuth()
    if (error) return error

    const { id: listingId } = await params

    // Re-verify eligibility server-side
    const acceptedRequest = await prisma.bookingRequest.findFirst({
      where: {
        listingId,
        userId: user.id,
        status: "ACCEPTED",
      },
    })
    if (!acceptedRequest) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Only verified past tenants can submit a review." },
        { status: 403 }
      )
    }

    let body: any
    try {
      body = await req.json()
    } catch {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Invalid JSON body." },
        { status: 400 }
      )
    }

    const {
      cleanliness,
      accuracy,
      checkIn,
      communication,
      location,
      value,
      comment,
    } = body

    const scores = [cleanliness, accuracy, checkIn, communication, location, value]
    if (scores.some((s) => typeof s !== "number" || s < 1 || s > 5)) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "All rating categories must be numbers between 1 and 5." },
        { status: 400 }
      )
    }

    // Compute overall rating as the average of the six category scores
    const overallRating = Math.round(scores.reduce((a, b) => a + b, 0) / 6)

    // Execute in a transaction
    await prisma.$transaction(async (tx) => {
      // Upsert the review row
      await tx.review.upsert({
        where: {
          listingId_userId: {
            listingId,
            userId: user.id,
          },
        },
        create: {
          listingId,
          userId: user.id,
          rating: overallRating,
          cleanliness,
          accuracy,
          checkIn,
          communication,
          location,
          value,
          comment: comment?.trim() || null,
        },
        update: {
          rating: overallRating,
          cleanliness,
          accuracy,
          checkIn,
          communication,
          location,
          value,
          comment: comment?.trim() || null,
        },
      })

      // Aggregate and update the listing
      const aggregate = await tx.review.aggregate({
        where: { listingId },
        _avg: {
          rating: true,
          cleanliness: true,
          accuracy: true,
          checkIn: true,
          communication: true,
          location: true,
          value: true,
        },
        _count: {
          _all: true,
        },
      })

      await tx.listing.update({
        where: { id: listingId },
        data: {
          reviewCount: aggregate._count._all || 0,
          avgRating: aggregate._avg.rating || 0,
          avgCleanliness: aggregate._avg.cleanliness || 0,
          avgAccuracy: aggregate._avg.accuracy || 0,
          avgCheckIn: aggregate._avg.checkIn || 0,
          avgCommunication: aggregate._avg.communication || 0,
          avgLocation: aggregate._avg.location || 0,
          avgValue: aggregate._avg.value || 0,
        },
      })
    })

    // Bust cache for the listing page
    try {
      revalidatePath(`/listings/${listingId}`)
      revalidatePath("/listings")
    } catch (e) {
      console.warn("[revalidatePath failed]", e)
    }

    return NextResponse.json<ApiSuccessResponse<null>>(
      { success: true, data: null },
      { status: 200 }
    )
  } catch (err) {
    console.error("[POST /api/listings/[id]/reviews]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to submit review." },
      { status: 500 }
    )
  }
}
