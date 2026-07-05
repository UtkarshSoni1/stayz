import type { Review } from "@/types/listing-detail";
import { Avatar } from "./Avatar";
import { StarRating } from "./StarRating";

interface ReviewsSectionProps {
  reviews: Review[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  if (reviews.length === 0) return null;

  return (
    <section className="border-b border-outline-variant/30 pb-10 mb-10">
      <h3 className="font-headline-lg text-headline-lg text-white mb-8">
        {reviews.length} guest reviews
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reviews.map((review) => (
          <article key={review.id} className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar src={review.avatarUrl} alt={review.avatarAlt} size="sm" />
              <div>
                <p className="font-label-bold text-white">{review.author}</p>
                <p className="text-on-surface-variant text-sm">{review.date}</p>
              </div>
            </div>
            <StarRating rating={review.rating} size="sm" />
            <p className="text-on-surface-variant leading-relaxed">{review.comment}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
