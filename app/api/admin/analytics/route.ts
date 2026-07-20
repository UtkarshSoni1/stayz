import { NextRequest, NextResponse } from "next/server"
import { requireAdminApi } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/listing"

// ─── Types ───────────────────────────────────────────────────────────────────

interface KPIs {
  estimatedRevenue: number
  totalBookings: number
  activeListings: number
  activeUsers: number
}

interface DayDataPoint {
  date: string // YYYY-MM-DD
  revenue: number
}

interface BookingDayDataPoint {
  date: string
  count: number
}

interface StatusSegment {
  status: string // "Pending" | "Confirmed" | "Cancelled"
  count: number
}

interface CityRevenue {
  city: string
  revenue: number
}

interface TopListing {
  id: string
  title: string
  city: string
  monthlyRent: number
  reviewCount: number
  avgRating: number
  confirmedBookings: number
}

interface RecentBooking {
  id: string
  listingTitle: string
  userName: string | null
  status: string
  createdAt: string
}

export interface AnalyticsPayload {
  kpis: KPIs
  revenueByDay: DayDataPoint[]
  bookingsByDay: BookingDayDataPoint[]
  bookingsByStatus: StatusSegment[]
  revenueByCity: CityRevenue[]
  topListings: TopListing[]
  recentBookings: RecentBooking[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseRange(range: string | null): Date {
  const now = new Date()
  switch (range) {
    case "7d":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    case "90d":
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    case "1y":
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    case "30d":
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  ACCEPTED: "Confirmed",
  REJECTED: "Cancelled",
}

// ─── GET /api/admin/analytics ────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const { error } = await requireAdminApi()
    if (error) return error

    const range = req.nextUrl.searchParams.get("range")
    const since = parseRange(range)

    const [
      // KPI: estimated revenue — SUM(listing.monthlyRent) for ACCEPTED bookings
      acceptedBookings,
      // KPI: total bookings in range
      totalBookings,
      // KPI: active listings
      activeListings,
      // KPI: active users (distinct userId with ≥1 booking OR saved listing in range)
      activeBookingUsers,
      activeSaveUsers,
      // Bookings by status
      bookingsByStatusRaw,
      // Revenue by day (ACCEPTED bookings grouped by day)
      revenueByDayRaw,
      // Bookings by day
      bookingsByDayRaw,
      // Revenue by city
      revenueByCityRaw,
      // Top performing listings (by ACCEPTED booking count)
      topListingsRaw,
      // Recent bookings
      recentBookingsRaw,
    ] = await Promise.all([
      // 1. Estimated revenue
      prisma.bookingRequest.findMany({
        where: { status: "ACCEPTED", createdAt: { gte: since } },
        select: { listing: { select: { monthlyRent: true } } },
      }),

      // 2. Total bookings
      prisma.bookingRequest.count({
        where: { createdAt: { gte: since } },
      }),

      // 3. Active listings
      prisma.listing.count({ where: { status: "ACTIVE" } }),

      // 4a. Active users from bookings
      prisma.bookingRequest.findMany({
        where: { createdAt: { gte: since } },
        select: { userId: true },
        distinct: ["userId"],
      }),

      // 4b. Active users from saved listings
      prisma.savedListing.findMany({
        where: { createdAt: { gte: since } },
        select: { userId: true },
        distinct: ["userId"],
      }),

      // 5. Bookings grouped by status
      prisma.bookingRequest.groupBy({
        by: ["status"],
        where: { createdAt: { gte: since } },
        _count: { _all: true },
      }),

      // 6. Revenue by day (ACCEPTED bookings with listing monthlyRent)
      prisma.bookingRequest.findMany({
        where: { status: "ACCEPTED", createdAt: { gte: since } },
        select: {
          createdAt: true,
          listing: { select: { monthlyRent: true } },
        },
        orderBy: { createdAt: "asc" },
      }),

      // 7. Bookings by day
      prisma.bookingRequest.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true },
        orderBy: { createdAt: "asc" },
      }),

      // 8. Revenue by city (ACCEPTED bookings)
      prisma.bookingRequest.findMany({
        where: { status: "ACCEPTED", createdAt: { gte: since } },
        select: {
          listing: { select: { city: true, monthlyRent: true } },
        },
      }),

      // 9. Top listings by ACCEPTED booking count
      prisma.listing.findMany({
        where: {
          bookingRequests: {
            some: { status: "ACCEPTED", createdAt: { gte: since } },
          },
        },
        select: {
          id: true,
          title: true,
          city: true,
          monthlyRent: true,
          reviewCount: true,
          avgRating: true,
          _count: {
            select: {
              bookingRequests: {
                where: { status: "ACCEPTED", createdAt: { gte: since } },
              } as never,
            },
          },
        },
        orderBy: [{ reviewCount: "desc" }, { avgRating: "desc" }],
        take: 20,
      }),

      // 10. Recent bookings
      prisma.bookingRequest.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          status: true,
          createdAt: true,
          listing: { select: { title: true } },
          user: { select: { name: true } },
        },
      }),
    ])

    // ── Compute KPIs ──────────────────────────────────────────────────────────

    const estimatedRevenue = acceptedBookings.reduce(
      (sum, b) => sum + b.listing.monthlyRent,
      0
    )

    // Active users = union of booking users + save users
    const activeUserIds = new Set<string>()
    activeBookingUsers.forEach((u) => activeUserIds.add(u.userId))
    activeSaveUsers.forEach((u) => activeUserIds.add(u.userId))

    const kpis: KPIs = {
      estimatedRevenue,
      totalBookings,
      activeListings,
      activeUsers: activeUserIds.size,
    }

    // ── Bookings by status ────────────────────────────────────────────────────

    const bookingsByStatus: StatusSegment[] = bookingsByStatusRaw.map((g) => ({
      status: STATUS_LABEL[g.status] ?? g.status,
      count: g._count._all,
    }))

    // ── Revenue by day ────────────────────────────────────────────────────────

    const revDayMap = new Map<string, number>()
    for (const b of revenueByDayRaw) {
      const day = b.createdAt.toISOString().slice(0, 10)
      revDayMap.set(day, (revDayMap.get(day) ?? 0) + b.listing.monthlyRent)
    }
    const revenueByDay: DayDataPoint[] = Array.from(revDayMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, revenue]) => ({ date, revenue }))

    // ── Bookings by day ───────────────────────────────────────────────────────

    const bookDayMap = new Map<string, number>()
    for (const b of bookingsByDayRaw) {
      const day = b.createdAt.toISOString().slice(0, 10)
      bookDayMap.set(day, (bookDayMap.get(day) ?? 0) + 1)
    }
    const bookingsByDay: BookingDayDataPoint[] = Array.from(
      bookDayMap.entries()
    )
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }))

    // ── Revenue by city ───────────────────────────────────────────────────────

    const cityMap = new Map<string, number>()
    for (const b of revenueByCityRaw) {
      const city = b.listing.city
      cityMap.set(city, (cityMap.get(city) ?? 0) + b.listing.monthlyRent)
    }
    const revenueByCity: CityRevenue[] = Array.from(cityMap.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([city, revenue]) => ({ city, revenue }))

    // ── Top listings ──────────────────────────────────────────────────────────

    const topListings: TopListing[] = topListingsRaw
      .map((l) => ({
        id: l.id,
        title: l.title,
        city: l.city,
        monthlyRent: l.monthlyRent,
        reviewCount: l.reviewCount,
        avgRating: l.avgRating,
        confirmedBookings: (l._count as { bookingRequests: number })
          .bookingRequests,
      }))
      .sort((a, b) => {
        if (b.confirmedBookings !== a.confirmedBookings)
          return b.confirmedBookings - a.confirmedBookings
        if (b.reviewCount !== a.reviewCount)
          return b.reviewCount - a.reviewCount
        return b.avgRating - a.avgRating
      })
      .slice(0, 10)

    // ── Recent bookings ───────────────────────────────────────────────────────

    const recentBookings: RecentBooking[] = recentBookingsRaw.map((b) => ({
      id: b.id,
      listingTitle: b.listing.title,
      userName: b.user.name,
      status: STATUS_LABEL[b.status] ?? b.status,
      createdAt: b.createdAt.toISOString(),
    }))

    // ── Response ──────────────────────────────────────────────────────────────

    return NextResponse.json<ApiSuccessResponse<AnalyticsPayload>>({
      success: true,
      data: {
        kpis,
        revenueByDay,
        bookingsByDay,
        bookingsByStatus,
        revenueByCity,
        topListings,
        recentBookings,
      },
    })
  } catch (err) {
    console.error("[GET /api/admin/analytics]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to fetch analytics data." },
      { status: 500 }
    )
  }
}
