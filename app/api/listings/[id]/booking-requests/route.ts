import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/listing"

// ─── POST /api/listings/[id]/booking-requests ─────────────────────────────────
// Auth required. Creates a PENDING booking request.
// Rejects with 409 if a PENDING request from this user already exists.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAuth()
    if (error) return error

    const { id: listingId } = await params

    // Verify listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true, ownerId: true },
    })
    if (!listing) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Listing not found." },
        { status: 404 }
      )
    }

    // Owners can't request their own listing
    if (listing.ownerId === user.id) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "You cannot request your own listing." },
        { status: 400 }
      )
    }

    // Check for existing PENDING request from this user
    const existingPending = await prisma.bookingRequest.findFirst({
      where: {
        listingId,
        userId: user.id,
        status: "PENDING",
      },
    })
    if (existingPending) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "You already have a pending request for this listing." },
        { status: 409 }
      )
    }

    // Parse optional body
    let body: { moveInDate?: string; guests?: number; message?: string } = {}
    try {
      body = await req.json()
    } catch {
      // Body is optional, empty is fine
    }

    const bookingRequest = await prisma.bookingRequest.create({
      data: {
        listingId,
        userId: user.id,
        status: "PENDING",
        moveInDate: body.moveInDate ? new Date(body.moveInDate) : null,
        guests: body.guests ?? null,
        message: body.message?.trim() || null,
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    })

    return NextResponse.json<ApiSuccessResponse<typeof bookingRequest>>(
      { success: true, data: bookingRequest },
      { status: 201 }
    )
  } catch (err) {
    console.error("[POST /api/listings/[id]/booking-requests]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to create booking request." },
      { status: 500 }
    )
  }
}

// ─── GET /api/listings/[id]/booking-requests ──────────────────────────────────
// Owner-only. Returns all requests for this listing with user info.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAuth()
    if (error) return error

    const { id: listingId } = await params

    // Verify listing exists and belongs to this owner
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { ownerId: true, title: true },
    })
    if (!listing) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Listing not found." },
        { status: 404 }
      )
    }
    if (listing.ownerId !== user.id) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Forbidden." },
        { status: 403 }
      )
    }

    const requests = await prisma.bookingRequest.findMany({
      where: { listingId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        moveInDate: true,
        guests: true,
        message: true,
        createdAt: true,
        respondedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json<ApiSuccessResponse<typeof requests>>(
      { success: true, data: requests },
      { status: 200 }
    )
  } catch (err) {
    console.error("[GET /api/listings/[id]/booking-requests]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to fetch booking requests." },
      { status: 500 }
    )
  }
}
