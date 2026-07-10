import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id: listingId } = await params

    if (!session?.user?.id) {
      return NextResponse.json({
        success: true,
        data: {
          eligible: false,
          reason: "sign_in_required",
          alreadyReviewed: false,
          existingReview: null,
        },
      })
    }

    const userId = session.user.id

    // Check for an ACCEPTED BookingRequest
    const acceptedRequest = await prisma.bookingRequest.findFirst({
      where: {
        listingId,
        userId,
        status: "ACCEPTED",
      },
    })

    // Check if the user already submitted a review
    const existingReview = await prisma.review.findUnique({
      where: {
        listingId_userId: {
          listingId,
          userId,
        },
      },
    })

    if (!acceptedRequest) {
      return NextResponse.json({
        success: true,
        data: {
          eligible: false,
          reason: "not_a_tenant",
          alreadyReviewed: !!existingReview,
          existingReview,
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        eligible: true,
        alreadyReviewed: !!existingReview,
        existingReview,
      },
    })
  } catch (err) {
    console.error("[GET /api/listings/[id]/review-eligibility]", err)
    return NextResponse.json(
      { success: false, error: "Failed to verify review eligibility." },
      { status: 500 }
    )
  }
}
