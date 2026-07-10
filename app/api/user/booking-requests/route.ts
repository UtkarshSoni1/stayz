import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/listing"

// ─── GET /api/user/booking-requests ───────────────────────────────────────────
// Auth required. Returns the logged-in user's own booking requests
// so the BookingCard can show real-time request status on page load.
export async function GET() {
  try {
    const { user, error } = await requireAuth()
    if (error) return error

    const requests = await prisma.bookingRequest.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        listingId: true,
        status: true,
        moveInDate: true,
        guests: true,
        message: true,
        createdAt: true,
        respondedAt: true,
        listing: {
          select: {
            id: true,
            title: true,
            status: true,
            images: {
              orderBy: { sortOrder: "asc" },
              take: 1,
              select: { url: true },
            },
          },
        },
      },
    })

    return NextResponse.json<ApiSuccessResponse<typeof requests>>(
      { success: true, data: requests },
      { status: 200 }
    )
  } catch (err) {
    console.error("[GET /api/user/booking-requests]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to fetch your booking requests." },
      { status: 500 }
    )
  }
}
