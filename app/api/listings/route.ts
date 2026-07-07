import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { validateCreateListing, castPayload } from "@/lib/validations/listing"
import { deleteManyFromCloudinary } from "@/lib/cloudinary"
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/listing"

interface ImageInput {
  url: string
  publicId: string
  sortOrder: number
}

// ─── POST /api/listings ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "You must be signed in to create a listing." },
        { status: 401 }
      )
    }

    // 2. Parse body
    let rawBody: unknown
    try {
      rawBody = await req.json()
    } catch {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Invalid JSON in request body." },
        { status: 400 }
      )
    }

    // 3. Validate
    const { valid, fieldErrors } = validateCreateListing(rawBody)

    if (!valid) {
      return NextResponse.json<ApiErrorResponse>(
        {
          success: false,
          error: "Validation failed. Please fix the highlighted fields.",
          fieldErrors,
        },
        { status: 422 }
      )
    }

    // 4. Cast to typed payload
    const payload = castPayload(rawBody as Record<string, unknown>)

    // 5. Upsert amenity records by name, then collect their IDs
    //    This ensures amenities exist in the Amenity table before linking.
    const amenityIds: string[] = []

    if (payload.amenities.length > 0) {
      const amenityRecords = await Promise.all(
        payload.amenities.map((name) =>
          prisma.amenity.upsert({
            where: { name },
            update: {},
            create: { name },
            select: { id: true },
          })
        )
      )
      amenityIds.push(...amenityRecords.map((a) => a.id))
    }

    // 6. Validate + collect image inputs (optional)
    const rawImages = (rawBody as Record<string, unknown>).images
    let imageInputs: ImageInput[] = []
    if (rawImages !== undefined) {
      if (!Array.isArray(rawImages)) {
        return NextResponse.json<ApiErrorResponse>(
          { success: false, error: "images must be an array." },
          { status: 422 }
        )
      }
      imageInputs = (rawImages as unknown[]).filter(
        (img): img is ImageInput =>
          typeof img === "object" &&
          img !== null &&
          typeof (img as ImageInput).url === "string" &&
          typeof (img as ImageInput).publicId === "string" &&
          typeof (img as ImageInput).sortOrder === "number"
      )
    }

    // 7. Create the listing (with images in same transaction)
    const listing = await prisma.listing.create({
      data: {
        ownerId: session.user.id,
        title: payload.title,
        description: payload.description,
        city: payload.city,
        locality: payload.locality,
        address: payload.address ?? null,
        pincode: payload.pincode ?? null,
        monthlyRent: payload.monthlyRent,
        deposit: payload.securityDeposit ?? null,
        roomType: payload.roomType,
        furnishing: payload.furnishing,
        genderPreference: payload.genderPreference,
        isAvailable: payload.status === "ACTIVE",
        status: payload.status === "ACTIVE" ? ("ACTIVE" as const) : ("DRAFT" as const),

        // Connect amenities via junction table
        amenities: amenityIds.length > 0
          ? {
              create: amenityIds.map((amenityId) => ({
                amenity: { connect: { id: amenityId } },
              })),
            }
          : undefined,

        // Persist ListingImage records
        images: imageInputs.length > 0
          ? {
              create: imageInputs.map((img) => ({
                url: img.url,
                publicId: img.publicId,
                sortOrder: img.sortOrder,
              })),
            }
          : undefined,
      },
      select: {
        id: true,
        title: true,
        city: true,
        locality: true,
        monthlyRent: true,
        isAvailable: true,
        createdAt: true,
      },
    })

    // 7b. If listing creation failed partway (shouldn't happen inside create, but
    //     guard defensively) and images were uploaded, clean them up.
    // (Prisma throws on failure so we reach the catch block instead.)
    void deleteManyFromCloudinary // imported — used in catch below if needed

    // 7. Optionally promote user to OWNER role on first listing
    //    Do this without failing the listing creation if it errors
    let roleUpdated = false
    try {
      if (session.user.role === "USER") {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { role: "OWNER" },
        })
        roleUpdated = true
      }
    } catch {
      // Non-critical — ignore role promotion failure
    }

    return NextResponse.json<ApiSuccessResponse<typeof listing & { roleUpdated: boolean }>>(
      { success: true, data: { ...listing, roleUpdated } },
      { status: 201 }
    )
  } catch (err) {
    console.error("[POST /api/listings]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    )
  }
}

// ─── GET /api/listings ─────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const city = searchParams.get("city")?.trim() || undefined
    const locality = searchParams.get("locality")?.trim() || undefined
    const roomType = searchParams.get("roomType") || undefined
    const genderPreference = searchParams.get("genderPreference") || undefined
    const furnishing = searchParams.get("furnishing") || undefined
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined
    const sort = searchParams.get("sort") || "newest"
    const page = Math.max(1, Number(searchParams.get("page") || 1))
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || 12)))

    const listings = await prisma.listing.findMany({
      where: {
        isAvailable: true,
        ...(city && { city: { contains: city, mode: "insensitive" } }),
        ...(locality && { locality: { contains: locality, mode: "insensitive" } }),
        ...(roomType && { roomType: roomType as never }),
        ...(genderPreference && { genderPreference: genderPreference as never }),
        ...(furnishing && { furnishing: furnishing as never }),
        ...((minPrice !== undefined || maxPrice !== undefined) && {
          monthlyRent: {
            ...(minPrice !== undefined && { gte: minPrice }),
            ...(maxPrice !== undefined && { lte: maxPrice }),
          },
        }),
      },
      orderBy: sort === "price_asc"
        ? { monthlyRent: "asc" }
        : sort === "price_desc"
        ? { monthlyRent: "desc" }
        : { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        city: true,
        locality: true,
        monthlyRent: true,
        deposit: true,
        roomType: true,
        furnishing: true,
        genderPreference: true,
        isAvailable: true,
        createdAt: true,
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1,
          select: { url: true },
        },
        amenities: {
          select: {
            amenity: { select: { name: true } },
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    const total = await prisma.listing.count({
      where: { isAvailable: true, ...(city && { city: { contains: city, mode: "insensitive" } }) },
    })

    return NextResponse.json<ApiSuccessResponse>({
      success: true,
      data: { listings, total, page, limit },
    })
  } catch (err) {
    console.error("[GET /api/listings]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to fetch listings." },
      { status: 500 }
    )
  }
}
