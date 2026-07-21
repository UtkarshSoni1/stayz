import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/listing"
import type { AdminOwnerDTO, PaginatedResponse } from "@/types/admin"

const PAGE_SIZE = 20

// ─── GET /api/admin/owners ────────────────────────────────────────────────────
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
    const accountStatus = searchParams.get("accountStatus") || undefined
    const page = Math.max(1, Number(searchParams.get("page") || 1))

    const where = {
      role: "OWNER" as const,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { id: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      ...(accountStatus && {
        accountStatus: accountStatus as "ACTIVE" | "SUSPENDED" | "BANNED",
      }),
    }

    const [owners, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          accountStatus: true,
          emailVerified: true,
          createdAt: true,
          _count: {
            select: { listings: true },
          },
        },
      }),
      prisma.user.count({ where }),
    ])

    const data: AdminOwnerDTO[] = owners.map((o) => ({
      ...o,
      emailVerified: o.emailVerified?.toISOString() ?? null,
      createdAt: o.createdAt.toISOString(),
    }))

    return NextResponse.json<ApiSuccessResponse<PaginatedResponse<AdminOwnerDTO>>>(
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
    console.error("[GET /api/admin/owners]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to fetch owners." },
      { status: 500 }
    )
  }
}
