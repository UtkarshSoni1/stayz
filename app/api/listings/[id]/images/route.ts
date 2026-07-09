import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary"
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/listing"

// ─── Constants ─────────────────────────────────────────────────────────────────
const MAX_IMAGES = 10
const MAX_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"])

// ─── Ownership guard ───────────────────────────────────────────────────────────
async function assertOwner(listingId: string, userId: string, userRole?: string) {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { ownerId: true },
  })
  if (!listing) return { ok: false as const, status: 404 as const, message: "Listing not found." }
  if (listing.ownerId !== userId && userRole !== "ADMIN")
    return { ok: false as const, status: 403 as const, message: "Forbidden." }
  return { ok: true as const }
}

// ─── POST /api/listings/[id]/images ───────────────────────────────────────────
// Upload a new image to an existing listing.
// Expects multipart/form-data with an "image" field.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAuth()
    if (error) return error

    const { id: listingId } = await params

    const guard = await assertOwner(listingId, user.id, user.role)
    if (!guard.ok) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: guard.message },
        { status: guard.status }
      )
    }

    // Check current image count
    const count = await prisma.listingImage.count({ where: { listingId } })
    if (count >= MAX_IMAGES) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: `Maximum of ${MAX_IMAGES} images allowed per listing.` },
        { status: 400 }
      )
    }

    // Parse multipart
    let formData: FormData
    try {
      formData = await req.formData()
    } catch {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Invalid multipart form data." },
        { status: 400 }
      )
    }

    const file = formData.get("image")
    if (!file || typeof file === "string") {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "No image file provided." },
        { status: 400 }
      )
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: `Invalid file type. Only JPG, PNG and WEBP are allowed.` },
        { status: 415 }
      )
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: `File too large. Maximum is 5 MB.` },
        { status: 413 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const { url, publicId } = await uploadToCloudinary(buffer, { folder: "stayz/listings" })

    // Determine next sortOrder
    const maxOrder = await prisma.listingImage.findFirst({
      where: { listingId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    })
    const sortOrder = (maxOrder?.sortOrder ?? -1) + 1

    const image = await prisma.listingImage.create({
      data: { listingId, url, publicId, sortOrder },
      select: { id: true, url: true, publicId: true, sortOrder: true },
    })

    return NextResponse.json<ApiSuccessResponse<typeof image>>(
      { success: true, data: image },
      { status: 201 }
    )
  } catch (err) {
    console.error("[POST /api/listings/[id]/images]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to upload image." },
      { status: 500 }
    )
  }
}

// ─── DELETE /api/listings/[id]/images ─────────────────────────────────────────
// Delete a specific image by publicId.
// Expects JSON body: { publicId: string }
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAuth()
    if (error) return error

    const { id: listingId } = await params

    const guard = await assertOwner(listingId, user.id, user.role)
    if (!guard.ok) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: guard.message },
        { status: guard.status }
      )
    }

    let body: { publicId?: string }
    try {
      body = await req.json()
    } catch {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Invalid JSON body." },
        { status: 400 }
      )
    }

    if (!body.publicId || typeof body.publicId !== "string") {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "publicId is required." },
        { status: 400 }
      )
    }

    // Find the record first
    const image = await prisma.listingImage.findFirst({
      where: { listingId, publicId: body.publicId },
      select: { id: true, publicId: true },
    })

    if (!image) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Image not found." },
        { status: 404 }
      )
    }

    // Delete from Cloudinary then DB
    await deleteFromCloudinary(image.publicId!)
    await prisma.listingImage.delete({ where: { id: image.id } })

    return NextResponse.json<ApiSuccessResponse<null>>(
      { success: true, data: null },
      { status: 200 }
    )
  } catch (err) {
    console.error("[DELETE /api/listings/[id]/images]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to delete image." },
      { status: 500 }
    )
  }
}

// ─── PATCH /api/listings/[id]/images ──────────────────────────────────────────
// Reorder images. Expects JSON body: { order: { id: string; sortOrder: number }[] }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAuth()
    if (error) return error

    const { id: listingId } = await params

    const guard = await assertOwner(listingId, user.id, user.role)
    if (!guard.ok) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: guard.message },
        { status: guard.status }
      )
    }

    let body: { order?: { id: string; sortOrder: number }[] }
    try {
      body = await req.json()
    } catch {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Invalid JSON body." },
        { status: 400 }
      )
    }

    if (!Array.isArray(body.order) || body.order.length === 0) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "order must be a non-empty array of { id, sortOrder }." },
        { status: 400 }
      )
    }

    // Update sortOrder for each image in a transaction
    await prisma.$transaction(
      body.order.map(({ id, sortOrder }) =>
        prisma.listingImage.updateMany({
          where: { id, listingId },
          data: { sortOrder },
        })
      )
    )

    // Return updated images ordered by sortOrder
    const images = await prisma.listingImage.findMany({
      where: { listingId },
      orderBy: { sortOrder: "asc" },
      select: { id: true, url: true, publicId: true, sortOrder: true },
    })

    return NextResponse.json<ApiSuccessResponse<typeof images>>(
      { success: true, data: images },
      { status: 200 }
    )
  } catch (err) {
    console.error("[PATCH /api/listings/[id]/images]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to reorder images." },
      { status: 500 }
    )
  }
}
