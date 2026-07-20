import { NextResponse } from "next/server"
import { requireAdminApi } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/listing"

// ─── GET /api/admin/listings/stats ───────────────────────────────────────────
export async function GET() {
  try {
    const { error } = await requireAdminApi()
    if (error) return error

    const [total, grouped] = await Promise.all([
      prisma.listing.count(),
      prisma.listing.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
    ])

    const counts: Record<string, number> = {
      ACTIVE: 0,
      DRAFT: 0,
      RENTED: 0,
      SUSPENDED: 0,
    }

    for (const group of grouped) {
      counts[group.status] = group._count._all
    }

    return NextResponse.json<ApiSuccessResponse<{
      total: number
      active: number
      draft: number
      rented: number
      suspended: number
    }>>({
      success: true,
      data: {
        total,
        active: counts.ACTIVE,
        draft: counts.DRAFT,
        rented: counts.RENTED,
        suspended: counts.SUSPENDED,
      },
    })
  } catch (err) {
    console.error("[GET /api/admin/listings/stats]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to fetch listing stats." },
      { status: 500 }
    )
  }
}
