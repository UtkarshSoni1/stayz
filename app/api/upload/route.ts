import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { uploadToCloudinary } from "@/lib/cloudinary"
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/listing"

// ─── Constants ─────────────────────────────────────────────────────────────────
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"])

// ─── POST /api/upload ──────────────────────────────────────────────────────────
// Expects multipart/form-data with a single "image" field.
// Validates type + size server-side, uploads to Cloudinary, returns { url, publicId }.
export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate — never allow anonymous uploads
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "You must be signed in to upload images." },
        { status: 401 }
      )
    }

    // 2. Parse multipart body
    let formData: FormData
    try {
      formData = await req.formData()
    } catch {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Invalid multipart form data." },
        { status: 400 }
      )
    }

    const file = formData.get("image")

    if (!file || typeof file === "string") {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "No image file provided." },
        { status: 400 }
      )
    }

    // 3. Validate MIME type
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json<ApiErrorResponse>(
        {
          success: false,
          error: `Invalid file type "${file.type}". Only JPG, PNG and WEBP are allowed.`,
        },
        { status: 415 }
      )
    }

    // 4. Validate file size
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json<ApiErrorResponse>(
        {
          success: false,
          error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is 5 MB.`,
        },
        { status: 413 }
      )
    }

    // 5. Convert to Buffer for Cloudinary
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 6. Upload to Cloudinary
    const { url, publicId } = await uploadToCloudinary(buffer, {
      folder: "stayz/listings",
    })

    return NextResponse.json<ApiSuccessResponse<{ url: string; publicId: string }>>(
      { success: true, data: { url, publicId } },
      { status: 200 }
    )
  } catch (err) {
    console.error("[POST /api/upload]", err)
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: "Upload failed. Please try again." },
      { status: 500 }
    )
  }
}
