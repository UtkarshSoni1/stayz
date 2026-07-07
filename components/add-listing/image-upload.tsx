"use client"

import { useCallback, useRef, useState } from "react"
import { ImageIcon, UploadCloud, X, GripVertical, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface UploadedImage {
  /** Client-side unique key (timestamp + name) */
  key: string
  /** Original File object — kept for display name / retry */
  file: File
  /** Object URL for the preview <img> */
  preview: string
  /** 0–100 upload progress */
  progress: number
  /** Set once upload completes */
  url?: string
  /** Cloudinary public_id — set once upload completes */
  publicId?: string
  /** Set if the upload fails */
  error?: string
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const MAX_IMAGES = 10
const MAX_SIZE_MB = 5
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024
const ALLOWED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"])
const ALLOWED_EXT_LABEL = "JPG, PNG, WEBP"

// ─── Props ─────────────────────────────────────────────────────────────────────

interface ImageUploadProps {
  images: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
  errors: Record<string, string>
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function ImageUpload({ images, onChange, errors }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const dragRef = useRef(false)
  const [isDragging, setIsDragging] = useState(false)

  // ── Locally-owned mutable ref ────────────────────────────────────────────────
  // We own this ref and update it synchronously every time onChange is called.
  // This avoids stale-closure bugs: patchImage / addFiles always read the
  // latest list even before React has processed a setState and re-rendered.
  const localRef = useRef<UploadedImage[]>(images)

  // Keep in sync with external resets (e.g. form reset)
  if (localRef.current !== images && images.length === 0) {
    localRef.current = images
  }

  // Wrapper that keeps localRef in sync AND notifies the parent
  const stableOnChange = useCallback(
    (updated: UploadedImage[]) => {
      localRef.current = updated
      onChange(updated)
    },
    [onChange]
  )

  // ── Patch helper: immutably update one image by key ────────────────────────

  const patchImage = useCallback(
    (key: string, patch: Partial<UploadedImage>) => {
      const updated = localRef.current.map((img) =>
        img.key === key ? { ...img, ...patch } : img
      )
      localRef.current = updated
      onChange(updated)
    },
    [onChange]
  )

  // ── Upload a single file to /api/upload ────────────────────────────────────

  const uploadFile = useCallback(
    async (file: File, key: string) => {
      const fd = new FormData()
      fd.append("image", file)

      try {
        patchImage(key, { progress: 10 })

        const res = await fetch("/api/upload", { method: "POST", body: fd })

        patchImage(key, { progress: 80 })

        const json = await res.json()

        if (!res.ok || !json.success) {
          patchImage(key, { progress: 0, error: json.error ?? "Upload failed. Please try again." })
          return
        }

        patchImage(key, { progress: 100, url: json.data.url, publicId: json.data.publicId, error: undefined })
      } catch {
        patchImage(key, { progress: 0, error: "Network error — please check your connection." })
      }
    },
    [patchImage]
  )

  // ── Add files ────────────────────────────────────────────────────────────────

  const addFiles = useCallback(
    (rawFiles: File[]) => {
      const current = localRef.current
      const slots = MAX_IMAGES - current.length
      if (slots <= 0) return

      const newEntries: UploadedImage[] = []
      const skipped: string[] = []

      for (const file of rawFiles) {
        if (newEntries.length >= slots) break

        if (!ALLOWED_TYPES.has(file.type)) {
          skipped.push(`"${file.name}" — unsupported type`)
          continue
        }
        if (file.size > MAX_SIZE_BYTES) {
          skipped.push(`"${file.name}" — exceeds ${MAX_SIZE_MB} MB`)
          continue
        }

        const key = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`
        newEntries.push({
          key,
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
        })
      }

      if (newEntries.length === 0) return

      // stableOnChange updates localRef.current synchronously BEFORE uploadFile runs,
      // so patchImage inside uploadFile will always find the new entries.
      stableOnChange([...current, ...newEntries])

      // Fire uploads — patchImage reads localRef which now has the new entries
      newEntries.forEach((entry) => uploadFile(entry.file, entry.key))

      if (skipped.length > 0) {
        console.warn("[ImageUpload] Skipped files:", skipped.join("; "))
      }
    },
    [stableOnChange, uploadFile]
  )

  // ── Remove ───────────────────────────────────────────────────────────────────

  const removeImage = useCallback(
    (key: string) => {
      const target = localRef.current.find((img) => img.key === key)
      if (target?.preview) URL.revokeObjectURL(target.preview)
      stableOnChange(localRef.current.filter((img) => img.key !== key))
    },
    [stableOnChange]
  )

  // ── Retry failed upload ───────────────────────────────────────────────────────

  const retryImage = useCallback(
    (key: string) => {
      const target = localRef.current.find((img) => img.key === key)
      if (!target) return
      patchImage(key, { progress: 0, error: undefined })
      uploadFile(target.file, key)
    },
    [patchImage, uploadFile]
  )

  // ── Drag handlers ────────────────────────────────────────────────────────────

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      dragRef.current = false
      setIsDragging(false)
      addFiles(Array.from(e.dataTransfer.files))
    },
    [addFiles]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!dragRef.current) { dragRef.current = true; setIsDragging(true) }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      dragRef.current = false
      setIsDragging(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files ?? []))
    e.target.value = ""
  }

  const uploadingCount = images.filter((img) => !img.url && !img.error).length
  const errorCount = images.filter((img) => !!img.error).length

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-500/10">
            <ImageIcon className="h-4 w-4 text-pink-400" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Photos
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              {images.length > 0
                ? `${images.length}/${MAX_IMAGES} photos${uploadingCount > 0 ? ` · ${uploadingCount} uploading…` : ""}${errorCount > 0 ? ` · ${errorCount} failed` : ""}`
                : `Add up to ${MAX_IMAGES} photos. First photo is the cover.`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Drop Zone — hidden when at max */}
        {images.length < MAX_IMAGES && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            id="image-upload-dropzone"
            aria-label="Upload images. Click or drag and drop."
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") inputRef.current?.click()
            }}
            className={cn(
              "group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 transition-all duration-300",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
              isDragging
                ? "border-pink-400/60 bg-pink-500/8 scale-[1.01]"
                : "border-border/40 bg-background/30 hover:border-border/70 hover:bg-muted/20"
            )}
          >
            <input
              ref={inputRef}
              type="file"
              id="image-file-input"
              multiple
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="sr-only"
            />

            <div className={cn(
              "flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300",
              isDragging ? "bg-pink-500/20 scale-110" : "bg-muted/60 group-hover:bg-muted"
            )}>
              <UploadCloud className={cn(
                "h-7 w-7 transition-all duration-300",
                isDragging ? "text-pink-400" : "text-muted-foreground group-hover:text-foreground"
              )} />
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                {isDragging ? "Drop photos here" : "Drag & drop or click to upload"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                {ALLOWED_EXT_LABEL} · Max {MAX_SIZE_MB} MB each · Up to {MAX_IMAGES} photos
              </p>
            </div>
          </div>
        )}

        {/* Global form error */}
        {errors.images && (
          <p className="text-xs text-destructive flex items-center gap-1.5">
            <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
            {errors.images}
          </p>
        )}

        {/* Preview Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {images.map((img, index) => (
              <div
                key={img.key}
                className={cn(
                  "group relative aspect-square overflow-hidden rounded-xl border bg-muted/30",
                  img.error
                    ? "border-destructive/50"
                    : img.url
                    ? "border-emerald-500/30"
                    : "border-border/40"
                )}
              >
                {/* Cover badge — shown on first image once uploaded */}
                {index === 0 && img.url && (
                  <span className="absolute left-1.5 top-1.5 z-10 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                    Cover
                  </span>
                )}

                {/* Preview image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.preview}
                  alt={`Upload preview ${index + 1}`}
                  loading="lazy"
                  className={cn(
                    "h-full w-full object-cover transition-all duration-300",
                    img.url ? "group-hover:scale-105" : "opacity-60"
                  )}
                />

                {/* Upload progress overlay */}
                {!img.url && !img.error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                    <Loader2 className="h-5 w-5 animate-spin text-white mb-2" />
                    <div className="w-3/4 h-1 rounded-full bg-white/20 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-pink-400 transition-all duration-300"
                        style={{ width: `${img.progress}%` }}
                      />
                    </div>
                    <span className="mt-1.5 text-[10px] text-white/80">{img.progress}%</span>
                  </div>
                )}

                {/* Error overlay */}
                {img.error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-destructive/20 backdrop-blur-[2px] p-1">
                    <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                    <p className="text-[9px] text-destructive text-center leading-tight font-medium line-clamp-2">
                      {img.error}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); retryImage(img.key) }}
                      className="mt-0.5 rounded-full bg-destructive/80 px-2 py-0.5 text-[9px] text-white font-medium hover:bg-destructive transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Success checkmark (visible on hover) */}
                {img.url && (
                  <div className="absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 drop-shadow" />
                  </div>
                )}

                {/* Hover overlay — remove button + drag hint */}
                <div className="absolute inset-0 flex items-start justify-end bg-black/0 p-1.5 transition-all duration-200 group-hover:bg-black/20">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(img.key) }}
                    aria-label={`Remove photo ${index + 1}`}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 hover:bg-black/80"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="absolute bottom-1.5 left-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <GripVertical className="h-3.5 w-3.5 text-white/70" />
                </div>
              </div>
            ))}

            {/* Add-more slot */}
            {images.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                aria-label="Add more photos"
                className="group flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border/40 bg-background/20 text-muted-foreground transition-all duration-200 hover:border-border/70 hover:bg-muted/20 hover:text-foreground"
              >
                <span className="text-xl leading-none">+</span>
                <span className="text-[10px] font-medium">Add more</span>
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
