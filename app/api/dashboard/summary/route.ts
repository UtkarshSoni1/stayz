import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-helpers"
import { getDashboardSummary } from "@/lib/dashboard-service"
import type { ApiErrorResponse, ApiSuccessResponse, DashboardSummaryDTO } from "@/types/listing"

// ─── GET /api/dashboard/summary ───────────────────────────────────────────────
export async function GET(_req: NextRequest) {
  try {
    const { user, error } = await requireAuth()
    if (error) return error

    const summary = await getDashboardSummary(user.id)

    return NextResponse.json<ApiSuccessResponse<DashboardSummaryDTO>>(
      { success: true, data: summary },
      { status: 200 }
    )
  } catch (err) {
    console.error("[GET /api/dashboard/summary]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to fetch dashboard summary." },
      { status: 500 }
    )
  }
}
