import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/listing"
import type { AdminReportDTO, PaginatedResponse } from "@/types/admin"
import type { ReportStatus, ReportType } from "@prisma/client"

const PAGE_SIZE = 20

// ─── GET /api/admin/reports ───────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { user, error } = await requireAuth()
    if (error) return error
    if (user.role !== "ADMIN") {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Forbidden." },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")?.trim() || undefined
    const status = (searchParams.get("status") || undefined) as
      | ReportStatus
      | undefined
    const reportType = (searchParams.get("reportType") || undefined) as
      | ReportType
      | undefined
    const page = Math.max(1, Number(searchParams.get("page") || 1))

    const where = {
      ...(status && { status }),
      ...(reportType && { reportType }),
      ...(search && {
        OR: [
          {
            reason: { contains: search, mode: "insensitive" as const },
          },
          {
            reporter: {
              OR: [
                { name: { contains: search, mode: "insensitive" as const } },
                { email: { contains: search, mode: "insensitive" as const } },
              ],
            },
          },
        ],
      }),
    }

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: {
          id: true,
          reportType: true,
          reason: true,
          description: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          reporter: { select: { id: true, name: true, email: true } },
          reportedUser: { select: { id: true, name: true, email: true } },
          reportedListing: {
            select: { id: true, title: true, city: true },
          },
        },
      }),
      prisma.report.count({ where }),
    ])

    const data: AdminReportDTO[] = reports.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }))

    return NextResponse.json<ApiSuccessResponse<PaginatedResponse<AdminReportDTO>>>(
      {
        success: true,
        data: {
          data,
          total,
          page,
          pageSize: PAGE_SIZE,
          totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
        },
      },
      { status: 200 }
    )
  } catch (err) {
    console.error("[GET /api/admin/reports]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to fetch reports." },
      { status: 500 }
    )
  }
}
