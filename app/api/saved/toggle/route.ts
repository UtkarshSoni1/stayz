import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-helpers"
import { toggleSave } from "@/lib/saved-service"
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/listing"

// ─── PATCH /api/saved/toggle ──────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const { user, error } = await requireAuth()
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

    const listingId =
      typeof body === "object" && body !== null && "listingId" in body
        ? (body as { listingId: unknown }).listingId
        : undefined

    if (typeof listingId !== "string" || !listingId.trim()) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "listingId is required." },
        { status: 422 }
      )
    }

    const result = await toggleSave(user.id, listingId)
    if (!result.ok) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: result.message },
        { status: result.status }
      )
    }

    return NextResponse.json<ApiSuccessResponse<{ saved: boolean }>>({
      success: true,
      data: { saved: result.saved },
    })
  } catch (err) {
    console.error("[PATCH /api/saved/toggle]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to toggle save." },
      { status: 500 }
    )
  }
}
