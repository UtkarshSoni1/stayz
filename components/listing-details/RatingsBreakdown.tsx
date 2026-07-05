import type { RatingBreakdown } from "@/types/listing-detail";
import { StarRating } from "./StarRating";

interface RatingsBreakdownProps {
  breakdown: RatingBreakdown;
}

export function RatingsBreakdown({ breakdown }: RatingsBreakdownProps) {
  const hasReviews = breakdown.reviewCount > 0;

  if (!hasReviews) {
    return (
      <section className="border-b border-outline-variant/30 pb-10 mb-10">
        <p className="text-on-surface-variant text-sm">
          No reviews yet — be the first to leave one.
        </p>
      </section>
    );
  }

  return (
    <section className="border-b border-outline-variant/30 pb-10 mb-10">
      <div className="flex flex-col md:flex-row gap-10 items-start">
        {/* Overall score */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-display-lg text-[48px] font-black text-white leading-none">
            {breakdown.overall.toFixed(2)}
          </span>
          <div>
            <StarRating rating={breakdown.overall} showValue={false} size="lg" />
            <p className="text-on-surface-variant text-sm mt-1">
              {breakdown.reviewCount} review{breakdown.reviewCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Category bars */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 w-full">
          {breakdown.categories.map((category) => (
            <div key={category.label} className="flex items-center gap-4">
              <span className="text-on-surface text-sm w-28 shrink-0">
                {category.label}
              </span>
              <div className="flex-1 h-1 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(category.score / 5) * 100}%` }}
                />
              </div>
              <span className="text-white text-sm font-bold w-8 text-right">
                {category.score.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
