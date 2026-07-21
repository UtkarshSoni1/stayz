import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/listing"
import type { AccountStatus } from "@prisma/client"

const VALID_STATUSES: AccountStatus[] = ["ACTIVE", "SUSPENDED", "BANNED"]

// ─── PATCH /api/admin/owners/[id] ─────────────────────────────────────────────
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

    let body: { accountStatus?: AccountStatus }
    try {
      body = (await req.json()) as { accountStatus?: AccountStatus }
    } catch {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Invalid JSON." },
        { status: 400 }
      )
    }

    if (
      body.accountStatus !== undefined &&
      !VALID_STATUSES.includes(body.accountStatus)
    ) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Invalid account status." },
        { status: 400 }
      )
    }

    const owner = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    })

    if (!owner) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Owner not found." },
        { status: 404 }
      )
    }

    if (owner.role !== "OWNER") {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "User is not an owner." },
        { status: 400 }
      )
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(body.accountStatus !== undefined && {
          accountStatus: body.accountStatus,
        }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        accountStatus: true,
        emailVerified: true,
        createdAt: true,
        _count: { select: { listings: true } },
      },
    })

    return NextResponse.json<ApiSuccessResponse<typeof updated>>(
      { success: true, data: updated },
      { status: 200 }
    )
  } catch (err) {
    console.error("[PATCH /api/admin/owners/[id]]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to update owner." },
      { status: 500 }
    )
  }
}
