"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Star } from "lucide-react"

interface ExistingReview {
  id: string
  rating: number
  cleanliness: number
  accuracy: number
  checkIn: number
  communication: number
  location: number
  value: number
  comment: string | null
}

interface ReviewFormModalProps {
  isOpen: boolean
  onClose: () => void
  listingId: string
  existingReview: ExistingReview | null
  onSuccess: () => void
}

const CATEGORIES = [
  { key: "cleanliness", label: "Cleanliness" },
  { key: "accuracy", label: "Accuracy" },
  { key: "checkIn", label: "Check-in" },
  { key: "communication", label: "Communication" },
  { key: "location", label: "Location" },
  { key: "value", label: "Value" },
] as const

type RatingKeys = (typeof CATEGORIES)[number]["key"]

export function ReviewFormModal({
  isOpen,
  onClose,
  listingId,
  existingReview,
  onSuccess,
}: ReviewFormModalProps) {
  const [ratings, setRatings] = useState<Record<RatingKeys, number>>({
    cleanliness: 5,
    accuracy: 5,
    checkIn: 5,
    communication: 5,
    location: 5,
    value: 5,
  })
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Populate form if existingReview is provided
  useEffect(() => {
    if (existingReview) {
      setRatings({
        cleanliness: existingReview.cleanliness,
        accuracy: existingReview.accuracy,
        checkIn: existingReview.checkIn,
        communication: existingReview.communication,
        location: existingReview.location,
        value: existingReview.value,
      })
      setComment(existingReview.comment || "")
    } else {
      setRatings({
        cleanliness: 5,
        accuracy: 5,
        checkIn: 5,
        communication: 5,
        location: 5,
        value: 5,
      })
      setComment("")
    }
    setError(null)
  }, [existingReview, isOpen])

  const handleRatingChange = (key: RatingKeys, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch(`/api/listings/${listingId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...ratings,
          comment: comment.trim() || undefined,
        }),
      })

      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to submit review.")
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setSubmitting(false)
    }
  }

  // Calculate dynamic overall average for real-time user preview
  const average =
    Math.round(
      (Object.values(ratings).reduce((a, b) => a + b, 0) / CATEGORIES.length) * 10
    ) / 10

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg bg-[#0A0A0A] border border-outline-variant p-6 rounded-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold text-white">
            {existingReview ? "Edit your review" : "Add your review"}
          </DialogTitle>
          <DialogDescription className="text-on-surface-variant text-sm">
            Share your experience to help future guests make informed choices.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Categories Grid */}
          <div className="space-y-4 bg-surface-container/30 p-4 rounded-2xl border border-outline-variant/30">
            {CATEGORIES.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-white text-sm font-medium">{label}</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = ratings[key] >= star
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(key, star)}
                        className="p-1 transition-transform active:scale-90 hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            active
                              ? "fill-primary text-primary"
                              : "text-outline-variant hover:text-outline"
                          }`}
                        />
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic Overall Summary Indicator */}
          <div className="flex items-center justify-between px-2 text-sm text-on-surface-variant">
            <span>Overall Score (Calculated Average):</span>
            <span className="flex items-center gap-1 font-bold text-white bg-primary-container text-on-primary-container px-2.5 py-1 rounded-md">
              <Star className="w-4 h-4 fill-current text-primary" />
              {average.toFixed(1)}
            </span>
          </div>

          {/* Comment Field */}
          <div className="space-y-2">
            <label className="block text-white text-sm font-medium">
              Write a comment (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others what you loved or what could be improved..."
              rows={4}
              maxLength={1000}
              className="w-full bg-[#1a1a1a] border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-on-surface-variant/40 outline-none resize-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-3 rounded-full border border-outline-variant text-on-surface font-bold text-sm transition-colors hover:bg-surface-container active:scale-95 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-full bg-blue-600 text-on-primary font-bold text-sm transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && (
                <span className="material-symbols-outlined text-sm animate-spin">
                  progress_activity
                </span>
              )}
              {existingReview ? "Update Review" : "Submit Review"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
