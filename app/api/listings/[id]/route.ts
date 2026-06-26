import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/listing";

// ─── GET /api/listings/[id] ────────────────────────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        amenities: { include: { amenity: true } },
        owner: { select: { id: true, name: true, image: true } },
      },
    });

    if (!listing) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Listing not found." },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiSuccessResponse<typeof listing>>({
      success: true,
      data: listing,
    });
  } catch (err) {
    console.error("[GET /api/listings/[id]]", err);
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to fetch listing." },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/listings/[id] ─────────────────────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Unauthorised." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const listing = await prisma.listing.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!listing) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Listing not found." },
        { status: 404 }
      );
    }

    if (listing.ownerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Forbidden." },
        { status: 403 }
      );
    }

    await prisma.listing.delete({ where: { id } });

    return NextResponse.json<ApiSuccessResponse<null>>({
      success: true,
      data: null,
    });
  } catch (err) {
    console.error("[DELETE /api/listings/[id]]", err);
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to delete listing." },
      { status: 500 }
    );
  }
}
