import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/listing"
import type { AdminReportDTO, PatchReportPayload } from "@/types/admin"
import type { ReportStatus } from "@prisma/client"

const VALID_STATUSES: ReportStatus[] = ["PENDING", "RESOLVED", "DISMISSED"]

// ─── GET /api/admin/reports/[id] ──────────────────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAuth()
    if (error) return error
    if (user.role !== "ADMIN") {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Forbidden." },
        { status: 403 }
      )
    }

    const { id } = await params
    const report = await prisma.report.findUnique({
      where: { id },
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
        reportedListing: { select: { id: true, title: true, city: true } },
      },
    })

    if (!report) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Report not found." },
        { status: 404 }
      )
    }

    const data: AdminReportDTO = {
      ...report,
      createdAt: report.createdAt.toISOString(),
      updatedAt: report.updatedAt.toISOString(),
    }

    return NextResponse.json<ApiSuccessResponse<AdminReportDTO>>(
      { success: true, data },
      { status: 200 }
    )
  } catch (err) {
    console.error("[GET /api/admin/reports/[id]]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to fetch report." },
      { status: 500 }
    )
  }
}

// ─── PATCH /api/admin/reports/[id] ────────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAuth()
    if (error) return error
    if (user.role !== "ADMIN") {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Forbidden." },
        { status: 403 }
      )
    }

    const { id } = await params
    let body: PatchReportPayload
    try {
      body = (await req.json()) as PatchReportPayload
    } catch {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Invalid JSON." },
        { status: 400 }
      )
    }

    if (!body.status || !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Invalid status value." },
        { status: 400 }
      )
    }

    const existing = await prisma.report.findUnique({
      where: { id },
      select: { id: true },
    })
    if (!existing) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Report not found." },
        { status: 404 }
      )
    }

    const updated = await prisma.report.update({
      where: { id },
      data: { status: body.status },
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
        reportedListing: { select: { id: true, title: true, city: true } },
      },
    })

    const data: AdminReportDTO = {
      ...updated,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    }

    return NextResponse.json<ApiSuccessResponse<AdminReportDTO>>(
      { success: true, data },
      { status: 200 }
    )
  } catch (err) {
    console.error("[PATCH /api/admin/reports/[id]]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to update report." },
      { status: 500 }
    )
  }
}

// ─── DELETE /api/admin/reports/[id] ───────────────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAuth()
    if (error) return error
    if (user.role !== "ADMIN") {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Forbidden." },
        { status: 403 }
      )
    }

    const { id } = await params
    const existing = await prisma.report.findUnique({
      where: { id },
      select: { id: true },
    })
    if (!existing) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Report not found." },
        { status: 404 }
      )
    }

    await prisma.report.delete({ where: { id } })

    return NextResponse.json<ApiSuccessResponse<{ id: string }>>(
      { success: true, data: { id } },
      { status: 200 }
    )
  } catch (err) {
    console.error("[DELETE /api/admin/reports/[id]]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to delete report." },
      { status: 500 }
    )
  }
}
