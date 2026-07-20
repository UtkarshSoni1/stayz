import { NextRequest, NextResponse } from "next/server"
import { requireAdminApi } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/listing"

// ─── GET /api/admin/listings ─────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { error } = await requireAdminApi()
    if (error) return error

    const url = req.nextUrl
    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10))
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") ?? "20", 10)))
    const search = url.searchParams.get("search")?.trim() || undefined
    const status = url.searchParams.get("status") || undefined
    const propertyType = url.searchParams.get("propertyType") || undefined
    const city = url.searchParams.get("city") || undefined

    // Build where clause
    const where: Record<string, unknown> = {}

    if (status && status !== "ALL") {
      where.status = status
    }

    if (propertyType && propertyType !== "ALL") {
      where.propertyType = propertyType
    }

    if (city) {
      where.city = { contains: city, mode: "insensitive" }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { owner: { name: { contains: search, mode: "insensitive" } } },
        { owner: { email: { contains: search, mode: "insensitive" } } },
      ]
    }

    const skip = (page - 1) * limit

    const [items, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          city: true,
          locality: true,
          monthlyRent: true,
          status: true,
          propertyType: true,
          createdAt: true,
          reviewCount: true,
          avgRating: true,
          images: {
            orderBy: { sortOrder: "asc" },
            take: 1,
            select: { url: true },
          },
          owner: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: { bookingRequests: true },
          },
        },
      }),
      prisma.listing.count({ where }),
    ])

    return NextResponse.json<ApiSuccessResponse<{
      items: typeof items
      total: number
      page: number
      limit: number
    }>>({
      success: true,
      data: { items, total, page, limit },
    })
  } catch (err) {
    console.error("[GET /api/admin/listings]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to fetch listings." },
      { status: 500 }
    )
  }
}
