import { prisma } from "@/lib/prisma"
import type { DashboardSummaryDTO } from "@/types/listing"

export async function getDashboardSummary(userId: string): Promise<DashboardSummaryDTO> {
  // Use individual counts instead of groupBy to avoid Prisma type complexity.
  // All six queries run in parallel via Promise.all — no sequential round-trips.
  const [total, active, draft, rented, reviewAgg, savesCount] = await Promise.all([
    prisma.listing.count({
      where: { ownerId: userId },
    }),
    prisma.listing.count({
      where: { ownerId: userId, status: "ACTIVE" },
    }),
    prisma.listing.count({
      where: { ownerId: userId, status: "DRAFT" },
    }),
    prisma.listing.count({
      where: { ownerId: userId, status: "RENTED" },
    }),
    prisma.review.aggregate({
      where: { listing: { ownerId: userId } },
      _avg: { rating: true },
      _count: { _all: true },
    }),
    prisma.savedListing.count({
      where: { listing: { ownerId: userId } },
    }),
  ])

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
