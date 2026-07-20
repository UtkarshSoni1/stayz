import { NextRequest, NextResponse } from "next/server"
import { requireAdminApi } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { deleteListing } from "@/lib/listing-service"
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/listing"

type BulkAction = "SUSPEND" | "ACTIVATE" | "DELETE"

const VALID_ACTIONS: BulkAction[] = ["SUSPEND", "ACTIVATE", "DELETE"]

// ─── PATCH /api/admin/listings/bulk ──────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const { user, error } = await requireAdminApi()
    if (error) return error

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Invalid JSON body." },
        { status: 400 }
      )
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Invalid request body." },
        { status: 400 }
      )
    }

    const { ids, action } = body as { ids?: string[]; action?: string }

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "ids must be a non-empty array of listing IDs." },
        { status: 422 }
      )
    }

    if (!action || !VALID_ACTIONS.includes(action as BulkAction)) {
      return NextResponse.json<ApiErrorResponse>(
        {
          success: false,
          error: `action must be one of: ${VALID_ACTIONS.join(", ")}.`,
        },
        { status: 422 }
      )
    }

    if (action === "DELETE") {
      // Delete each listing inside a transaction — respects existing cascade logic
      await prisma.$transaction(async () => {
        for (const id of ids) {
          await deleteListing(id, user.id, "ADMIN")
        }
      })

      return NextResponse.json<ApiSuccessResponse<{ affected: number }>>({
        success: true,
        data: { affected: ids.length },
      })
    }

    // SUSPEND or ACTIVATE
    const newStatus = action === "SUSPEND" ? "SUSPENDED" : "ACTIVE"
    const isAvailable = newStatus === "ACTIVE"

    const result = await prisma.listing.updateMany({
      where: { id: { in: ids } },
      data: { status: newStatus, isAvailable },
    })

    return NextResponse.json<ApiSuccessResponse<{ affected: number }>>({
      success: true,
      data: { affected: result.count },
    })
  } catch (err) {
    console.error("[PATCH /api/admin/listings/bulk]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Bulk operation failed." },
      { status: 500 }
    )
  }
}
