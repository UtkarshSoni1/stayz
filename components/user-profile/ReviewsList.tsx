import Link from "next/link";
import type { UserProfileReview } from "@/data/user-profile";

interface ReviewsListProps {
  reviews: UserProfileReview[];
}

/** ISO date → "Month YYYY" */
function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

/**
 * Shared reviews-written list used in both PrivateProfileView and
 * PublicProfileView. Shows reviews the user has authored across listings.
 */
export function ReviewsList({ reviews }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <span className="material-symbols-outlined text-4xl text-white/20 mb-3 block">
          rate_review
        </span>
        <p className="text-white/40 text-sm">No reviews written yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Link
          key={review.id}
          href={`/listings/${review.listing.id}`}
          className="glass-card rounded-2xl p-5 flex gap-4 hover:border-white/20 transition-all group block"
        >
          {/* Listing thumbnail */}
          {review.listing.image && (
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
              <img
                src={review.listing.image}
                alt={review.listing.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate group-hover:text-teal-400 transition-colors">
              {review.listing.title}
            </p>

            {/* Star rating */}
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`material-symbols-outlined text-sm ${
                    i < review.rating
                      ? "text-amber-400"
                      : "text-white/15"
                  }`}
                  style={{
                    fontVariationSettings:
                      i < review.rating
                        ? '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 20'
                        : '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 20',
                  }}
                >
                  star
                </span>
              ))}
              <span className="text-white/40 text-xs ml-2">
                {formatDate(review.createdAt)}
              </span>
            </div>

            {review.comment && (
              <p className="text-white/60 text-sm mt-2 line-clamp-2 leading-relaxed">
                {review.comment}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
