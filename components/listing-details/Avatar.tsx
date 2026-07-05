interface AvatarProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  bordered?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "w-10 h-10",
  md: "w-16 h-16",
  lg: "w-20 h-20",
};

export function Avatar({
  src,
  alt,
  size = "md",
  bordered = false,
  className = "",
}: AvatarProps) {
  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden shrink-0 ${
        bordered ? "border-2 border-primary" : ""
      } ${className}`}
    >
      <img className="w-full h-full object-cover" src={src} alt={alt} />
    </div>
  );
}
