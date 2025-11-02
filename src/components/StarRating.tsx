import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export function StarRating({ 
  rating, 
  onRatingChange, 
  readonly = false,
  size = "md",
  showValue = false,
  className 
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          disabled={readonly}
          className={cn(
            "transition-all",
            !readonly && "hover:scale-110 cursor-pointer",
            readonly && "cursor-default"
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              star <= rating
                ? "text-[hsl(40,90%,55%)] fill-[hsl(40,90%,55%)]"
                : "text-white/30 fill-transparent",
              !readonly && "hover:text-[hsl(40,90%,65%)]"
            )}
          />
        </button>
      ))}
      {showValue && (
        <span className="text-sm font-bold text-white mr-2">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
