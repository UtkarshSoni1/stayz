"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { Review } from "@/types/listing-detail"
import { Avatar } from "./Avatar"
import { StarRating } from "./StarRating"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ReviewFormModal } from "./ReviewFormModal"
import { Star } from "lucide-react"
import { useToast } from "@/components/ui/toast"


interface ReviewsSectionProps {
  reviews: Review[]
  listingId: string
}

interface EligibilityData {
  eligible: boolean
  reason?: string
  alreadyReviewed: boolean
  existingReview: any | null
}

export function ReviewsSection({ reviews, listingId }: ReviewsSectionProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [eligibility, setEligibility] = useState<EligibilityData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [localReviews, setLocalReviews] = useState<Review[]>(reviews)

  useEffect(() => {
    setLocalReviews(reviews)
  }, [reviews])

  const fetchEligibility = async () => {
    try {
      const res = await fetch(`/api/listings/${listingId}/review-eligibility`)
      if (res.ok) {
        const json = await res.json()
        if (json.success) {
          setEligibility(json.data)
        }
      }
    } catch (e) {
      console.error("Failed to check review eligibility", e)
    }
  }

  useEffect(() => {
    fetchEligibility()
  }, [listingId])

  const handleReviewSuccess = () => {
    // Refresh the server component data (updates the reviews list and breakdowns)
    router.refresh()
    // Refresh local eligibility state
    fetchEligibility()
  }

  const handleDeleteReview = async () => {
    if (isDeleting || !eligibility?.existingReview) return

    const confirmDelete = window.confirm("Are you sure you want to delete your review?")
    if (!confirmDelete) return

    const previousReviews = localReviews
    // Optimistic update
    setLocalReviews(localReviews.filter((r) => r.id !== eligibility.existingReview.id))

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/listings/${listingId}/reviews`, {
        method: "DELETE",
      })

      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to delete review.")
      }

      toast("Review deleted successfully", "success")
      router.refresh()
      fetchEligibility()
    } catch (err: any) {
      // Rollback
      setLocalReviews(previousReviews)
      toast(err.message || "Failed to delete review.", "error")
    } finally {
      setIsDeleting(false)
    }
  }

  // Render the CTA Button according to eligibility state
  const renderReviewButton = () => {
    if (!eligibility) {
      // Loading state skeleton
      return (
        <div className="h-10 w-36 bg-surface-container-high animate-pulse rounded-full" />
      )
    }

    const { eligible, reason, alreadyReviewed } = eligibility

    if (!eligible && reason === "sign_in_required") {
      return (
        <Link
          href={`/login?redirectTo=/listings/${listingId}`}
          className="inline-flex items-center gap-2 bg-surface-container border border-outline-variant hover:bg-surface-container-high text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95 shadow-sm"
        >
          <Star className="w-4 h-4 fill-current text-primary" />
          Sign in to leave a review
        </Link>
      )
    }

    if (!eligible && reason === "not_a_tenant") {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-block cursor-not-allowed">
                <button
                  type="button"
                  disabled
                  className="pointer-events-none flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant/40 px-5 py-2.5 rounded-full font-bold text-sm select-none opacity-50"
                >
                  <Star className="w-4 h-4 text-on-surface-variant/30" />
                  Add your review
                </button>
              </span>
            </TooltipTrigger>
            <TooltipContent className="bg-popover text-popover-foreground border border-outline-variant text-xs py-1.5 px-3 rounded-md shadow-lg">
              Only past tenants with an accepted booking request can review this listing
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    // Eligible users
    return (
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:brightness-110 text-on-primary px-5 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95 shadow-md"
        >
          <Star className="w-4 h-4 fill-current text-on-primary" />
          {alreadyReviewed ? "Edit your review" : "Add your review"}
        </button>
        {alreadyReviewed && (
          <button
            type="button"
            onClick={handleDeleteReview}
            disabled={isDeleting}
            className="flex items-center gap-2 bg-red-600/20 border border-red-500/30 hover:bg-red-600/30 text-red-400 px-5 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95 shadow-sm disabled:opacity-50"
          >
            {isDeleting ? (
              <span className="material-symbols-outlined text-sm animate-spin">
                progress_activity
              </span>
            ) : (
              <span className="material-symbols-outlined text-sm">delete</span>
            )}
            Delete review
          </button>
        )}
      </div>
    )
  }

  return (
    <section className="border-b border-outline-variant/30 pb-10 mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h3 className="font-heading text-2xl font-bold text-white">
          {localReviews.length === 0
            ? "No reviews yet"
            : `${localReviews.length} guest review${localReviews.length === 1 ? "" : "s"}`}
        </h3>
        <div>{renderReviewButton()}</div>
      </div>

      {localReviews.length === 0 ? (
        <p className="text-on-surface-variant text-sm">
          Be the first to share your feedback about staying here.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {localReviews.map((review) => {
            const isOwnReview = eligibility?.existingReview && review.id === eligibility.existingReview.id
            return (
              <article
                key={review.id}
                className="space-y-3 bg-surface-container/10 p-5 rounded-2xl border border-outline-variant/20 hover:border-outline-variant/40 transition-colors relative group/article"
              >
                <div className="flex items-center gap-4">
                  <Avatar
                    src={review.avatarUrl}
                    alt={review.avatarAlt}
                    size="sm"
                  />
                  <div>
                    <p className="font-semibold text-white text-sm">
                      {review.author}
                    </p>
                    <p className="text-on-surface-variant text-xs">
                      {review.date}
                    </p>
                  </div>
                </div>
                {isOwnReview && (
                  <button
                    type="button"
                    onClick={handleDeleteReview}
                    disabled={isDeleting}
                    className="absolute top-4 right-4 p-2 text-white/40 hover:text-red-400 hover:bg-white/5 rounded-full transition-all disabled:opacity-50"
                    title="Delete review"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                )}
                <div className="pt-1">
                  <StarRating rating={review.rating} size="sm" />
                </div>
                <p className="text-on-surface-variant text-sm leading-relaxed pt-1">
                  {review.comment || (
                    <span className="italic text-on-surface-variant/40">
                      No review text provided.
                    </span>
                  )}
                </p>
              </article>
            )
          })}
        </div>
      )}

      {eligibility?.eligible && (
        <ReviewFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          listingId={listingId}
          existingReview={eligibility.existingReview}
          onSuccess={handleReviewSuccess}
        />
      )}
    </section>
  )
}

