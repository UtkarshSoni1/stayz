interface StarRatingProps {
  rating: number;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
};

export function StarRating({
  rating,
  showValue = true,
  size = "md",
  className = "",
}: StarRatingProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span
        className={`material-symbols-outlined text-primary ${sizeClasses[size]}`}
        style={{ fontVariationSettings: '"FILL" 1, "wght" 300, "GRAD" 0, "opsz" 24' }}
      >
        star
      </span>
      {showValue && <span className="font-bold text-white">{rating.toFixed(2)}</span>}
    </div>
  );
}
