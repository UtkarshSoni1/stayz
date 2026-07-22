import { NextRequest, NextResponse } from "next/server"
import { requireAdminApi } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/listing"
import type { PlatformSettings } from "@prisma/client"

// ─── GET /api/admin/settings ──────────────────────────────────────────────────
// Returns the singleton settings row, creating it with defaults on first call.
export async function GET() {
  try {
    const { error } = await requireAdminApi()
    if (error) return error

    const settings = await prisma.platformSettings.upsert({
      where: { id: "singleton" },
      create: { id: "singleton" },
      update: {},
    })

    return NextResponse.json<ApiSuccessResponse<PlatformSettings>>({
      success: true,
      data: settings,
    })
  } catch (err) {
    console.error("[GET /api/admin/settings]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to fetch settings." },
      { status: 500 }
    )
  }
}

// ─── PATCH /api/admin/settings ────────────────────────────────────────────────
// Accepts a partial body of PlatformSettings fields and upserts the singleton row.
export async function PATCH(req: NextRequest) {
  try {
    const { user, error } = await requireAdminApi()
    if (error) return error

    const body = await req.json()

    // Allow-list the mutable fields — never let clients touch id / updatedAt.
    const {
      maintenanceMode,
      signupsEnabled,
      autoApproveListings,
      featuredCities,
      supportEmail,
    } = body as Partial<
      Pick<
        PlatformSettings,
        | "maintenanceMode"
        | "signupsEnabled"
        | "autoApproveListings"
        | "featuredCities"
        | "supportEmail"
      >
    >

    const data: Record<string, unknown> = { updatedBy: user.id }
    if (typeof maintenanceMode === "boolean") data.maintenanceMode = maintenanceMode
    if (typeof signupsEnabled === "boolean") data.signupsEnabled = signupsEnabled
    if (typeof autoApproveListings === "boolean") data.autoApproveListings = autoApproveListings
    if (Array.isArray(featuredCities)) data.featuredCities = featuredCities
    if (supportEmail !== undefined) data.supportEmail = supportEmail || null

    const settings = await prisma.platformSettings.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", ...data },
      update: data,
    })

    return NextResponse.json<ApiSuccessResponse<PlatformSettings>>({
      success: true,
      data: settings,
    })
  } catch (err) {
    console.error("[PATCH /api/admin/settings]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to update settings." },
      { status: 500 }
    )
  }
}
