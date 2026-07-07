import { v2 as cloudinary } from "cloudinary"

// ─── Configure once via env vars ──────────────────────────────────────────────
// Never expose these on the client — this file is server-only.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export { cloudinary }

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface CloudinaryUploadResult {
  url: string
  publicId: string
}

// ─── uploadToCloudinary ────────────────────────────────────────────────────────
// Accepts a Node.js Buffer and uploads it to the given folder.
// Returns the secure URL and public_id.

export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    folder?: string
    filename?: string
    transformation?: object[]
  } = {}
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder ?? "stayz/listings",
      use_filename: !!options.filename,
      unique_filename: true,
      overwrite: false,
      resource_type: "image" as const,
      transformation: options.transformation ?? [
        // Auto quality + format optimisation on upload
        { quality: "auto:good", fetch_format: "auto" },
      ],
    }

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (err, result) => {
        if (err || !result) {
          reject(err ?? new Error("Cloudinary upload returned no result"))
          return
        }
        resolve({ url: result.secure_url, publicId: result.public_id })
      }
    )

    stream.end(buffer)
  })
}

// ─── deleteFromCloudinary ──────────────────────────────────────────────────────
// Deletes a single image by its public_id. Safe to call even if the asset
// no longer exists — Cloudinary returns "not found" which we ignore.

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" })
  } catch (err) {
    // Log but never throw — a missing asset should not crash listing deletion
    console.warn(`[Cloudinary] Failed to delete ${publicId}:`, err)
  }
}

// ─── deleteManyFromCloudinary ──────────────────────────────────────────────────
// Bulk-deletes up to 100 public_ids in one API call (Cloudinary limit).

export async function deleteManyFromCloudinary(publicIds: string[]): Promise<void> {
  if (publicIds.length === 0) return

  // Cloudinary's delete_resources accepts max 100 ids per call
  const chunks: string[][] = []
  for (let i = 0; i < publicIds.length; i += 100) {
    chunks.push(publicIds.slice(i, i + 100))
  }

  await Promise.allSettled(
    chunks.map((chunk) =>
      cloudinary.api
        .delete_resources(chunk, { resource_type: "image" })
        .catch((err) => console.warn("[Cloudinary] bulk delete partial error:", err))
    )
  )
}
