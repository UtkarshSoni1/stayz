interface IconLabelProps {
  icon: string;
  label: string;
  className?: string;
  iconClassName?: string;
  filled?: boolean;
}

export function IconLabel({
  icon,
  label,
  className = "",
  iconClassName = "text-primary text-xl",
  filled = false,
}: IconLabelProps) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <span
        className={`material-symbols-outlined ${iconClassName}`}
        style={
          filled
            ? { fontVariationSettings: '"FILL" 1, "wght" 300, "GRAD" 0, "opsz" 24' }
            : undefined
        }
      >
        {icon}
      </span>
      <span>{label}</span>
    </span>
  );
}
