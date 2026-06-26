import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/listing";

// ─── POST /api/upload ──────────────────────────────────────────────────────────
// Expects multipart/form-data with an "image" field.
// Returns the uploaded image URL (implement your storage provider here).
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Unauthorised." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("image");

    if (!file || typeof file === "string") {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "No image file provided." },
        { status: 400 }
      );
    }

    // TODO: integrate Cloudinary / S3 / your storage provider here.
    // e.g. const result = await cloudinary.uploader.upload(buffer, { ... });
    // For now return a placeholder so the route is a valid module.
    return NextResponse.json<ApiSuccessResponse<{ url: string }>>(
      { success: true, data: { url: "" } },
      { status: 200 }
    );
  } catch (err) {
    console.error("[POST /api/upload]", err);
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Upload failed." },
      { status: 500 }
    );
  }
}
