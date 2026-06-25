"use client"

import { useCallback, useRef, useState } from "react"
import { ImageIcon, UploadCloud, X, GripVertical } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  images: File[]
  onChange: (images: File[]) => void
  errors: Record<string, string>
}

export function ImageUpload({ images, onChange, errors }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<string[]>([])

  const addFiles = useCallback(
    (newFiles: File[]) => {
      const valid = newFiles.filter((f) => f.type.startsWith("image/"))
      const updated = [...images, ...valid].slice(0, 10)
      onChange(updated)

      // Generate preview URLs
      const newPreviews = valid.map((f) => URL.createObjectURL(f))
      setPreviews((prev) => [...prev, ...newPreviews].slice(0, 10))
    },
    [images, onChange]
  )

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index)
    const updatedPreviews = previews.filter((_, i) => i !== index)
    onChange(updated)
    setPreviews(updatedPreviews)
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const files = Array.from(e.dataTransfer.files)
      addFiles(files)
    },
    [addFiles]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    addFiles(files)
    // Reset so the same file can be re-selected if removed
    e.target.value = ""
  }

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
                ? `${images.length}/10 photos added`
                : "Add up to 10 photos. First photo is the cover."}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop Zone */}
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
            accept="image/*"
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
              PNG, JPG, WEBP up to 10MB each · Max 10 photos
            </p>
          </div>
        </div>

        {/* Error */}
        {errors.images && (
          <p className="text-xs text-destructive flex items-center gap-1.5">
            <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
            {errors.images}
          </p>
        )}

        {/* Preview Grid */}
        {previews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {previews.map((src, index) => (
              <div
                key={src}
                className="group relative aspect-square overflow-hidden rounded-xl border border-border/40 bg-muted/30"
              >
                {/* Cover Badge */}
                {index === 0 && (
                  <span className="absolute left-1.5 top-1.5 z-10 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                    Cover
                  </span>
                )}

                {/* Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Upload preview ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 flex items-start justify-end bg-black/0 p-1.5 transition-all duration-200 group-hover:bg-black/20">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeImage(index)
                    }}
                    aria-label={`Remove photo ${index + 1}`}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 hover:bg-black/80"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Drag handle hint */}
                <div className="absolute bottom-1.5 left-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <GripVertical className="h-3.5 w-3.5 text-white/70" />
                </div>
              </div>
            ))}

            {/* Add more slot */}
            {images.length < 10 && (
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
