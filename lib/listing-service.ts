import { prisma } from "@/lib/prisma"
import { deleteManyFromCloudinary } from "@/lib/cloudinary"
import type { ListingStatus, RoomType } from "@prisma/client"
import type { MyListingDTO, UpdateListingPayload } from "@/types/listing"

// ─── Shared select for listing cards ─────────────────────────────────────────

const LISTING_CARD_SELECT = {
  id: true,
  title: true,
  city: true,
  locality: true,
  monthlyRent: true,
  roomType: true,
  furnishing: true,
  genderPreference: true,
  status: true,
  createdAt: true,
  images: {
    orderBy: { sortOrder: "asc" as const },
    take: 1,
    select: { url: true },
  },
  _count: {
    select: { reviews: true, saves: true },
  },
  reviews: {
    select: { rating: true },
  },
} as const

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeAverageRating(reviews: { rating: number }[]): number | null {
  if (reviews.length === 0) return null
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80"

function toMyListingDTO(listing: {
  id: string
  title: string
  city: string
  locality: string
  monthlyRent: number
  roomType: RoomType
  furnishing: string
  genderPreference: string
  status: ListingStatus
  createdAt: Date
  images: { url: string }[]
  _count: { reviews: number; saves: number }
  reviews: { rating: number }[]
}): MyListingDTO {
  return {
    id: listing.id,
    title: listing.title,
    city: listing.city,
    locality: listing.locality,
    rent: listing.monthlyRent,
    roomType: listing.roomType,
    furnishing: listing.furnishing as MyListingDTO["furnishing"],
    genderPreference: listing.genderPreference as MyListingDTO["genderPreference"],
    status: listing.status,
    coverImage: listing.images[0]?.url ?? PLACEHOLDER_IMAGE,
    rating: computeAverageRating(listing.reviews),
    reviews: listing._count.reviews,
    saves: listing._count.saves,
    createdAt: listing.createdAt.toISOString(),
  }
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface MyListingsFilters {
  search?: string
  status?: "ALL" | ListingStatus
  roomType?: "ALL" | RoomType
  sort?: "NEWEST" | "OLDEST" | "RENT_HIGH_LOW" | "RENT_LOW_HIGH"
}

// ─── getMyListings ────────────────────────────────────────────────────────────

export async function getMyListings(
  ownerId: string,
  filters: MyListingsFilters = {}
): Promise<MyListingDTO[]> {
  const { search, status, roomType, sort = "NEWEST" } = filters

  const listings = await prisma.listing.findMany({
    where: {
      ownerId,
      ...(status && status !== "ALL" ? { status } : {}),
      ...(roomType && roomType !== "ALL" ? { roomType } : {}),
      ...(search?.trim()
        ? {
            OR: [
              { title: { contains: search.trim(), mode: "insensitive" } },
              { locality: { contains: search.trim(), mode: "insensitive" } },
              { city: { contains: search.trim(), mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy:
      sort === "RENT_HIGH_LOW"
        ? { monthlyRent: "desc" }
        : sort === "RENT_LOW_HIGH"
        ? { monthlyRent: "asc" }
        : sort === "OLDEST"
        ? { createdAt: "asc" }
        : { createdAt: "desc" },
    select: LISTING_CARD_SELECT,
  })

  return listings.map(toMyListingDTO)
}

// ─── getListingById ───────────────────────────────────────────────────────────

export async function getListingById(id: string) {
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      amenities: { include: { amenity: true } },
      owner: { select: { id: true, name: true, image: true } },
      reviews: {
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { saves: true } },
    },
  })

  if (!listing) return null

  const avgRating = computeAverageRating(listing.reviews)
  return { ...listing, avgRating, reviewCount: listing.reviews.length }
}

// ─── updateListing ────────────────────────────────────────────────────────────

export async function updateListing(
  id: string,
  ownerId: string,
  payload: UpdateListingPayload
): Promise<{ ok: true; listing: unknown } | { ok: false; status: 403 | 404; message: string }> {
  const existing = await prisma.listing.findUnique({
    where: { id },
    select: { ownerId: true },
  })

  if (!existing) return { ok: false, status: 404, message: "Listing not found." }
  if (existing.ownerId !== ownerId)
    return { ok: false, status: 403, message: "Forbidden." }

  const { amenities, status, images, ...rest } = payload

  // Derive isAvailable from status if provided
  const statusData: { status?: ListingStatus; isAvailable?: boolean } =
    status === "ACTIVE"
      ? { status: "ACTIVE", isAvailable: true }
      : status === "DRAFT"
      ? { status: "DRAFT", isAvailable: false }
      : {}

  const listing = await prisma.$transaction(async (tx) => {
    const updated = await tx.listing.update({
      where: { id },
      data: {
        ...(rest.title !== undefined && { title: rest.title }),
        ...(rest.description !== undefined && { description: rest.description }),
        ...(rest.city !== undefined && { city: rest.city }),
        ...(rest.locality !== undefined && { locality: rest.locality }),
        ...(rest.address !== undefined && { address: rest.address }),
        ...(rest.pincode !== undefined && { pincode: rest.pincode }),
        ...(rest.monthlyRent !== undefined && { monthlyRent: rest.monthlyRent }),
        ...(rest.securityDeposit !== undefined && { deposit: rest.securityDeposit }),
        ...(rest.roomType !== undefined && { roomType: rest.roomType }),
        ...(rest.furnishing !== undefined && { furnishing: rest.furnishing }),
        ...(rest.genderPreference !== undefined && { genderPreference: rest.genderPreference }),
        ...statusData,
      },
      select: { id: true, title: true, status: true, updatedAt: true },
    })

    if (amenities !== undefined) {
      // Replace amenities via junction table
      await tx.listingAmenity.deleteMany({ where: { listingId: id } })
      if (amenities.length > 0) {
        const amenityRecords = await Promise.all(
          amenities.map((name) =>
            tx.amenity.upsert({
              where: { name },
              update: {},
              create: { name },
              select: { id: true },
            })
          )
        )
        await tx.listingAmenity.createMany({
          data: amenityRecords.map((a) => ({ listingId: id, amenityId: a.id })),
        })
      }
    }

    if (images !== undefined) {
      // 1. Find images that are being removed to delete them from Cloudinary
      const existingImages = await tx.listingImage.findMany({
        where: { listingId: id },
        select: { publicId: true },
      })
      const newPublicIds = new Set(images.map((img) => img.publicId))
      const removedPublicIds = existingImages
        .map((img) => img.publicId)
        .filter((pid): pid is string => !!pid && !newPublicIds.has(pid))

      if (removedPublicIds.length > 0) {
        try {
          await deleteManyFromCloudinary(removedPublicIds)
        } catch (cErr) {
          console.error("[updateListing] Failed to delete removed images from Cloudinary:", cErr)
        }
      }

      // 2. Delete existing images from DB
      await tx.listingImage.deleteMany({ where: { listingId: id } })

      // 3. Create new image records
      if (images.length > 0) {
        await tx.listingImage.createMany({
          data: images.map((img) => ({
            listingId: id,
            url: img.url,
            publicId: img.publicId,
            sortOrder: img.sortOrder,
          })),
        })
      }
    }

    return updated
  })

  return { ok: true, listing }
}

// ─── duplicateListing ─────────────────────────────────────────────────────────

export async function duplicateListing(
  id: string,
  ownerId: string
): Promise<{ ok: true; listing: MyListingDTO } | { ok: false; status: 403 | 404; message: string }> {
  const original = await prisma.listing.findUnique({
    where: { id },
    include: {
      amenities: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  })

  if (!original) return { ok: false, status: 404, message: "Listing not found." }
  if (original.ownerId !== ownerId) return { ok: false, status: 403, message: "Forbidden." }

  const copy = await prisma.listing.create({
    data: {
      ownerId,
      title: `${original.title} (Copy)`,
      description: original.description,
      city: original.city,
      locality: original.locality,
      address: original.address,
      pincode: original.pincode,
      monthlyRent: original.monthlyRent,
      deposit: original.deposit,
      roomType: original.roomType,
      furnishing: original.furnishing,
      genderPreference: original.genderPreference,
      status: "DRAFT",       // always start as draft
      isAvailable: false,
      amenities: original.amenities.length > 0
        ? {
            create: original.amenities.map((a) => ({
              amenity: { connect: { id: a.amenityId } },
            })),
          }
        : undefined,
      images: original.images.length > 0
        ? {
            create: original.images.map((img) => ({
              url: img.url,
              publicId: img.publicId,
              sortOrder: img.sortOrder,
            })),
          }
        : undefined,
    },
    select: LISTING_CARD_SELECT,
  })

  return { ok: true, listing: toMyListingDTO(copy) }
}

// ─── markListingRented ────────────────────────────────────────────────────────

export async function markListingRented(
  id: string,
  ownerId: string,
  tx?: any
): Promise<{ ok: true } | { ok: false; status: 403 | 404; message: string }> {
  const client = tx || prisma
  const existing = await client.listing.findUnique({
    where: { id },
    select: { ownerId: true },
  })

  if (!existing) return { ok: false, status: 404, message: "Listing not found." }
  if (existing.ownerId !== ownerId) return { ok: false, status: 403, message: "Forbidden." }

  await client.listing.update({
    where: { id },
    data: { status: "RENTED", isAvailable: false },
  })

  return { ok: true }
}

// ─── markListingAvailable ─────────────────────────────────────────────────────

export async function markListingAvailable(
  id: string,
  ownerId: string,
  tx?: any
): Promise<{ ok: true } | { ok: false; status: 403 | 404; message: string }> {
  const client = tx || prisma
  const existing = await client.listing.findUnique({
    where: { id },
    select: { ownerId: true },
  })

  if (!existing) return { ok: false, status: 404, message: "Listing not found." }
  if (existing.ownerId !== ownerId) return { ok: false, status: 403, message: "Forbidden." }

  await client.listing.update({
    where: { id },
    data: { status: "ACTIVE", isAvailable: true },
  })

  return { ok: true }
}

// ─── deleteListing ────────────────────────────────────────────────────────────

export async function deleteListing(
  id: string,
  ownerId: string,
  userRole?: string
): Promise<{ ok: true } | { ok: false; status: 403 | 404; message: string }> {
  const existing = await prisma.listing.findUnique({
    where: { id },
    select: {
      ownerId: true,
      // Fetch all images so we can clean up Cloudinary
      images: { select: { publicId: true } },
    },
  })

  if (!existing) return { ok: false, status: 404, message: "Listing not found." }
  if (existing.ownerId !== ownerId && userRole !== "ADMIN")
    return { ok: false, status: 403, message: "Forbidden." }

  // 1. Delete Cloudinary assets (non-blocking failure — log only)
  const publicIds = existing.images
    .map((img) => img.publicId)
    .filter((pid): pid is string => !!pid)

  await deleteManyFromCloudinary(publicIds)

  // 2. Delete the listing — DB cascade removes ListingImage rows
  await prisma.listing.delete({ where: { id } })

  return { ok: true }
}
