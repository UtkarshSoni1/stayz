import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/listing";

// ─── GET /api/user ─────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Unauthorised." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        role: true,
        createdAt: true,
        phone: true,
        whatsappNumber: true,
      },
    });

    if (!user) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiSuccessResponse<typeof user>>({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error("[GET /api/user]", err);
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to fetch user." },
      { status: 500 }
    );
  }
}

// ─── PATCH /api/user ───────────────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Unauthorised." },
        { status: 401 }
      );
    }

    const body = await req.json() as {
      name?: string;
      image?: string;
      bio?: string | null;
      phone?: string;
      whatsappNumber?: string;
    };

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.bio !== undefined && { bio: body.bio }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.whatsappNumber !== undefined && { whatsappNumber: body.whatsappNumber }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        role: true,
        phone: true,
        whatsappNumber: true,
      },
    });

    return NextResponse.json<ApiSuccessResponse<typeof updated>>({
      success: true,
      data: updated,
    });
  } catch (err) {
    console.error("[PATCH /api/user]", err);
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to update user." },
      { status: 500 }
    );
  }
}
