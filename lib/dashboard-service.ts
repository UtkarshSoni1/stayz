import { prisma } from "@/lib/prisma"
import type { DashboardSummaryDTO } from "@/types/listing"

export async function getDashboardSummary(userId: string): Promise<DashboardSummaryDTO> {
  // Run all aggregations in parallel to avoid N+1
  const [counts, reviewAgg, savesCount] = await Promise.all([
    // Count listings by status
    prisma.listing.groupBy({
      by: ["status"],
      where: { ownerId: userId },
      _count: { _all: true },
    }),

    // Aggregate reviews across all user's listings
    prisma.review.aggregate({
      where: {
        listing: { ownerId: userId },
      },
      _avg: { rating: true },
      _count: { _all: true },
    }),

    // Count total saves across all user's listings
    prisma.savedListing.count({
      where: {
        listing: { ownerId: userId },
      },
    }),
  ])

  const total = counts.reduce((acc, g) => acc + g._count._all, 0)
  const active = counts.find((g) => g.status === "ACTIVE")?._count._all ?? 0
  const draft = counts.find((g) => g.status === "DRAFT")?._count._all ?? 0
  const rented = counts.find((g) => g.status === "RENTED")?._count._all ?? 0

  const avgRaw = reviewAgg._avg.rating
  const avgRating = avgRaw !== null ? Math.round(avgRaw * 10) / 10 : null

  return {
    total,
    active,
    draft,
    rented,
    avgRating,
    totalReviews: reviewAgg._count._all,
    totalSaves: savesCount,
  }
}
