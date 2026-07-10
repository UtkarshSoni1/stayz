import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/listing";

// ─── POST /api/listings/[id]/contact-click ─────────────────────────────────────
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Increment contact click count on the listing
    await prisma.listing.update({
      where: { id },
      data: {
        contactClickCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json<ApiSuccessResponse<null>>(
      { success: true, data: null },
      { status: 200 }
    );
  } catch (err) {
    console.error("[POST /api/listings/[id]/contact-click]", err);
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Failed to record contact click." },
      { status: 500 }
    );
  }
}
