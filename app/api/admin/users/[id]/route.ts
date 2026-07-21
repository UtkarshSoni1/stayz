import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/listing"
import type { AdminUserDetailDTO, PatchUserPayload } from "@/types/admin"
import type { Role, AccountStatus } from "@prisma/client"

const VALID_ROLES: Role[] = ["USER", "OWNER", "ADMIN"]
const VALID_STATUSES: AccountStatus[] = ["ACTIVE", "SUSPENDED", "BANNED"]

// ─── GET /api/admin/users/[id] ────────────────────────────────────────────────
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
    const found = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        role: true,
        accountStatus: true,
        emailVerified: true,
        createdAt: true,
        phone: true,
        whatsappNumber: true,
        _count: { select: { listings: true, reviews: true } },
      },
    })

    if (!found) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "User not found." },
        { status: 404 }
      )
    }

    const data: AdminUserDetailDTO = {
      ...found,
      emailVerified: found.emailVerified?.toISOString() ?? null,
      createdAt: found.createdAt.toISOString(),
    }

    return NextResponse.json<ApiSuccessResponse<AdminUserDetailDTO>>(
      { success: true, data },
      { status: 200 }
    )
  } catch (err) {
    console.error("[GET /api/admin/users/[id]]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to fetch user." },
      { status: 500 }
    )
  }
}

// ─── PATCH /api/admin/users/[id] ──────────────────────────────────────────────
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
    let body: PatchUserPayload
    try {
      body = (await req.json()) as PatchUserPayload
    } catch {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Invalid JSON." },
        { status: 400 }
      )
    }

    // Prevent self-demotion
    if (id === user.id && body.role && body.role !== "ADMIN") {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "You cannot demote yourself." },
        { status: 400 }
      )
    }

    // Prevent self-suspension
    if (id === user.id && body.accountStatus && body.accountStatus !== "ACTIVE") {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "You cannot suspend your own account." },
        { status: 400 }
      )
    }

    // Validate role
    if (body.role && !VALID_ROLES.includes(body.role)) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Invalid role." },
        { status: 400 }
      )
    }

    // Validate accountStatus
    if (body.accountStatus && !VALID_STATUSES.includes(body.accountStatus)) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Invalid account status." },
        { status: 400 }
      )
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.role !== undefined && { role: body.role }),
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
        _count: { select: { listings: true, reviews: true } },
      },
    })

    return NextResponse.json<ApiSuccessResponse<typeof updated>>(
      { success: true, data: updated },
      { status: 200 }
    )
  } catch (err) {
    console.error("[PATCH /api/admin/users/[id]]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to update user." },
      { status: 500 }
    )
  }
}

// ─── DELETE /api/admin/users/[id] ────────────────────────────────────────────
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

    if (id === user.id) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "You cannot delete your own account." },
        { status: 400 }
      )
    }

    const found = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    })
    if (!found) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "User not found." },
        { status: 404 }
      )
    }

    await prisma.user.delete({ where: { id } })

    return NextResponse.json<ApiSuccessResponse<{ id: string }>>(
      { success: true, data: { id } },
      { status: 200 }
    )
  } catch (err) {
    console.error("[DELETE /api/admin/users/[id]]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to delete user." },
      { status: 500 }
    )
  }
}
